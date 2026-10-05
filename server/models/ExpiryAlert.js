const mongoose = require("mongoose");

const expiryAlertSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },

    type: {
      type: String,
      enum: ["WARNING", "CRITICAL", "EXPIRED"],
      required: true,
    },

    daysRemaining: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["UNREAD", "READ", "RESOLVED"],
      default: "UNREAD",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const ExpiryAlert = mongoose.model("ExpiryAlert", expiryAlertSchema);

module.exports = ExpiryAlert;
