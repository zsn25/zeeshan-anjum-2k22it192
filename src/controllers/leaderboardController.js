import Student from "../models/Student.js";
import Recognition from "../models/Recognition.js";
import Endorsement from "../models/Endorsement.js";
import mongoose from "mongoose";

/**
 * Get leaderboard of top recipients
 * GET /api/leaderboard
 * Query params: limit (default: 10)
 */
export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get top students by totalCreditsReceived, sorted by credits (desc) then studentId (asc)
    const topStudents = await Student.find()
      .sort({ totalCreditsReceived: -1, studentId: 1 })
      .limit(limit)
      .select("studentId name totalCreditsReceived")
      .lean();

    // Get recognition counts and endorsement counts for each student
    const leaderboard = await Promise.all(
      topStudents.map(async (student) => {
        // Count recognitions received
        const recognitionCount = await Recognition.countDocuments({
          receiverId: student.studentId,
        });

        // Get all recognition IDs for this student
        const recognitions = await Recognition.find({
          receiverId: student.studentId,
        }).select("_id");

        const recognitionIds = recognitions.map((r) => r._id);

        // Count total endorsements across all recognitions
        const endorsementCount =
          recognitionIds.length > 0
            ? await Endorsement.countDocuments({
                recognitionId: { $in: recognitionIds },
              })
            : 0;

        return {
          rank: topStudents.indexOf(student) + 1,
          studentId: student.studentId,
          name: student.name,
          totalCreditsReceived: student.totalCreditsReceived || 0,
          recognitionCount,
          endorsementCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        limit,
        total: leaderboard.length,
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch leaderboard",
    });
  }
};

/**
 * Get leaderboard with optimized aggregation (more efficient for large datasets)
 * GET /api/leaderboard/optimized
 * Query params: limit (default: 10)
 */
export const getLeaderboardOptimized = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Use aggregation pipeline for better performance
    const leaderboard = await Student.aggregate([
      {
        $sort: { totalCreditsReceived: -1, studentId: 1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "recognitions",
          localField: "studentId",
          foreignField: "receiverId",
          as: "recognitions",
        },
      },
      {
        $lookup: {
          from: "endorsements",
          localField: "recognitions._id",
          foreignField: "recognitionId",
          as: "endorsements",
        },
      },
      {
        $project: {
          studentId: 1,
          name: 1,
          totalCreditsReceived: { $ifNull: ["$totalCreditsReceived", 0] },
          recognitionCount: { $size: "$recognitions" },
          endorsementCount: { $size: "$endorsements" },
        },
      },
      {
        $addFields: {
          rank: { $add: [{ $indexOfArray: ["$studentId", "$studentId"] }, 1] },
        },
      },
    ]);

    // Manually add rank since $indexOfArray doesn't work as expected in this context
    leaderboard.forEach((student, index) => {
      student.rank = index + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        limit,
        total: leaderboard.length,
      },
    });
  } catch (error) {
    console.error("Error fetching optimized leaderboard:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch leaderboard",
    });
  }
};

/**
 * Get a specific student's ranking
 * GET /api/leaderboard/student/:studentId
 */
export const getStudentRanking = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Count how many students have more totalCreditsReceived
    const rank =
      (await Student.countDocuments({
        $or: [
          { totalCreditsReceived: { $gt: student.totalCreditsReceived || 0 } },
          {
            totalCreditsReceived: student.totalCreditsReceived || 0,
            studentId: { $lt: student.studentId },
          },
        ],
      })) + 1;

    // Get recognition and endorsement counts
    const recognitionCount = await Recognition.countDocuments({
      receiverId: studentId,
    });

    const recognitions = await Recognition.find({
      receiverId: studentId,
    }).select("_id");

    const recognitionIds = recognitions.map((r) => r._id);
    const endorsementCount =
      recognitionIds.length > 0
        ? await Endorsement.countDocuments({
            recognitionId: { $in: recognitionIds },
          })
        : 0;

    res.status(200).json({
      success: true,
      data: {
        rank,
        studentId: student.studentId,
        name: student.name,
        totalCreditsReceived: student.totalCreditsReceived || 0,
        recognitionCount,
        endorsementCount,
      },
    });
  } catch (error) {
    console.error("Error fetching student ranking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch student ranking",
    });
  }
};

