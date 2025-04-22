const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'gasStation', 'revenueAuthority'], required: true },
  stationId: { type: String, required: function () { return this.role === 'gasStation'; } }, // Only for gas stations
});

module.exports = mongoose.model('User', userSchema);