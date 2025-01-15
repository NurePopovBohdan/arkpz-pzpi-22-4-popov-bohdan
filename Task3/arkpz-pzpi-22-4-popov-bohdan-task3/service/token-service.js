const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

class TokenService {
  // Generates access and refresh tokens
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15s", // Access token expires in 15 seconds
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30s", // Refresh token expires in 30 seconds
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  // Validates the access token
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData; // Return user data if token is valid
    } catch (e) {
      return null; // Return null if the token is invalid
    }
  }

  // Validates the refresh token
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData; // Return user data if token is valid
    } catch (e) {
      return null; // Return null if the token is invalid
    }
  }

  // Saves the refresh token to the database
  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken; // Update the existing refresh token
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken }); // Create a new token record
    return token;
  }

  // Removes the refresh token from the database
  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken }); // Delete token record
    return tokenData;
  }

  // Finds the token record by refresh token
  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData; // Return the token record if found
  }
}

module.exports = new TokenService();
