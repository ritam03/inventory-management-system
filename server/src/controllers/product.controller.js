const pool = require("../config/db");

/* ============================
   CREATE PRODUCT (ADMIN)
============================ */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      barcode,
      price,
      quantity,
      low_stock_threshold
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products
       (name, sku, barcode, price, quantity, low_stock_threshold)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        sku,
        barcode,
        price,
        quantity ?? 0,
        low_stock_threshold ?? 5
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Product creation failed" });
  }
};

/* ============================
   GET ALL PRODUCTS
============================ */
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ============================
   GET PRODUCT BY BARCODE
============================ */
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const result = await pool.query(
      "SELECT * FROM products WHERE barcode = $1 AND is_active = true",
      [barcode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Barcode lookup failed" });
  }
};

/* ============================
   UPDATE PRODUCT (ADMIN)
============================ */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      sku,
      barcode,
      price,
      quantity,
      low_stock_threshold
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           sku = $2,
           barcode = $3,
           price = $4,
           quantity = $5,
           low_stock_threshold = $6
       WHERE id = $7
       RETURNING *`,
      [
        name,
        sku,
        barcode,
        price,
        quantity,
        low_stock_threshold ?? 5,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ============================
   DELETE PRODUCT (ADMIN)
============================ */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products
       SET is_active = false
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deactivated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};


/* ============================
   LOW STOCK PRODUCTS
============================ */
exports.getLowStockProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE quantity <= low_stock_threshold"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch low stock products" });
  }
};
