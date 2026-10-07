const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  updateCustomerStatus,
} = require("../controllers/customerController");

const {
  createCustomerValidation,
  updateCustomerValidation,
  updateCustomerStatusValidation,
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

router.get(
  "/:customerId",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER", "STAFF"]),
  getCustomer,
);

router.put(
  "/:customerId",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER"]),
  updateCustomerValidation,
  validate,
  updateCustomer,
);

router.patch(
  "/:customerId/status",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER"]),
  updateCustomerStatusValidation,
  validate,
  updateCustomerStatus,
);

module.exports = router;
