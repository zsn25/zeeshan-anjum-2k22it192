/**
 * Credit calculation and management utility functions
 */

// Fixed conversion rate: ₹5 per credit
export const CREDIT_TO_RUPEE_RATE = 5;

// Monthly credit allocation
export const MONTHLY_CREDIT_ALLOCATION = 100;

// Monthly sending limit
export const MONTHLY_SENDING_LIMIT = 100;

// Maximum carry-forward credits
export const MAX_CARRY_FORWARD_CREDITS = 50;

/**
 * Converts credits to voucher value in rupees
 * @param {Number} credits - Number of credits
 * @returns {Number} - Voucher value in rupees
 */
export const creditsToRupees = (credits) => {
  return credits * CREDIT_TO_RUPEE_RATE;
};

/**
 * Formats voucher value as currency string
 * @param {Number} credits - Number of credits
 * @returns {String} - Formatted currency string (e.g., "₹500")
 */
export const formatVoucherValue = (credits) => {
  const rupees = creditsToRupees(credits);
  return `₹${rupees}`;
};

/**
 * Calculates carry-forward credits (max 50)
 * @param {Number} unusedCredits - Unused credits from previous month
 * @returns {Number} - Carry-forward credits (capped at 50)
 */
export const calculateCarryForward = (unusedCredits) => {
  return Math.min(MAX_CARRY_FORWARD_CREDITS, unusedCredits || 0);
};

/**
 * Calculates new month credits (100 + carry-forward)
 * @param {Number} unusedCredits - Unused credits from previous month
 * @returns {Number} - New month credits
 */
export const calculateNewMonthCredits = (unusedCredits) => {
  const carryForward = calculateCarryForward(unusedCredits);
  return MONTHLY_CREDIT_ALLOCATION + carryForward;
};

/**
 * Checks if student has sufficient credits
 * @param {Number} availableCredits - Available credits
 * @param {Number} requestedCredits - Requested credits
 * @returns {Object} - { hasSufficient: Boolean, message: String }
 */
export const checkSufficientCredits = (availableCredits, requestedCredits) => {
  if (availableCredits < requestedCredits) {
    return {
      hasSufficient: false,
      message: `Insufficient credits. Available: ${availableCredits}, Requested: ${requestedCredits}`,
    };
  }

  return {
    hasSufficient: true,
    message: "Sufficient credits available",
  };
};

/**
 * Checks if student can send credits within monthly limit
 * @param {Number} creditsSentThisMonth - Credits already sent this month
 * @param {Number} requestedCredits - Credits to send
 * @param {Number} monthlyLimit - Monthly sending limit (default: 100)
 * @returns {Object} - { canSend: Boolean, message: String }
 */
export const checkMonthlySendingLimit = (
  creditsSentThisMonth,
  requestedCredits,
  monthlyLimit = MONTHLY_SENDING_LIMIT
) => {
  const totalAfterRequest = creditsSentThisMonth + requestedCredits;

  if (totalAfterRequest > monthlyLimit) {
    return {
      canSend: false,
      message: `Monthly sending limit exceeded. Limit: ${monthlyLimit}, Already sent: ${creditsSentThisMonth}, Requested: ${requestedCredits}`,
    };
  }

  return {
    canSend: true,
    message: "Within monthly sending limit",
  };
};

/**
 * Calculates remaining monthly sending capacity
 * @param {Number} creditsSentThisMonth - Credits already sent this month
 * @param {Number} monthlyLimit - Monthly sending limit (default: 100)
 * @returns {Number} - Remaining credits that can be sent
 */
export const getRemainingMonthlyCapacity = (
  creditsSentThisMonth,
  monthlyLimit = MONTHLY_SENDING_LIMIT
) => {
  return Math.max(0, monthlyLimit - creditsSentThisMonth);
};

/**
 * Validates credit redemption eligibility
 * @param {Number} availableCredits - Available credits
 * @param {Number} creditsToRedeem - Credits to redeem
 * @param {Number} totalCreditsReceived - Total credits received (lifetime)
 * @returns {Object} - { canRedeem: Boolean, message: String }
 */
export const validateRedemptionEligibility = (
  availableCredits,
  creditsToRedeem,
  totalCreditsReceived
) => {
  if (totalCreditsReceived === 0) {
    return {
      canRedeem: false,
      message: "You can only redeem credits you have received. You have not received any credits yet.",
    };
  }

  if (availableCredits < creditsToRedeem) {
    return {
      canRedeem: false,
      message: `Insufficient credits. Available: ${availableCredits}, Requested: ${creditsToRedeem}`,
    };
  }

  return {
    canRedeem: true,
    message: "Eligible for redemption",
  };
};

