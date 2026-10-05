const mongoose = require("mongoose");

const transferItemSchema = new mongoose.Schema(
  {
    transfer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transfer",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    receivedQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const TransferItem = mongoose.model("TransferItem", transferItemSchema);

module.exports = TransferItem;
