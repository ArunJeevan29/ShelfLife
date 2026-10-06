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

module.exports = router;
