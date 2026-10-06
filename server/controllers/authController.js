const User = require("../models/User");
const RefreshSession = require("../models/RefreshSession");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const tokenId = crypto.randomBytes(32).toString("hex");
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await RefreshSession.create({
      user: user._id,
      tokenId,
      expiresAt: expiryDate,
    });

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        tokenId,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: expiryDate,
    });

    return res.status(200).json({
      message: "Login Succesfull",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        warehouse: user.warehouse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { id, tokenId } = decoded;
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({
        message: "Invalid Refresh Token",
      });
    }
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }
    const session = await RefreshSession.findOne({
      user: id,
      tokenId,
      expiresAt: { $gt: new Date() },
      revoked: false,
    });
    if (!session) {
      return res.status(401).json({ message: "Invalid Refresh Token" });
    }
    session.revoked = true;
    await session.save();

    const newTokenId = crypto.randomBytes(32).toString("hex");
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 7);
    await RefreshSession.create({
      user: id,
      tokenId: newTokenId,
      expiresAt: newExpiryDate,
    });

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        id,
        tokenId: newTokenId,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: newExpiryDate,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
        );
        const { id, tokenId } = decoded;
        await RefreshSession.findOneAndUpdate(
          {
            user: id,
            tokenId,
            revoked: false,
          },
          { revoked: true },
        );
      } catch (error) {
        // Ignore invalid/expired refresh token during logout
      }
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };
