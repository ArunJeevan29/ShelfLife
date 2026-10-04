const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reservedQuantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

inventorySchema.index(
  {
    batch: 1,
    warehouse: 1,
  },
  { unique: true },
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
