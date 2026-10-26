const mongoose = require("mongoose");
const Batch = require("../models/Batch");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const Inventory = require("../models/Inventory");
const StockMovement = require("../models/StockMovement");
const StockReceipt = require("../models/StockReceipt");

const generateReceiptNumber = require("../utils/generateReceiptNumber");

const receiveStock = async (req, res, next) => {
  let session;

  try {
    const { batch, supplier, warehouse, quantity } = req.body;
    const currentBatch = await Batch.findById(batch);
    if (!currentBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const currentProduct = await Product.findById(currentBatch.product);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (currentProduct.status !== "ACTIVE") {
      return res.status(400).json({ message: "Product is not active" });
    }

    const currentSupplier = await Supplier.findById(supplier);
    if (!currentSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    if (currentSupplier.status !== "ACTIVE") {
      return res.status(400).json({ message: "Supplier is not acitve" });
    }

    if (currentProduct.supplier.toString() !== currentSupplier._id.toString()) {
      return res.status(400).json({
        message: "The selected batch does not belong to this supplier ",
      });
    }

    const currentWarehouse = await Warehouse.findById(warehouse);
    if (!currentWarehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    if (currentWarehouse.status !== "ACTIVE") {
      return res.status(400).json({ message: "Warehouse is not active" });
    }
    if (currentWarehouse.type !== "MAIN") {
      return res
        .status(400)
        .json({ message: "Received by only Main Warehouse" });
    }
    if (
      req.user.role === "MANAGER" &&
      req.user.warehouseId?.toString() !== currentWarehouse._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized for this warehouse" });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const inventory = await Inventory.findOneAndUpdate(
      {
        batch: currentBatch._id,
        warehouse: currentWarehouse._id,
      },
      {
        $inc: { quantity },
        $setOnInsert: { reservedQuantity: 0 },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        session,
      },
    );

    const receiptNumber = await generateReceiptNumber(session);

    const [stockReceipt] = await StockReceipt.create(
      [
        {
          receiptNumber,
          supplier: currentSupplier._id,
          warehouse: currentWarehouse._id,
          batch: currentBatch._id,
          quantity,
          receivedBy: req.user.id,
        },
      ],
      { session },
    );

    await StockMovement.create(
      [
        {
          batch: currentBatch._id,
          product: currentBatch.product,
          warehouse: currentWarehouse._id,
          type: "RECEIVED",
          quantity,
          referenceType: "SUPPLIER_RECEIPT",
          referenceId: stockReceipt._id,
          performedBy: req.user.id,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return res.status(201).json({
      message: "Stock received successfully",
      receiptNumber: stockReceipt.receiptNumber,
      inventory: {
        id: inventory._id,
        batch: inventory.batch,
        warehouse: inventory.warehouse,
        quantity: inventory.quantity,
        reservedQuantity: inventory.reservedQuantity,
        availableQuantity: inventory.quantity - inventory.reservedQuantity,
      },
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    return next(error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

module.exports = { receiveStock };
