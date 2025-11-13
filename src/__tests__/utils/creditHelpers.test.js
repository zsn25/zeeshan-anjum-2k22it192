import { describe, it, expect } from "@jest/globals";
import {
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
} from "../../utils/creditHelpers.js";

describe("Credit Helpers", () => {
  describe("Constants", () => {
    it("should have correct credit to rupee rate", () => {
      expect(CREDIT_TO_RUPEE_RATE).toBe(5);
    });

    it("should have correct monthly allocation", () => {
      expect(MONTHLY_CREDIT_ALLOCATION).toBe(100);
    });

    it("should have correct monthly sending limit", () => {
      expect(MONTHLY_SENDING_LIMIT).toBe(100);
    });

    it("should have correct max carry forward", () => {
      expect(MAX_CARRY_FORWARD_CREDITS).toBe(50);
    });
  });

  describe("creditsToRupees", () => {
    it("should convert credits to rupees correctly", () => {
      expect(creditsToRupees(20)).toBe(100);
      expect(creditsToRupees(10)).toBe(50);
      expect(creditsToRupees(0)).toBe(0);
    });
  });

  describe("formatVoucherValue", () => {
    it("should format voucher value correctly", () => {
      expect(formatVoucherValue(20)).toBe("₹100");
      expect(formatVoucherValue(10)).toBe("₹50");
    });
  });

  describe("calculateCarryForward", () => {
    it("should calculate carry forward correctly", () => {
      expect(calculateCarryForward(30)).toBe(30);
      expect(calculateCarryForward(50)).toBe(50);
      expect(calculateCarryForward(100)).toBe(50); // Max is 50
      expect(calculateCarryForward(0)).toBe(0);
    });
  });

  describe("calculateNewMonthCredits", () => {
    it("should calculate new month credits correctly", () => {
      expect(calculateNewMonthCredits(30)).toBe(130); // 100 + 30
      expect(calculateNewMonthCredits(50)).toBe(150); // 100 + 50
      expect(calculateNewMonthCredits(100)).toBe(150); // 100 + 50 (max)
    });
  });

  describe("checkSufficientCredits", () => {
    it("should validate sufficient credits", () => {
      const result = checkSufficientCredits(100, 50);
      expect(result.hasSufficient).toBe(true);
    });

    it("should detect insufficient credits", () => {
      const result = checkSufficientCredits(30, 50);
      expect(result.hasSufficient).toBe(false);
      expect(result.message).toContain("Insufficient credits");
    });
  });

  describe("checkMonthlySendingLimit", () => {
    it("should validate within monthly limit", () => {
      const result = checkMonthlySendingLimit(50, 30, 100);
      expect(result.canSend).toBe(true);
    });

    it("should detect exceeding monthly limit", () => {
      const result = checkMonthlySendingLimit(80, 30, 100);
      expect(result.canSend).toBe(false);
      expect(result.message).toContain("Monthly sending limit exceeded");
    });
  });

  describe("getRemainingMonthlyCapacity", () => {
    it("should calculate remaining capacity", () => {
      expect(getRemainingMonthlyCapacity(50, 100)).toBe(50);
      expect(getRemainingMonthlyCapacity(100, 100)).toBe(0);
      expect(getRemainingMonthlyCapacity(0, 100)).toBe(100);
    });
  });
});

