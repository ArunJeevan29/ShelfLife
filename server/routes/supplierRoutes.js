const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  createSupplierValidation,
  updateSupplierValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
} = require("../controllers/supplierController");

router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  createSupplierValidation,
  validate,
  createSupplier,
);

router.get(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  getSuppliers,
);

router.get(
  "/:supplierId",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  getSupplier,
);

router.put(
  "/:supplierId",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  updateSupplierValidation,
  validate,
  updateSupplier,
);

module.exports = router;
