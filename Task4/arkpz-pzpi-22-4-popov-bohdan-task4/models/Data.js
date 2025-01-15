const { Schema, model } = require("mongoose");

const DataSchema = new Schema({
  temperature: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  tirePressure: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = model("Data", DataSchema);
