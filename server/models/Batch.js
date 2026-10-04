const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },
    manufacturingDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
