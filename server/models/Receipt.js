const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  receiptId: { type: String, required: true, unique: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
  consumerId: { type: String, required: true },
  taxDetails: {
    vat: { type: Number, required: true },
    excise: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Receipt", receiptSchema);
