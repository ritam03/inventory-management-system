const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const salesRoutes = require("./routes/sales.routes");
const csvRoutes = require("./routes/csv.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/csv", csvRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      status: "success",
      message: "Inventory Management API is running",
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

module.exports = app;
