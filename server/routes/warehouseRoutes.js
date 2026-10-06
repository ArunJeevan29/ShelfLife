const express = require("express");
const router = express.Router();

const {
  createWarehouseValidation,
  validate,
} = require("../middleware/validationMiddleware");

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const { createWarehouse } = require("../controllers/warehouseController");

router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  createWarehouseValidation,
  validate,
  createWarehouse,
);

module.exports = router;
