const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  stationId: { type: String, required: true },
  description: { type: String, required: true },
  receiptId: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);