const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  model: { type: String, required: true },
  licensePlate: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
