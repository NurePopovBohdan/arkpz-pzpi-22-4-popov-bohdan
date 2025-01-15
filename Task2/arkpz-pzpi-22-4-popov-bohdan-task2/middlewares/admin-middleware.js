const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    const accessToken = req.cookies.accessToken; // Retrieving the token from cookies
    console.log("qw");

    if (!accessToken) {
      console.log(1);
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken); // Validate the token

    if (!userData) {
      console.log(accessToken.split(" ")[1]);
      console.log(2);

      return next(ApiError.UnauthorizedError());
    }
    console.log(userData);
    req.user = userData;
    //
    userRole = req.user.role;

    console.log("req.user is equal to - ", userRole);

    if (userRole !== "admin") {
      return next(ApiError.PermissionsError());
    }

    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
