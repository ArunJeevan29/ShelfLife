const { body, validationResult } = require("express-validator");

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password and Password must be same");
      }
      return true;
    }),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["MANAGER", "STAFF"])
    .withMessage("Invalid role"),
  body("warehouse")
    .trim()
    .notEmpty()
    .withMessage("Warehouse is required")
    .isMongoId()
    .withMessage("Invalid Warehouse"),
];

const createWarehouseValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("code").trim().notEmpty().withMessage("Code is required"),
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["MAIN", "BRANCH"])
    .withMessage("Invalid Type"),
  body("address").trim().notEmpty().withMessage("Address is required"),
];

const updateWarehouseValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("code").trim().notEmpty().withMessage("Code is required"),
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["MAIN", "BRANCH"])
    .withMessage("Invalid Type"),
  body("address").trim().notEmpty().withMessage("Address is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};

module.exports = {
  loginValidation,
  registerValidation,
  createWarehouseValidation,
  updateWarehouseValidation,
  validate,
};
