const mongoose = require("mongoose");

const replenishmentRequestItemSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReplenishmentRequest",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    fulfilledQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const ReplenishmentRequestItem = mongoose.model(
  "ReplenishmentRequestItem",
  replenishmentRequestItemSchema,
);

module.exports = ReplenishmentRequestItem;
