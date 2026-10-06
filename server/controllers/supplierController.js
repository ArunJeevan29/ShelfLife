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

module.exports = { createSupplier };
