const express = require("express");
const router = express.Router();

const {
  createWarehouseValidation,
  updateWarehouseValidation,
  updateWarehouseStatusValidation,
  validate,
} = require("../middleware/validationMiddleware");

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const warehouseAuthorizationMiddleware = require("../middleware/warehouseAuthorizationMiddleware");

const {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  updateWarehouseStatus,
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

router.put(
  "/:warehouseId",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  updateWarehouseValidation,
  validate,
  updateWarehouse,
);

router.patch(
  "/:warehouseId/status",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  updateWarehouseStatusValidation,
  validate,
  updateWarehouseStatus,
);

module.exports = router;
