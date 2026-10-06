const express = require("express");
const router = express.Router();

const {
  createWarehouseValidation,
  validate,
} = require("../middleware/validationMiddleware");

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const warehouseAuthorizationMiddleware = require("../middleware/warehouseAuthorizationMiddleware");

const {
  createWarehouse,
  getWarehouses,
  getWarehouse,
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

router.get(
  "/:warehouseId",
  authMiddleware,
  warehouseAuthorizationMiddleware,
  getWarehouse,
);

module.exports = router;
