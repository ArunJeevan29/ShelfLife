const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  createSupplierValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  createSupplier,
  getSuppliers,
  getSupplier,
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

module.exports = router;
