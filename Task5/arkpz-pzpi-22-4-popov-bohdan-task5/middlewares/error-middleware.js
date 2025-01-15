const ApiError = require("../exceptions/api-error");

module.exports = function (err, req, res, next) {
  // Log the error for debugging purposes (you can customize this log based on the environment)
  console.error("Error occurred:", err);

  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    // Return the ApiError response with the status, message, and errors (if any)
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors || [], // Return empty array if no errors
    });
  }

  // For any unexpected errors, log the full error details for better visibility in the logs
  console.error("Unexpected error:", err);

  // Return a generic error message for unexpected errors
  return res.status(500).json({
    message: "Unexpected error occurred. Please try again later.",
    // Optionally, you can add more details like error code, or stack trace for development
    // In production, be careful not to expose sensitive info like stack trace
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
