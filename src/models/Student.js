import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Current available credits (can be used for sending)
    credits: {
      type: Number,
      required: true,
      default: 100,
      min: 0,
    },
    // Monthly sending limit (resets each month)
    monthlySendingLimit: {
      type: Number,
      required: true,
      default: 100,
      min: 0,
    },
    // Credits sent this month (tracks against monthlySendingLimit)
    creditsSentThisMonth: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    // Total credits received (lifetime, for leaderboard)
    totalCreditsReceived: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    // Last month reset date (YYYY-MM format, e.g., "2024-01")
    lastResetMonth: {
      type: String,
      default: null,
    },
    // Unused credits from previous month (for carry-forward calculation)
    previousMonthUnusedCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for efficient queries (studentId already indexed via unique: true)
studentSchema.index({ totalCreditsReceived: -1, studentId: 1 }); // For leaderboard

const Student = mongoose.model("Student", studentSchema);

export default Student;

