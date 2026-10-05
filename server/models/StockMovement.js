const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
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
      enum: [
        "DISPATCHED",
        "RECEIVED",
        "TRANSFERRED",
        "RETURNED",
        "DAMAGED",
        "EXPIRED",
      ],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    referenceType: {
      type: String,
      required: true,
      trim: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);

module.exports = StockMovement;
