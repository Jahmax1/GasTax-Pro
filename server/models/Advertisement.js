const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  stationId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Advertisement', advertisementSchema);