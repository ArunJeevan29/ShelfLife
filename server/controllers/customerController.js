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

const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    return res.status(200).json({ customers });
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json({ customer });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCustomer, getCustomers, getCustomer };
