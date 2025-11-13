import Endorsement from "../models/Endorsement.js";
import Recognition from "../models/Recognition.js";

/**
 * Create a new endorsement (like/cheer) for a recognition
 * POST /api/endorsement
 */
export const createEndorsement = async (req, res) => {
  try {
    const { recognitionId, endorserId } = req.body;

    // Validation: Required fields
    if (!recognitionId || !endorserId) {
      return res.status(400).json({
        success: false,
        message: "recognitionId and endorserId are required",
      });
    }

    // Check if recognition exists
    const recognition = await Recognition.findById(recognitionId);
    if (!recognition) {
      return res.status(404).json({
        success: false,
        message: "Recognition not found",
      });
    }

    // Check if endorsement already exists (unique constraint will also catch this)
    const existingEndorsement = await Endorsement.findOne({
      recognitionId,
      endorserId,
    });

    if (existingEndorsement) {
      return res.status(400).json({
        success: false,
        message: "You have already endorsed this recognition",
      });
    }

    // Create endorsement
    const endorsement = new Endorsement({
      recognitionId,
      endorserId,
    });

    await endorsement.save();

    res.status(201).json({
      success: true,
      message: "Endorsement created successfully",
      data: {
        endorsement: {
          id: endorsement._id,
          recognitionId: endorsement.recognitionId,
          endorserId: endorsement.endorserId,
          createdAt: endorsement.createdAt,
        },
      },
    });
  } catch (error) {
    // Handle unique constraint violation
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already endorsed this recognition",
      });
    }

    console.error("Error creating endorsement:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create endorsement",
    });
  }
};

/**
 * Remove an endorsement (unlike/uncheer)
 * DELETE /api/endorsement/:id
 */
export const deleteEndorsement = async (req, res) => {
  try {
    const { id } = req.params;

    const endorsement = await Endorsement.findByIdAndDelete(id);

    if (!endorsement) {
      return res.status(404).json({
        success: false,
        message: "Endorsement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Endorsement removed successfully",
    });
  } catch (error) {
    console.error("Error deleting endorsement:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete endorsement",
    });
  }
};

/**
 * Get all endorsements for a specific recognition
 * GET /api/endorsement/recognition/:recognitionId
 */
export const getEndorsementsByRecognition = async (req, res) => {
  try {
    const { recognitionId } = req.params;

    const endorsements = await Endorsement.find({ recognitionId })
      .populate("endorserId", "name studentId")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        endorsements,
        count: endorsements.length,
      },
    });
  } catch (error) {
    console.error("Error fetching endorsements:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch endorsements",
    });
  }
};

/**
 * Check if a user has endorsed a specific recognition
 * GET /api/endorsement/check/:recognitionId/:endorserId
 */
export const checkEndorsement = async (req, res) => {
  try {
    const { recognitionId, endorserId } = req.params;

    const endorsement = await Endorsement.findOne({
      recognitionId,
      endorserId,
    });

    res.status(200).json({
      success: true,
      data: {
        hasEndorsed: !!endorsement,
        endorsement: endorsement || null,
      },
    });
  } catch (error) {
    console.error("Error checking endorsement:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to check endorsement",
    });
  }
};

