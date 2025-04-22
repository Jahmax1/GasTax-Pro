const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  stationId: { type: String, required: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng'], required: true },
  volume: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  receiptId: { type: String, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);