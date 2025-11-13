/**
 * Response formatting utility functions for consistent API responses
 */

/**
 * Success response formatter
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response formatter
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {*} errors - Additional error details (optional)
 */
export const sendError = (res, message = "An error occurred", statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation error response formatter
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Array} validationErrors - Array of validation errors
 */
export const sendValidationError = (res, message = "Validation failed", validationErrors = []) => {
  return res.status(400).json({
    success: false,
    message,
    errors: validationErrors,
  });
};

/**
 * Not found response formatter
 * @param {Object} res - Express response object
 * @param {String} resource - Resource name (e.g., "Student", "Recognition")
 */
export const sendNotFound = (res, resource = "Resource") => {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`,
  });
};

/**
 * Unauthorized response formatter
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
export const sendUnauthorized = (res, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    message,
  });
};

/**
 * Forbidden response formatter
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
export const sendForbidden = (res, message = "Forbidden") => {
  return res.status(403).json({
    success: false,
    message,
  });
};

/**
 * Paginated response formatter
 * @param {Object} res - Express response object
 * @param {Array} items - Array of items
 * @param {Number} total - Total count
 * @param {Number} limit - Limit per page
 * @param {Number} offset - Offset
 * @param {String} message - Success message
 */
export const sendPaginated = (
  res,
  items,
  total,
  limit,
  offset,
  message = "Success"
) => {
  return res.status(200).json({
    success: true,
    message,
    data: {
      items,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + items.length < total,
        totalPages: Math.ceil(total / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    },
  });
};

