const Warehouse = require("../models/Warehouse");

const createWarehouse = async (req, res, next) => {
  try {
    const { name, code, type, address } = req.body;
    const normalizedCode = code.trim().toLowerCase();
    const codeExists = await Warehouse.findOne({ code: normalizedCode });
    if (codeExists) {
      return res.status(409).json({ message: "Warehouse code already exists" });
    }
    const warehouse = await Warehouse.create({
      name,
      code: normalizedCode,
      type,
      address,
    });
    return res.status(201).json({
      message: "Warehouse Created Successfully",
      warehouse: {
        id: warehouse._id,
        name: warehouse.name,
        code: warehouse.code,
        type: warehouse.type,
        address: warehouse.address,
        status: warehouse.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getWarehouses = async (req, res, next) => {
  try {
    const { role, warehouseId } = req.user;
    let query = {};
    if (role !== "ADMIN") {
      query._id = warehouseId;
    }
    const warehouses = await Warehouse.find(query);
    return res.status(200).json(warehouses);
  } catch (error) {
    next(error);
  }
};

const getWarehouse = async (req, res, next) => {
  try {
    const { warehouseId } = req.params;
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    return res.status(200).json(warehouse);
  } catch (error) {
    next(error);
  }
};

const updateWarehouse = async (req, res, next) => {
  try {
    const { name, code, type, address } = req.body;
    const { warehouseId } = req.params;
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({
        message: "Warehouse not found",
      });
    }
    const normalizedCode = code.trim().toLowerCase();
    const codeExists = await Warehouse.findOne({
      code: normalizedCode,
      _id: { $ne: warehouseId },
    });
    if (codeExists) {
      return res.status(409).json({ message: "Warehouse code already exists" });
    }
    const updateWarehouse = await Warehouse.findByIdAndUpdate(
      warehouseId,
      { name, code: normalizedCode, type, address },
      { new: true },
    );
    return res.status(200).json({
      message: "Warehouse updated successfully",
      warehouse: {
        id: updateWarehouse._id,
        name: updateWarehouse.name,
        code: updateWarehouse.code,
        type: updateWarehouse.type,
        address: updateWarehouse.address,
        status: updateWarehouse.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateWarehouseStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { warehouseId } = req.params;
    const warehouse = await Warehouse.findByIdAndUpdate(
      warehouseId,
      { status },
      { new: true },
    );
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    return res.status(200).json({
      message: "Status changed successfully",
      warehouse: {
        id: warehouse._id,
        name: warehouse.name,
        code: warehouse.code,
        type: warehouse.type,
        address: warehouse.address,
        status: warehouse.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  updateWarehouseStatus,
};
