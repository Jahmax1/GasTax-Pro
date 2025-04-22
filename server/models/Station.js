const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  stationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  complianceScore: { type: Number, required: true },
});

module.exports = mongoose.model("Station", stationSchema);
