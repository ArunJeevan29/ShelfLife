const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const { receiveStock } = require("../controllers/inventoryController");

const {
  receiveStockValidation,
  validate,
} = require("../middleware/validationMiddleware");

router.post(
  "/receive",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER"]),
  receiveStockValidation,
  validate,
  receiveStock,
);

module.exports = router;
