/**
 * Validation utility functions
 */

/**
 * Validates student ID format
 * @param {String} studentId - Student ID to validate
 * @returns {Object} - { isValid: Boolean, message: String }
 */
export const validateStudentId = (studentId) => {
  if (!studentId) {
    return { isValid: false, message: "Student ID is required" };
  }

  if (typeof studentId !== "string") {
    return { isValid: false, message: "Student ID must be a string" };
  }

  if (studentId.trim().length === 0) {
    return { isValid: false, message: "Student ID cannot be empty" };
  }

  // Add custom validation rules if needed (e.g., specific format)
  // Example: if (!/^STU\d+$/.test(studentId)) {
  //   return { isValid: false, message: "Student ID must be in format STU001" };
  // }

  return { isValid: true, message: "Valid student ID" };
};

/**
 * Validates email format
 * @param {String} email - Email to validate
 * @returns {Object} - { isValid: Boolean, message: String }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  return { isValid: true, message: "Valid email" };
};

/**
 * Validates credit amount
 * @param {Number} credits - Credit amount to validate
 * @param {Number} min - Minimum value (default: 1)
 * @param {Number} max - Maximum value (optional)
 * @returns {Object} - { isValid: Boolean, message: String }
 */
export const validateCredits = (credits, min = 1, max = null) => {
  if (credits === undefined || credits === null) {
    return { isValid: false, message: "Credits are required" };
  }

  if (typeof credits !== "number" || isNaN(credits)) {
    return { isValid: false, message: "Credits must be a number" };
  }

  if (credits < min) {
    return { isValid: false, message: `Credits must be at least ${min}` };
  }

  if (max !== null && credits > max) {
    return { isValid: false, message: `Credits cannot exceed ${max}` };
  }

  if (!Number.isInteger(credits)) {
    return { isValid: false, message: "Credits must be an integer" };
  }

  return { isValid: true, message: "Valid credits" };
};

/**
 * Validates recognition message length
 * @param {String} message - Message to validate
 * @param {Number} maxLength - Maximum length (default: 500)
 * @returns {Object} - { isValid: Boolean, message: String }
 */
export const validateMessage = (message, maxLength = 500) => {
  if (message === undefined || message === null) {
    return { isValid: true, message: "Message is optional" };
  }

  if (typeof message !== "string") {
    return { isValid: false, message: "Message must be a string" };
  }

  if (message.length > maxLength) {
    return {
      isValid: false,
      message: `Message cannot exceed ${maxLength} characters`,
    };
  }

  return { isValid: true, message: "Valid message" };
};

/**
 * Validates MongoDB ObjectId format
 * @param {String} id - ID to validate
 * @returns {Object} - { isValid: Boolean, message: String }
 */
export const validateObjectId = (id) => {
  if (!id) {
    return { isValid: false, message: "ID is required" };
  }

  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    return { isValid: false, message: "Invalid ID format" };
  }

  return { isValid: true, message: "Valid ID" };
};

/**
 * Validates pagination parameters
 * @param {Number} limit - Limit value
 * @param {Number} offset - Offset value
 * @param {Number} maxLimit - Maximum allowed limit (default: 100)
 * @returns {Object} - { isValid: Boolean, message: String, limit: Number, offset: Number }
 */
export const validatePagination = (limit, offset, maxLimit = 100) => {
  const parsedLimit = parseInt(limit) || 50;
  const parsedOffset = parseInt(offset) || 0;

  if (parsedLimit < 1) {
    return {
      isValid: false,
      message: "Limit must be greater than 0",
      limit: parsedLimit,
      offset: parsedOffset,
    };
  }

  if (parsedLimit > maxLimit) {
    return {
      isValid: false,
      message: `Limit cannot exceed ${maxLimit}`,
      limit: parsedLimit,
      offset: parsedOffset,
    };
  }

  if (parsedOffset < 0) {
    return {
      isValid: false,
      message: "Offset must be 0 or greater",
      limit: parsedLimit,
      offset: parsedOffset,
    };
  }

  return {
    isValid: true,
    message: "Valid pagination",
    limit: parsedLimit,
    offset: parsedOffset,
  };
};

/**
 * Validates that sender and receiver are different
 * @param {String} senderId - Sender ID
 * @param {String} receiverId - Receiver ID
 * @returns {Object} - { isValid: Boolean, message: String }
 */
export const validateDifferentStudents = (senderId, receiverId) => {
  if (senderId === receiverId) {
    return {
      isValid: false,
      message: "Sender and receiver cannot be the same",
    };
  }

  return { isValid: true, message: "Valid different students" };
};

