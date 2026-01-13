const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  createSale,
  cancelSale,
  getSales
} = require("../controllers/sales.controller");

router.post("/", authMiddleware, createSale);
router.get("/", authMiddleware, roleMiddleware("ADMIN"), getSales);
router.patch("/:id/cancel", authMiddleware, roleMiddleware("ADMIN"), cancelSale);

module.exports = router;
