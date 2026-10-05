const User = require("../models/User");
const bcrypt = require("bcrypt");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, warehouse } =
      req.body;
    const allowedRoles = ["STAFF", "MANAGER"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm Password must be same " });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      warehouse,
    };
    const user = await User.create(newUser);
    return res.status(201).json({
      message: "User created Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        warehouse: user.warehouse,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser };
