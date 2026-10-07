const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const { createCustomer } = require("../controllers/customerController");

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

module.exports = router;
