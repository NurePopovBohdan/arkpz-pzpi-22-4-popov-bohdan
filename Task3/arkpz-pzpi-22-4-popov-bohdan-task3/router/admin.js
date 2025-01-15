const Router = require("express").Router;
const adminMiddleware = require("../middlewares/admin-middleware.js");
const adminController = require("../controllers/admin-controller.js");
const vehicleController = require("../controllers/vehicle-controller");

const router = new Router();

// Get the list of all users
router.get("/users", adminController.getUsers);

// Delete a user by their ID
router.delete("/users/:id", adminController.deleteUser);

// Get the list of all vehicles (protected route for admins)
router.get("/vehicles", adminMiddleware, vehicleController.getAllVehicles);

// Add a new vehicle
router.post("/vehicles", vehicleController.addVehicle);

// Update information about a specific vehicle
router.put("/vehicles/:id", vehicleController.updateVehicle);

// Delete a vehicle by its ID
router.delete("/vehicles/:id", vehicleController.deleteVehicle);

module.exports = router;
