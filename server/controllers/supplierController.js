const Supplier = require("../models/Supplier");

const createSupplier = async (req, res, next) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = await Supplier.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(409).json({ message: "Supplier email already exists" });
    }
    const supplier = await Supplier.create({
      name,
      contactPerson,
      email: normalizedEmail,
      phone,
      address,
    });
    return res.status(201).json({
      message: "Supplier created successfully",
      supplier: {
        id: supplier._id,
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        status: supplier.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json({ suppliers });
  } catch (error) {
    next(error);
  }
};

const getSupplier = async (req, res, next) => {
  try {
    const { supplierId } = req.params;
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    return res.status(200).json({ supplier });
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { supplierId } = req.params;
    const { name, contactPerson, email, phone, address } = req.body;
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = await Supplier.findOne({
      email: normalizedEmail,
      _id: { $ne: supplierId },
    });
    if (emailExists) {
      return res.status(409).json({ message: "Supplier email already Exists" });
    }
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      {
        name,
        contactPerson,
        email: normalizedEmail,
        phone,
        address,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "Supplier updated Successfully",
      supplier: {
        id: updatedSupplier._id,
        name: updatedSupplier.name,
        contactPerson: updatedSupplier.contactPerson,
        email: updatedSupplier.email,
        phone: updatedSupplier.phone,
        address: updatedSupplier.address,
        status: updatedSupplier.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSupplier, getSuppliers, getSupplier, updateSupplier };
