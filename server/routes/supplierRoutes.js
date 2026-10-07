const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  createSupplierValidation,
  updateSupplierValidation,
  updateSupplierStatusValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  updateSupplierStatus,
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

router.patch(
  "/:supplierId",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  updateSupplierStatusValidation,
  validate,
  updateSupplierStatus,
);

module.exports = router;
