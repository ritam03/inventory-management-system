const pool = require("../config/db");

// Create Sale (barcode-based)
exports.createSale = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items } = req.body;
    const userId = req.user.id;

    await client.query("BEGIN");

    let totalAmount = 0;
    const saleItemsData = [];

    for (const item of items) {
      const productResult = await client.query(
        "SELECT * FROM products WHERE barcode = $1 FOR UPDATE",
        [item.barcode]
      );

      if (productResult.rows.length === 0) {
        throw new Error("Product not found");
      }

      const product = productResult.rows[0];

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      await client.query(
        "UPDATE products SET quantity = quantity - $1 WHERE id = $2",
        [item.quantity, product.id]
      );

      totalAmount += item.quantity * product.price;

      saleItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const saleResult = await client.query(
      "INSERT INTO sales (user_id, total_amount) VALUES ($1, $2) RETURNING id",
      [userId, totalAmount]
    );

    const saleId = saleResult.rows[0].id;

    for (const si of saleItemsData) {
      await client.query(
        `INSERT INTO sale_items (sale_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [saleId, si.productId, si.quantity, si.price]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Sale completed successfully",
      saleId,
      totalAmount
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Cancel Sale (rollback stock)
exports.cancelSale = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const saleItemsResult = await client.query(
      "SELECT * FROM sale_items WHERE sale_id = $1",
      [id]
    );

    if (saleItemsResult.rows.length === 0) {
      throw new Error("Sale not found");
    }

    for (const item of saleItemsResult.rows) {
      await client.query(
        "UPDATE products SET quantity = quantity + $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      "UPDATE sales SET status = 'CANCELLED' WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");

    res.status(200).json({ message: "Sale cancelled and stock restored" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Get Sales History
exports.getSales = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sales ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};
