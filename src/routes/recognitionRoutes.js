import express from "express";
import {
  createRecognition,
  getReceivedRecognitions,
  getSentRecognitions,
  getRecognitionById,
} from "../controllers/recognitionController.js";

const router = express.Router();

/**
 * @route   POST /api/recognition
 * @desc    Create a new recognition (transfer credits)
 * @access  Public
 * @body    { senderId, receiverId, credits, message? }
 */
router.post("/", createRecognition);

/**
 * @route   GET /api/recognition/received/:studentId
 * @desc    Get all recognitions received by a student
 * @access  Public
 * @query   limit, offset
 */
router.get("/received/:studentId", getReceivedRecognitions);

/**
 * @route   GET /api/recognition/sent/:studentId
 * @desc    Get all recognitions sent by a student
 * @access  Public
 * @query   limit, offset
 */
router.get("/sent/:studentId", getSentRecognitions);

/**
 * @route   GET /api/recognition/:id
 * @desc    Get a specific recognition by ID
 * @access  Public
 */
router.get("/:id", getRecognitionById);

export default router;

