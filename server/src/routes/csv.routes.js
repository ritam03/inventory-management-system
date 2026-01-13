const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  exportProducts,
  importProducts
} = require("../controllers/csv.controller");

const upload = multer({ dest: "uploads/" });

router.get(
  "/export/products",
  authMiddleware,
  roleMiddleware("ADMIN"),
  exportProducts
);

router.post(
  "/import/products",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("file"),
  importProducts
);

module.exports = router;
