/**
 * Date and time utility functions
 */

/**
 * Gets current month in YYYY-MM format
 * @returns {String} - Current month string (e.g., "2024-01")
 */
export const getCurrentMonth = () => {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
};

/**
 * Gets current year
 * @returns {Number} - Current year
 */
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Gets current month number (1-12)
 * @returns {Number} - Current month number
 */
export const getCurrentMonthNumber = () => {
  return new Date().getMonth() + 1;
};

/**
 * Formats a date to YYYY-MM-DD format
 * @param {Date} date - Date object to format
 * @returns {String} - Formatted date string
 */
export const formatDate = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date to readable string
 * @param {Date} date - Date object to format
 * @returns {String} - Formatted date string (e.g., "January 15, 2024")
 */
export const formatDateReadable = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Checks if a month string is valid (YYYY-MM format)
 * @param {String} monthString - Month string to validate
 * @returns {Boolean} - True if valid
 */
export const isValidMonthFormat = (monthString) => {
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(monthString)) {
    return false;
  }
  
  const [year, month] = monthString.split("-").map(Number);
  return year > 0 && month >= 1 && month <= 12;
};

/**
 * Gets the first day of the current month
 * @returns {Date} - First day of current month
 */
export const getFirstDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

/**
 * Gets the last day of the current month
 * @returns {Date} - Last day of current month
 */
export const getLastDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
};

/**
 * Checks if we're on the first day of the month
 * @returns {Boolean} - True if today is the first day
 */
export const isFirstDayOfMonth = () => {
  const today = new Date();
  return today.getDate() === 1;
};

