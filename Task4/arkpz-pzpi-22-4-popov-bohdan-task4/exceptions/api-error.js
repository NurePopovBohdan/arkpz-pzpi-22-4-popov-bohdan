module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    // Call the parent class (Error) constructor with the message
    super(message);
    this.status = status;
    this.errors = errors;

    // Capturing the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // Static method for Unauthorized error
  static UnauthorizedError() {
    return new ApiError(401, "User is not authorized");
  }

  // Static method for BadRequest error
  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  // Optionally, you can add more custom error types here as your application grows

  // Example for handling not found errors
  static NotFoundError(message = "Resource not found") {
    return new ApiError(404, message);
  }

  // Example for handling forbidden errors
  static ForbiddenError(message = "You do not have permission to access this resource") {
    return new ApiError(403, message);
  }

  // You can also extend it further to handle more specific HTTP error codes
};
