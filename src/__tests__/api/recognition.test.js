import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import Student from "../../models/Student.js";
import Recognition from "../../models/Recognition.js";

describe("Recognition API", () => {
  let testSender, testReceiver;

  beforeAll(async () => {
    // Connect to test database or use existing
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/boostly_test");
    }

    // Create test students
    testSender = await Student.create({
      studentId: "TEST_SENDER",
      name: "Test Sender",
      email: "sender@test.com",
      credits: 100,
      monthlySendingLimit: 100,
      creditsSentThisMonth: 0,
    });

    testReceiver = await Student.create({
      studentId: "TEST_RECEIVER",
      name: "Test Receiver",
      email: "receiver@test.com",
      credits: 100,
      monthlySendingLimit: 100,
      creditsSentThisMonth: 0,
    });
  });

  afterAll(async () => {
    // Clean up test data
    await Student.deleteMany({ studentId: { $in: ["TEST_SENDER", "TEST_RECEIVER"] } });
    await Recognition.deleteMany({
      senderId: { $in: ["TEST_SENDER", "TEST_RECEIVER"] },
      receiverId: { $in: ["TEST_SENDER", "TEST_RECEIVER"] },
    });
    // Don't close connection as it might be shared
  });

  describe("POST /api/recognition", () => {
    it("should create a recognition successfully", async () => {
      const response = await request(app)
        .post("/api/recognition")
        .send({
          senderId: "TEST_SENDER",
          receiverId: "TEST_RECEIVER",
          credits: 10,
          message: "Great work!",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.recognition.credits).toBe(10);
      expect(response.body.data.senderBalance).toBe(90);
      expect(response.body.data.receiverBalance).toBe(110);
    });

    it("should reject self-recognition", async () => {
      const response = await request(app)
        .post("/api/recognition")
        .send({
          senderId: "TEST_SENDER",
          receiverId: "TEST_SENDER",
          credits: 10,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Self-recognition");
    });

    it("should reject insufficient credits", async () => {
      // First, reduce sender's credits
      await Student.updateOne(
        { studentId: "TEST_SENDER" },
        { credits: 5 }
      );

      const response = await request(app)
        .post("/api/recognition")
        .send({
          senderId: "TEST_SENDER",
          receiverId: "TEST_RECEIVER",
          credits: 10,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Insufficient credits");

      // Reset credits
      await Student.updateOne(
        { studentId: "TEST_SENDER" },
        { credits: 100 }
      );
    });

    it("should require all fields", async () => {
      const response = await request(app)
        .post("/api/recognition")
        .send({
          senderId: "TEST_SENDER",
          // Missing receiverId and credits
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/recognition/received/:studentId", () => {
    it("should get received recognitions", async () => {
      const response = await request(app)
        .get("/api/recognition/received/TEST_RECEIVER");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.recognitions)).toBe(true);
    });
  });

  describe("GET /api/recognition/sent/:studentId", () => {
    it("should get sent recognitions", async () => {
      const response = await request(app)
        .get("/api/recognition/sent/TEST_SENDER");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.recognitions)).toBe(true);
    });
  });
});

