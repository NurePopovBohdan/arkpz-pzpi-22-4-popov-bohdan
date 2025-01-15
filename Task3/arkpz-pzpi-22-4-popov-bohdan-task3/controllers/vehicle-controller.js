const Vehicle = require("../models/vehicle-model.js");

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find(); // Retrieve all vehicles from the database
    return res.status(200).json({
      message: "Vehicles retrieved successfully",
      vehicles,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving vehicles", error: error.message });
  }
};

exports.addVehicle = async (req, res) => {
  try {
    const { model, licensePlate, year, status } = req.body;

    // Basic validation to ensure required fields are present
    if (!model || !licensePlate || !year || !status) {
      return res.status(400).json({ message: "All fields are required: model, licensePlate, year, status" });
    }

    // Create a new vehicle document
    const vehicle = new Vehicle(req.body);

    await vehicle.save(); // Save the vehicle to the database
    return res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    return res.status(400).json({ message: "Error adding vehicle", error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVehicle = req.body;

    // Validate if any required fields are missing
    if (!updatedVehicle.model || !updatedVehicle.licensePlate || !updatedVehicle.year || !updatedVehicle.status) {
      return res.status(400).json({ message: "All fields are required: model, licensePlate, year, status" });
    }

    // Attempt to find and update the vehicle by its ID
    const vehicle = await Vehicle.findByIdAndUpdate(id, updatedVehicle, { new: true });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    return res.status(400).json({ message: "Error updating vehicle", error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to find and delete the vehicle by its ID
    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json({
      message: "Vehicle deleted successfully",
      vehicle,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting vehicle", error: error.message });
  }
};
