const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
} = require("../controllers/productController");

const {
  createProductValidation,
  updateProductValidation,
  validate,
} = require("../middleware/validationMiddleware");

router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  createProductValidation,
  validate,
  createProduct,
);

router.get(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER", "STAFF"]),
  getProducts,
);

router.get(
  "/:productId",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER", "STAFF"]),
  getProduct,
);

router.put(
  "/:productId",
  authMiddleware,
  authorizationMiddleware(["ADMIN"]),
  updateProductValidation,
  validate,
  updateProduct,
);

module.exports = router;
