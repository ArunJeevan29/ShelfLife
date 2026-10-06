const express = require("express");
const router = express.Router();

const {
  createWarehouseValidation,
  validate,
} = require("../middleware/validationMiddleware");

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  createWarehouse,
  getWarehouses,
} = require("../controllers/warehouseController");

router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  createWarehouseValidation,
  validate,
  createWarehouse,
);

router.get("/", authMiddleware, getWarehouses);

module.exports = router;
