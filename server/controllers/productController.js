const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, category, unit, supplier } = req.body;
    const normalizedSku = sku.trim().toUpperCase();
    const skuExists = await Product.findOne({ sku: normalizedSku });
    if (skuExists) {
      return res.status(409).json({ message: "SKU already exists" });
    }
    const currentSupplier = await Supplier.findById(supplier);
    if (!currentSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    if (currentSupplier.status !== "ACTIVE") {
      return res.status(400).json({ message: "Supplier is not active" });
    }
    const newProduct = {
      name,
      sku: normalizedSku,
      description,
      category,
      unit,
      supplier,
    };
    const product = await Product.create(newProduct);
    return res.status(201).json({
      message: "Product created successfully",
      product: {
        id: product._id,
        name: product.name,
        sku: product.sku,
        description: product.description,
        category: product.category,
        unit: product.unit,
        supplier: product.supplier,
        status: product.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("supplier", "name email");
    return res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate(
      "supplier",
      "name email",
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, sku, description, category, unit, supplier } = req.body;
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const normalizedSku = sku.trim().toUpperCase();
    const skuExists = await Product.findOne({
      sku: normalizedSku,
      _id: { $ne: productId },
    });
    if (skuExists) {
      return res.status(409).json({ message: "SKU already exists" });
    }
    const currentSupplier = await Supplier.findById(supplier);
    if (!currentSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    if (currentSupplier.status !== "ACTIVE") {
      return res.status(400).json({ message: "Supplier not active" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        sku: normalizedSku,
        description,
        category,
        unit,
        supplier,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "Product updated successfully",
      product: {
        id: updatedProduct._id,
        name: updatedProduct.name,
        sku: updatedProduct.sku,
        description: updatedProduct.description,
        category: updatedProduct.category,
        unit: updatedProduct.unit,
        supplier: updatedProduct.supplier,
        status: updatedProduct.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProductStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { status },
      { new: true },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      message: "Product status updated successfully",
      product: {
        id: product._id,
        name: product.name,
        sku: product.sku,
        description: product.description,
        category: product.category,
        unit: product.unit,
        supplier: product.supplier,
        status: product.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateProductStatus,
};
