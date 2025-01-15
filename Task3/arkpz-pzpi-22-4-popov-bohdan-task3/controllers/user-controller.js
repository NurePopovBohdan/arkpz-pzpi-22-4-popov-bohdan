const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
  // Registration handler
  async registration(req, res, next) {
    try {
      const errors = validationResult(req); // Validation results
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Error during validation", errors.array()));
      }
      const { email, password, role } = req.body;
      const userData = await userService.registration(email, password, role);

      // Set refresh token as HTTP-only cookie
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // Secure, client can't access it
      });

      // Send the response with user data and tokens
      return res.json({
        message: "User registered successfully",
        user: userData.user,
      });
    } catch (e) {
      next(e);
    }
  }

  // Login handler
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);

      // Set access and refresh tokens as cookies
      res.cookie("accessToken", userData.accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // Secure, client can't access it
      });

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // Secure, client can't access it
      });

      // Send user data (without sensitive information) as response
      return res.json({
        message: "Login successful",
        user: userData.user,
      });
    } catch (e) {
      next(e);
    }
  }

  // Logout handler
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      // Use the refresh token to log out the user
      const token = await userService.logout(refreshToken);

      // Clear the cookies
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");

      return res.json({
        message: "Logged out successfully",
        token,
      });
    } catch (e) {
      next(e);
    }
  }

  // Activation handler
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL); // Redirect to the client URL after activation
    } catch (e) {
      next(e);
    }
  }

  // Get all users handler (admin only)
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
