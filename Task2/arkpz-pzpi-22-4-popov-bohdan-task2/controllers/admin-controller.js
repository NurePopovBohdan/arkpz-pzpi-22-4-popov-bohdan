const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const User = require("../models/user-model.js");

class AdminController {
  async getUsers(req, res, next) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.json({ message: "User deleted successfully" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AdminController();
