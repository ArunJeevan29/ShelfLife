const Batch = require("../models/Batch");
const Product = require("../models/Product");

const createBatch = async (req, res, next) => {
  try {
    const { product, batchNumber, manufacturingDate, expiryDate } = req.body;
    const normalizedBatchNumber = batchNumber.trim().toUpperCase();
    const existBatchNumber = await Batch.findOne({
      batchNumber: normalizedBatchNumber,
    });
    if (existBatchNumber) {
      return res.status(409).json({ message: "Batch Number already Exists" });
    }
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (productDoc.status !== "ACTIVE") {
      return res.status(400).json({ message: "Product is not active" });
    }

    const manufacturing = new Date(manufacturingDate);
    const expiry = new Date(expiryDate);

    if (expiry <= manufacturing) {
      return res.status(400).json({
        message: "Expiry Date must be later than Manufacturing Date",
      });
    }
    const newBatch = {
      product,
      batchNumber: normalizedBatchNumber,
      manufacturingDate: manufacturing,
      expiryDate: expiry,
    };
    const batch = await Batch.create(newBatch);
    return res.status(201).json({
      message: "Batch Created Successfully",
      batch: {
        id: batch._id,
        product: batch.product,
        batchNumber: batch.batchNumber,
        manufacturingDate: batch.manufacturingDate,
        expiryDate: batch.expiryDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find().populate(
      "product",
      "name sku category unit status",
    );
    return res.status(200).json({ batches });
  } catch (error) {
    next(error);
  }
};

const getBatch = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId).populate(
      "product",
      "name sku category unit status",
    );
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    return res.status(200).json({ batch });
  } catch (error) {
    next(error);
  }
};

const updateBatch = async (req, res, next) => {
  try {
    const { product, batchNumber, manufacturingDate, expiryDate } = req.body;
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    const normalizedBatchNumber = batchNumber.trim().toUpperCase();
    const batchNumberExists = await Batch.findOne({
      batchNumber: normalizedBatchNumber,
      _id: { $ne: batchId },
    });
    if (batchNumberExists) {
      return res.status(409).json({ message: "Batch Number already exists" });
    }
    const currentProduct = await Product.findById(product);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (currentProduct.status !== "ACTIVE") {
      return res.status(400).json({ message: "Product is not active" });
    }
    const manufacturing = new Date(manufacturingDate);
    const expiry = new Date(expiryDate);
    if (expiry <= manufacturing) {
      return res
        .status(400)
        .json({ message: "Expiry Date must be later than Manufacturing Date" });
    }
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      {
        product,
        batchNumber: normalizedBatchNumber,
        manufacturingDate: manufacturing,
        expiryDate: expiry,
      },
      { new: true },
    ).populate("product", "name sku category unit status");
    return res.status(200).json({
      message: "Batch Updated Successfully",
      batch: {
        id: updatedBatch._id,
        product: updatedBatch.product,
        batchNumber: updatedBatch.batchNumber,
        manufacturingDate: updatedBatch.manufacturingDate,
        expiryDate: updatedBatch.expiryDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBatch, getBatches, getBatch, updateBatch };
