import mongoose from "mongoose";

const recognitionSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
      ref: "Student",
      index: true,
    },
    receiverId: {
      type: String,
      required: true,
      ref: "Student",
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Credits must be greater than 0",
      },
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Track which month this recognition was made (YYYY-MM format)
    recognitionMonth: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound indexes for efficient queries
recognitionSchema.index({ receiverId: 1, createdAt: -1 });
recognitionSchema.index({ senderId: 1, recognitionMonth: 1 });

// Validation: Prevent self-recognition
recognitionSchema.pre("save", function (next) {
  if (this.senderId === this.receiverId) {
    const error = new Error("Self-recognition is not allowed");
    return next(error);
  }
  next();
});

const Recognition = mongoose.model("Recognition", recognitionSchema);

export default Recognition;

