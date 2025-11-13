import express from "express";
import {
  createEndorsement,
  deleteEndorsement,
  getEndorsementsByRecognition,
  checkEndorsement,
} from "../controllers/endorsementController.js";

const router = express.Router();

/**
 * @route   POST /api/endorsement
 * @desc    Create a new endorsement (like/cheer) for a recognition
 * @access  Public
 * @body    { recognitionId, endorserId }
 */
router.post("/", createEndorsement);

/**
 * @route   DELETE /api/endorsement/:id
 * @desc    Remove an endorsement
 * @access  Public
 */
router.delete("/:id", deleteEndorsement);

/**
 * @route   GET /api/endorsement/recognition/:recognitionId
 * @desc    Get all endorsements for a specific recognition
 * @access  Public
 */
router.get("/recognition/:recognitionId", getEndorsementsByRecognition);

/**
 * @route   GET /api/endorsement/check/:recognitionId/:endorserId
 * @desc    Check if a user has endorsed a specific recognition
 * @access  Public
 */
router.get("/check/:recognitionId/:endorserId", checkEndorsement);

export default router;

