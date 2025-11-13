import express from "express";
import {
  redeemCredits,
  getRedemptionHistory,
  getRedemptionInfo,
} from "../controllers/redemptionController.js";

const router = express.Router();

/**
 * @route   POST /api/redemption
 * @desc    Redeem credits for vouchers (₹5 per credit)
 * @access  Public
 * @body    { studentId, creditsToRedeem }
 */
router.post("/", redeemCredits);

/**
 * @route   GET /api/redemption/info/:studentId
 * @desc    Get redemption information for a student
 * @access  Public
 */
router.get("/info/:studentId", getRedemptionInfo);

/**
 * @route   GET /api/redemption/history/:studentId
 * @desc    Get redemption history for a student
 * @access  Public
 * @note    Placeholder - requires Redemption model for full implementation
 */
router.get("/history/:studentId", getRedemptionHistory);

export default router;

