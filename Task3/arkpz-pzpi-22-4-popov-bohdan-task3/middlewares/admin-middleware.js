const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    // Retrieve the access token from the cookies
    const accessToken = req.cookies.accessToken;

    // If the token doesn't exist, return an Unauthorized error
    if (!accessToken) {
      console.log("Access token not found");
      return next(ApiError.UnauthorizedError());
    }

    // Validate the token
    const userData = tokenService.validateAccessToken(accessToken);

    // If the token is invalid, log it and return an Unauthorized error
    if (!userData) {
      console.log("Invalid token:", accessToken.split(" ")[1]);
      return next(ApiError.UnauthorizedError());
    }

    // Attach the user data to the request object
    req.user = userData;

    // Log user role for debugging purposes
    const userRole = req.user.role;
    console.log("User role is:", userRole);

    // If the user is not an admin, return a Permissions error
    if (userRole !== "admin") {
      return next(ApiError.PermissionsError());
    }

    // Proceed to the next middleware
    next();
  } catch (e) {
    // If any error occurs, return an Unauthorized error
    return next(ApiError.UnauthorizedError());
  }
};
