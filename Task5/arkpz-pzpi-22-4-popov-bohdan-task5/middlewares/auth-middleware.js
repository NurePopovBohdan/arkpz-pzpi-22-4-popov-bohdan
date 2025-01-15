const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    // Retrieve the access token from cookies
    const accessToken = req.cookies.accessToken;

    // If no token is found, return UnauthorizedError
    if (!accessToken) {
      console.log("Access token not found");
      return next(ApiError.UnauthorizedError());
    }

    // Validate the token and retrieve user data
    const userData = tokenService.validateAccessToken(accessToken);

    // If token validation fails, return UnauthorizedError
    if (!userData) {
      console.log("Invalid access token");
      return next(ApiError.UnauthorizedError());
    }

    // Attach user data to the request object for further use
    req.user = userData;

    // Proceed to the next middleware
    next();
  } catch (e) {
    // If an error occurs during validation, return UnauthorizedError
    console.error("Error during token validation:", e);
    return next(ApiError.UnauthorizedError());
  }
};
