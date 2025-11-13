import express from "express";
import {
  getLeaderboard,
  getLeaderboardOptimized,
  getStudentRanking,
} from "../controllers/leaderboardController.js";

const router = express.Router();

/**
 * @route   GET /api/leaderboard
 * @desc    Get leaderboard of top recipients
 * @access  Public
 * @query   limit (default: 10)
 */
router.get("/", getLeaderboard);

/**
 * @route   GET /api/leaderboard/optimized
 * @desc    Get leaderboard using optimized aggregation (better for large datasets)
 * @access  Public
 * @query   limit (default: 10)
 */
router.get("/optimized", getLeaderboardOptimized);

/**
 * @route   GET /api/leaderboard/student/:studentId
 * @desc    Get a specific student's ranking and stats
 * @access  Public
 */
router.get("/student/:studentId", getStudentRanking);

export default router;

