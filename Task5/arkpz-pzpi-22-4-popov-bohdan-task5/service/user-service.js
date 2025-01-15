const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  // Register a new user
  async registration(email, password, role) {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw ApiError.BadRequest(`User with email address ${email} already exists`);
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4(); // Generate activation link

    // Create new user in the database
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      role,
    });

    // Prepare user data transfer object
    const userDto = new UserDto(newUser); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto }; // Return tokens and user data
  }

  // Activate user by activation link
  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link");
    }

    // Set user as activated
    user.isActivated = true;
    await user.save();
  }

  // User login
  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("User with this email was not found");
    }

    // Compare entered password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.BadRequest("Invalid password");
    }

    const userDto = new UserDto(user); // Create user DTO
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  // User logout
  async logout(refreshToken) {
    const removedToken = await tokenService.removeToken(refreshToken);
    return removedToken;
  }

  // Refresh tokens
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const newTokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, newTokens.refreshToken);
    return { ...newTokens, user: userDto };
  }
}

module.exports = new UserService();
