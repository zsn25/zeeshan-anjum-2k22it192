import Recognition from "../models/Recognition.js";
import Student from "../models/Student.js";
import { checkAndResetMonthlyCredits, getCurrentMonth } from "../utils/monthlyReset.js";

/**
 * Create a new recognition (transfer credits from sender to receiver)
 * POST /api/recognition
 */
export const createRecognition = async (req, res) => {
  try {
    const { senderId, receiverId, credits, message } = req.body;

    // Validation: Required fields
    if (!senderId || !receiverId || !credits) {
      return res.status(400).json({
        success: false,
        message: "senderId, receiverId, and credits are required",
      });
    }

    // Validation: Credits must be positive
    if (credits <= 0) {
      return res.status(400).json({
        success: false,
        message: "Credits must be greater than 0",
      });
    }

    // Validation: Prevent self-recognition
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Self-recognition is not allowed",
      });
    }

    // Check and reset monthly credits if needed
    const sender = await checkAndResetMonthlyCredits(senderId);
    const receiver = await Student.findOne({ studentId: receiverId });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver student not found",
      });
    }

    // Validation: Sender must have enough credits
    if (sender.credits < credits) {
      return res.status(400).json({
        success: false,
        message: `Insufficient credits. Available: ${sender.credits}, Requested: ${credits}`,
      });
    }

    // Validation: Check monthly sending limit
    const currentMonth = getCurrentMonth();
    const monthlySent = sender.creditsSentThisMonth || 0;
    
    if (monthlySent + credits > sender.monthlySendingLimit) {
      return res.status(400).json({
        success: false,
        message: `Monthly sending limit exceeded. Limit: ${sender.monthlySendingLimit}, Already sent: ${monthlySent}, Requested: ${credits}`,
      });
    }

    // Create recognition transaction
    const recognition = new Recognition({
      senderId,
      receiverId,
      credits,
      message: message || "",
      recognitionMonth: currentMonth,
    });

    await recognition.save();

    // Update sender: deduct credits and update monthly sent
    sender.credits -= credits;
    sender.creditsSentThisMonth = (sender.creditsSentThisMonth || 0) + credits;
    await sender.save();

    // Update receiver: add credits and update total received
    receiver.credits += credits;
    receiver.totalCreditsReceived = (receiver.totalCreditsReceived || 0) + credits;
    await receiver.save();

    res.status(201).json({
      success: true,
      message: "Recognition created successfully",
      data: {
        recognition: {
          id: recognition._id,
          senderId: recognition.senderId,
          receiverId: recognition.receiverId,
          credits: recognition.credits,
          message: recognition.message,
          createdAt: recognition.createdAt,
        },
        senderBalance: sender.credits,
        receiverBalance: receiver.credits,
      },
    });
  } catch (error) {
    console.error("Error creating recognition:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create recognition",
    });
  }
};

/**
 * Get all recognitions for a specific student (as receiver)
 * GET /api/recognition/received/:studentId
 */
export const getReceivedRecognitions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const recognitions = await Recognition.find({ receiverId: studentId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();
    
    // Populate sender information manually since we use string IDs
    let recognitionsWithSenders = recognitions;
    if (recognitions.length > 0) {
      const senderIds = [...new Set(recognitions.map(r => r.senderId))];
      const senders = await Student.find({ studentId: { $in: senderIds } })
        .select("studentId name")
        .lean();
      const senderMap = new Map(senders.map(s => [s.studentId, s]));
      
      recognitionsWithSenders = recognitions.map(rec => ({
        ...rec,
        sender: senderMap.get(rec.senderId) || { studentId: rec.senderId, name: "Unknown" }
      }));
    }

    const total = await Recognition.countDocuments({ receiverId: studentId });

    res.status(200).json({
      success: true,
      data: {
        recognitions: recognitionsWithSenders,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error fetching received recognitions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch recognitions",
    });
  }
};

/**
 * Get all recognitions sent by a specific student
 * GET /api/recognition/sent/:studentId
 */
export const getSentRecognitions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const recognitions = await Recognition.find({ senderId: studentId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();
    
    // Populate receiver information manually since we use string IDs
    let recognitionsWithReceivers = recognitions;
    if (recognitions.length > 0) {
      const receiverIds = [...new Set(recognitions.map(r => r.receiverId))];
      const receivers = await Student.find({ studentId: { $in: receiverIds } })
        .select("studentId name")
        .lean();
      const receiverMap = new Map(receivers.map(r => [r.studentId, r]));
      
      recognitionsWithReceivers = recognitions.map(rec => ({
        ...rec,
        receiver: receiverMap.get(rec.receiverId) || { studentId: rec.receiverId, name: "Unknown" }
      }));
    }

    const total = await Recognition.countDocuments({ senderId: studentId });

    res.status(200).json({
      success: true,
      data: {
        recognitions: recognitionsWithReceivers,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error fetching sent recognitions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch recognitions",
    });
  }
};

/**
 * Get a specific recognition by ID
 * GET /api/recognition/:id
 */
export const getRecognitionById = async (req, res) => {
  try {
    const { id } = req.params;

    const recognition = await Recognition.findById(id).lean();
    
    if (recognition) {
      // Populate sender and receiver information
      const sender = await Student.findOne({ studentId: recognition.senderId })
        .select("studentId name")
        .lean();
      const receiver = await Student.findOne({ studentId: recognition.receiverId })
        .select("studentId name")
        .lean();
      
      recognition.sender = sender || { studentId: recognition.senderId, name: "Unknown" };
      recognition.receiver = receiver || { studentId: recognition.receiverId, name: "Unknown" };
    }

    if (!recognition) {
      return res.status(404).json({
        success: false,
        message: "Recognition not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { recognition },
    });
  } catch (error) {
    console.error("Error fetching recognition:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch recognition",
    });
  }
};

