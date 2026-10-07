const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  createCustomer,
  getCustomers,
} = require("../controllers/customerController");

const {
  createCustomerValidation,
  validate,
} = require("../middleware/validationMiddleware");

router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER"]),
  createCustomerValidation,
  validate,
  createCustomer,
);

router.get(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER", "STAFF"]),
  getCustomers,
);

module.exports = router;
