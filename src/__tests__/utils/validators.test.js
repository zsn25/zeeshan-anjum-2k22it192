import { describe, it, expect } from "@jest/globals";
import {
  validateStudentId,
  validateEmail,
  validateCredits,
  validateMessage,
  validatePagination,
  validateDifferentStudents,
} from "../../utils/validators.js";

describe("Validators", () => {
  describe("validateStudentId", () => {
    it("should validate correct student ID", () => {
      const result = validateStudentId("STU001");
      expect(result.isValid).toBe(true);
    });

    it("should reject empty student ID", () => {
      const result = validateStudentId("");
      expect(result.isValid).toBe(false);
    });

    it("should reject null student ID", () => {
      const result = validateStudentId(null);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email", () => {
      const result = validateEmail("test@example.com");
      expect(result.isValid).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = validateEmail("invalid-email");
      expect(result.isValid).toBe(false);
    });

    it("should reject empty email", () => {
      const result = validateEmail("");
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateCredits", () => {
    it("should validate positive credits", () => {
      const result = validateCredits(10);
      expect(result.isValid).toBe(true);
    });

    it("should reject negative credits", () => {
      const result = validateCredits(-5);
      expect(result.isValid).toBe(false);
    });

    it("should reject zero credits", () => {
      const result = validateCredits(0);
      expect(result.isValid).toBe(false);
    });

    it("should validate within max limit", () => {
      const result = validateCredits(50, 1, 100);
      expect(result.isValid).toBe(true);
    });

    it("should reject credits exceeding max", () => {
      const result = validateCredits(150, 1, 100);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateMessage", () => {
    it("should validate message within limit", () => {
      const result = validateMessage("Short message");
      expect(result.isValid).toBe(true);
    });

    it("should allow empty message", () => {
      const result = validateMessage("");
      expect(result.isValid).toBe(true);
    });

    it("should reject message exceeding max length", () => {
      const longMessage = "a".repeat(501);
      const result = validateMessage(longMessage, 500);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validatePagination", () => {
    it("should validate correct pagination", () => {
      const result = validatePagination(10, 0);
      expect(result.isValid).toBe(true);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    it("should reject negative limit", () => {
      const result = validatePagination(-1, 0);
      expect(result.isValid).toBe(false);
    });

    it("should reject negative offset", () => {
      const result = validatePagination(10, -1);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateDifferentStudents", () => {
    it("should validate different students", () => {
      const result = validateDifferentStudents("STU001", "STU002");
      expect(result.isValid).toBe(true);
    });

    it("should reject same student", () => {
      const result = validateDifferentStudents("STU001", "STU001");
      expect(result.isValid).toBe(false);
    });
  });
});

