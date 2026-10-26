const Counter = require("../models/Counter");

const generateReceiptNumber = async (session) => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { _id: `stockReceipt-${year}` },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      session,
    },
  );

  const sequence = String(counter.sequence).padStart(4, "0");
  return `SR-${year}-${sequence}`;
};

module.exports = generateReceiptNumber;
