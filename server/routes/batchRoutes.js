const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
} = require("../controllers/batchController");

const {
  createBatchValidation,
  updateBatchValidation,
  validate,
} = require("../middleware/validationMiddleware");

router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER"]),
  createBatchValidation,
  validate,
  createBatch,
);

router.get(
  "/",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER", "STAFF"]),
  getBatches,
);

router.get(
  "/:batchId",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER", "STAFF"]),
  getBatch,
);

router.put(
  "/:batchId",
  authMiddleware,
  authorizationMiddleware(["ADMIN", "MANAGER"]),
  updateBatchValidation,
  validate,
  updateBatch,
);

module.exports = router;
