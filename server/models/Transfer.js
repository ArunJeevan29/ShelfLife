const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    transferNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "IN_TRANSIT",
        "RECEIVED",
        "REJECTED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
    },
    receivedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Transfer = mongoose.model("Transfer", transferSchema);

module.exports = Transfer;
