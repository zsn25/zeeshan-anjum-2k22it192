/**
 * Utility functions index - Central export for all utilities
 */

// Monthly reset utilities
export {
  checkAndResetMonthlyCredits,
  resetStudentCreditsIfNeeded,
  batchResetAllStudents,
  getResetStatistics,
} from "./monthlyReset.js";

// Date helpers
export {
  getCurrentMonth,
  getCurrentYear,
  getCurrentMonthNumber,
  formatDate,
  formatDateReadable,
  isValidMonthFormat,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  isFirstDayOfMonth,
} from "./dateHelpers.js";

// Validators
export {
  validateStudentId,
  validateEmail,
  validateCredits,
  validateMessage,
  validateObjectId,
  validatePagination,
  validateDifferentStudents,
} from "./validators.js";

// Response helpers
export {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendPaginated,
} from "./responseHelpers.js";

// Credit helpers
export {
  CREDIT_TO_RUPEE_RATE,
  MONTHLY_CREDIT_ALLOCATION,
  MONTHLY_SENDING_LIMIT,
  MAX_CARRY_FORWARD_CREDITS,
  creditsToRupees,
  formatVoucherValue,
  calculateCarryForward,
  calculateNewMonthCredits,
  checkSufficientCredits,
  checkMonthlySendingLimit,
  getRemainingMonthlyCapacity,
  validateRedemptionEligibility,
} from "./creditHelpers.js";

// Error handlers
export {
  AppError,
  errorHandler,
  asyncHandler,
  createError,
  notFoundError,
  validationError,
  unauthorizedError,
  forbiddenError,
} from "./errorHandler.js";

