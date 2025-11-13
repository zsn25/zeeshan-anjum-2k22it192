import mongoose from "mongoose";

const endorsementSchema = new mongoose.Schema(
  {
    recognitionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Recognition",
      index: true,
    },
    endorserId: {
      type: String,
      required: true,
      ref: "Student",
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound unique index to ensure one endorsement per user per recognition
endorsementSchema.index({ recognitionId: 1, endorserId: 1 }, { unique: true });

// Validation: Prevent self-endorsement of own recognition
endorsementSchema.pre("save", async function (next) {
  try {
    const Recognition = mongoose.model("Recognition");
    const recognition = await Recognition.findById(this.recognitionId);
    
    if (recognition && recognition.senderId === this.endorserId) {
      // Allow endorsing own recognition (not explicitly forbidden in requirements)
      // But if you want to prevent it, uncomment below:
      // const error = new Error("Cannot endorse your own recognition");
      // return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Endorsement = mongoose.model("Endorsement", endorsementSchema);

export default Endorsement;

