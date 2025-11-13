import { describe, it, expect } from "@jest/globals";
import {
  getCurrentMonth,
  getCurrentYear,
  formatDate,
  isValidMonthFormat,
  isFirstDayOfMonth,
} from "../../utils/dateHelpers.js";

describe("Date Helpers", () => {
  describe("getCurrentMonth", () => {
    it("should return current month in YYYY-MM format", () => {
      const month = getCurrentMonth();
      expect(month).toMatch(/^\d{4}-\d{2}$/);
      const [year, monthNum] = month.split("-").map(Number);
      expect(year).toBeGreaterThan(2020);
      expect(monthNum).toBeGreaterThanOrEqual(1);
      expect(monthNum).toBeLessThanOrEqual(12);
    });
  });

  describe("getCurrentYear", () => {
    it("should return current year", () => {
      const year = getCurrentYear();
      expect(year).toBeGreaterThan(2020);
      expect(typeof year).toBe("number");
    });
  });

  describe("formatDate", () => {
    it("should format date to YYYY-MM-DD", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date);
      expect(formatted).toBe("2024-01-15");
    });

    it("should handle date strings", () => {
      const formatted = formatDate("2024-01-15");
      expect(formatted).toBe("2024-01-15");
    });
  });

  describe("isValidMonthFormat", () => {
    it("should validate correct month format", () => {
      expect(isValidMonthFormat("2024-01")).toBe(true);
      expect(isValidMonthFormat("2024-12")).toBe(true);
    });

    it("should reject invalid formats", () => {
      expect(isValidMonthFormat("2024-1")).toBe(false);
      expect(isValidMonthFormat("24-01")).toBe(false);
      expect(isValidMonthFormat("2024-13")).toBe(false);
      expect(isValidMonthFormat("invalid")).toBe(false);
    });
  });

  describe("isFirstDayOfMonth", () => {
    it("should return boolean", () => {
      const result = isFirstDayOfMonth();
      expect(typeof result).toBe("boolean");
    });
  });
});

