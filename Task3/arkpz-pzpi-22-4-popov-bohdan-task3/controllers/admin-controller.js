const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const User = require("../models/user-model.js");

class AdminController {
  // Retrieve a list of all users
  async getUsers(req, res, next) {
    try {
      const users = await User.find(); // Find all users in the database
      res.json(users); // Send users as JSON response
    } catch (e) {
      next(e); // Pass any error to the error-handling middleware
    }
  }

  // Delete a user by ID
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Validate ID format (ensure it's a valid MongoDB ObjectId)
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return next(ApiError.BadRequest("Invalid user ID format"));
      }

      const user = await User.findById(id); // Check if the user exists
      if (!user) {
        return next(ApiError.BadRequest("User not found"));
      }

      await User.findByIdAndDelete(id); // Delete the user by ID
      res.json({ message: "User deleted successfully", user }); // Return a success message with the deleted user's details
    } catch (e) {
      next(e); // Pass any error to the error-handling middleware
    }
  }
}

module.exports = new AdminController();
