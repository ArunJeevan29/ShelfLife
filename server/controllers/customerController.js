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

const updateCustomer = async (req, res, next) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = await Customer.findOne({
      email: normalizedEmail,
      _id: { $ne: customerId },
    });
    if (emailExists) {
      return res.status(409).json({ message: "Customer email already exists" });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
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
      message: "Customer updated successfully",
      customer: {
        id: updatedCustomer._id,
        name: updatedCustomer.name,
        contactPerson: updatedCustomer.contactPerson,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        address: updatedCustomer.address,
        status: updatedCustomer.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.status = status;
    await customer.save();
    return res.status(200).json({
      message: "Customer status updated successfully",
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

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  updateCustomerStatus,
};
