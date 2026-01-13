const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  getProducts,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

// Get all products
router.get("/", authMiddleware, getProducts);

// Get product by barcode (used in Sales)
router.get("/barcode/:barcode", authMiddleware, getProductByBarcode);

// Create product (ADMIN)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProduct
);

// Update product (ADMIN)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateProduct
);

// Delete product (ADMIN)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteProduct
);

module.exports = router;
