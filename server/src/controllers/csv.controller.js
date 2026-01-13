const pool = require("../config/db");
const fs = require("fs");
const csv = require("csv-parser");
const { Parser } = require("json2csv");

// EXPORT PRODUCTS CSV
exports.exportProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, sku, barcode, price, quantity, low_stock_threshold FROM products"
    );

    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(result.rows);

    res.header("Content-Type", "text/csv");
    res.attachment("products.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: "CSV export failed" });
  }
};

// IMPORT PRODUCTS CSV
exports.importProducts = async (req, res) => {
  const results = [];
  const filePath = req.file.path;

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        for (const row of results) {
          if (!row.name || !row.sku || !row.barcode || !row.price) {
            continue; // skip invalid rows
          }

          await pool.query(
            `INSERT INTO products (name, sku, barcode, price, quantity, low_stock_threshold)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (sku) DO NOTHING`,
            [
              row.name,
              row.sku,
              row.barcode,
              row.price,
              row.quantity || 0,
              row.low_stock_threshold || 5
            ]
          );
        }

        fs.unlinkSync(filePath); // delete uploaded file

        res.status(201).json({ message: "CSV import completed" });
      });
  } catch (error) {
    res.status(500).json({ message: "CSV import failed" });
  }
};
