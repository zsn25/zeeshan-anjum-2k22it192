/**
 * Error handling utility functions
 */

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware for Express
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Log unexpected errors
  console.error("Unexpected Error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Send generic error response for unexpected errors
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "An unexpected error occurred" 
      : message,
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Creates a custom application error
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @returns {AppError} - Custom error instance
 */
export const createError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

/**
 * Handles not found errors
 * @param {String} resource - Resource name
 * @returns {AppError} - Not found error
 */
export const notFoundError = (resource = "Resource") => {
  return new AppError(`${resource} not found`, 404);
};

/**
 * Handles validation errors
 * @param {String} message - Validation error message
 * @returns {AppError} - Validation error
 */
export const validationError = (message = "Validation failed") => {
  return new AppError(message, 400);
};

/**
 * Handles unauthorized errors
 * @param {String} message - Unauthorized error message
 * @returns {AppError} - Unauthorized error
 */
export const unauthorizedError = (message = "Unauthorized") => {
  return new AppError(message, 401);
};

/**
 * Handles forbidden errors
 * @param {String} message - Forbidden error message
 * @returns {AppError} - Forbidden error
 */
export const forbiddenError = (message = "Forbidden") => {
  return new AppError(message, 403);
};

