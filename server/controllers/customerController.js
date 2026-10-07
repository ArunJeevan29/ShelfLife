const Customer = require("../models/Customer");

const createCustomer = async (req, res, next) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = await Customer.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(409).json({ message: "Customer email already exists" });
    }
    const customer = await Customer.create({
      name,
      contactPerson,
      email: normalizedEmail,
      phone,
      address,
    });
    return res.status(201).json({
      message: "Customer created successfully",
      customer: {
        id: customer._id,
        name: customer.name,
        contactPerson: customer.contactPerson,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCustomer };
