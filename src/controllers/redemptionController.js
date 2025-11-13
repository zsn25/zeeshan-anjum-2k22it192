import Student from "../models/Student.js";
import Recognition from "../models/Recognition.js";
import { checkAndResetMonthlyCredits } from "../utils/monthlyReset.js";

// Fixed conversion rate: ₹5 per credit
const CREDIT_TO_RUPEE_RATE = 5;

/**
 * Redeem credits for vouchers
 * POST /api/redemption
 */
export const redeemCredits = async (req, res) => {
  try {
    const { studentId, creditsToRedeem } = req.body;

    // Validation: Required fields
    if (!studentId || creditsToRedeem === undefined) {
      return res.status(400).json({
        success: false,
        message: "studentId and creditsToRedeem are required",
      });
    }

    // Validation: Credits must be positive
    if (creditsToRedeem <= 0) {
      return res.status(400).json({
        success: false,
        message: "Credits to redeem must be greater than 0",
      });
    }

    // Check and reset monthly credits if needed (this ensures we have latest balance)
    const student = await checkAndResetMonthlyCredits(studentId);

    // Validation: Student must have enough credits
    if (student.credits < creditsToRedeem) {
      return res.status(400).json({
        success: false,
        message: `Insufficient credits. Available: ${student.credits}, Requested: ${creditsToRedeem}`,
      });
    }

    // Check if student has received credits (can only redeem received credits)
    // We check if totalCreditsReceived is greater than 0
    // Note: In a more complex system, we might track "received" vs "sent" credits separately
    // For now, we assume if they have credits and have received some, they can redeem
    const totalReceived = student.totalCreditsReceived || 0;
    
    if (totalReceived === 0) {
      return res.status(400).json({
        success: false,
        message: "You can only redeem credits you have received. You have not received any credits yet.",
      });
    }

    // Calculate voucher value
    const voucherValue = creditsToRedeem * CREDIT_TO_RUPEE_RATE;

    // Deduct credits permanently from student's balance
    student.credits -= creditsToRedeem;
    await student.save();

    // In a production system, you would create a redemption record here
    // For now, we'll just return the redemption details

    res.status(200).json({
      success: true,
      message: "Credits redeemed successfully",
      data: {
        redemption: {
          studentId: student.studentId,
          creditsRedeemed: creditsToRedeem,
          voucherValue: voucherValue,
          voucherValueCurrency: `₹${voucherValue}`,
          remainingCredits: student.credits,
          redeemedAt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Error redeeming credits:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to redeem credits",
    });
  }
};

/**
 * Get redemption history for a student (if we had a Redemption model)
 * For now, this is a placeholder
 * GET /api/redemption/history/:studentId
 */
export const getRedemptionHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // In a production system, you would query a Redemption model here
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      message: "Redemption history feature - to be implemented with Redemption model",
      data: {
        studentId,
        currentCredits: student.credits,
        totalCreditsReceived: student.totalCreditsReceived,
        note: "Redemption history tracking requires a Redemption model to be implemented",
      },
    });
  } catch (error) {
    console.error("Error fetching redemption history:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch redemption history",
    });
  }
};

/**
 * Get redemption rate and student's redeemable credits info
 * GET /api/redemption/info/:studentId
 */
export const getRedemptionInfo = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await checkAndResetMonthlyCredits(studentId);

    const redeemableCredits = student.credits;
    const potentialVoucherValue = redeemableCredits * CREDIT_TO_RUPEE_RATE;

    res.status(200).json({
      success: true,
      data: {
        studentId: student.studentId,
        availableCredits: redeemableCredits,
        conversionRate: CREDIT_TO_RUPEE_RATE,
        currency: "INR",
        potentialVoucherValue: potentialVoucherValue,
        potentialVoucherValueFormatted: `₹${potentialVoucherValue}`,
        totalCreditsReceived: student.totalCreditsReceived,
      },
    });
  } catch (error) {
    console.error("Error fetching redemption info:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch redemption info",
    });
  }
};

