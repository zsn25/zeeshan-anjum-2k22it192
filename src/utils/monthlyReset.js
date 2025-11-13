import Student from "../models/Student.js";
import { getCurrentMonth } from "./dateHelpers.js";

// Re-export getCurrentMonth for backward compatibility
export { getCurrentMonth };

/**
 * Checks and performs monthly credit reset if needed for a single student
 * @param {String} studentId - The student ID to check
 * @returns {Promise<Object>} - Updated student object
 */
export const checkAndResetMonthlyCredits = async (studentId) => {
  const student = await Student.findOne({ studentId });
  
  if (!student) {
    throw new Error("Student not found");
  }

  return await resetStudentCreditsIfNeeded(student);
};

/**
 * Resets credits for a student if a new month has started
 * @param {Object} student - Student document
 * @returns {Promise<Object>} - Updated student object
 */
export const resetStudentCreditsIfNeeded = async (student) => {
  const currentMonth = getCurrentMonth();
  
  // If lastResetMonth is null or different from current month, reset is needed
  if (!student.lastResetMonth || student.lastResetMonth !== currentMonth) {
    // Calculate carry-forward (max 50 credits)
    const carryForward = Math.min(50, student.previousMonthUnusedCredits || 0);
    
    // Calculate unused credits from previous month (before reset)
    const previousUnusedCredits = student.credits;
    
    // Reset credits to 100 + carry-forward
    student.credits = 100 + carryForward;
    student.monthlySendingLimit = 100;
    student.creditsSentThisMonth = 0;
    student.previousMonthUnusedCredits = previousUnusedCredits;
    student.lastResetMonth = currentMonth;
    
    await student.save();
  }
  
  return student;
};

/**
 * Batch reset credits for all students (useful for scheduled jobs)
 * @returns {Promise<Object>} - Summary of reset operation
 */
export const batchResetAllStudents = async () => {
  try {
    const currentMonth = getCurrentMonth();
    const students = await Student.find({
      $or: [
        { lastResetMonth: { $ne: currentMonth } },
        { lastResetMonth: null },
      ],
    });

    let resetCount = 0;
    let totalCarryForward = 0;

    for (const student of students) {
      const previousCredits = student.credits;
      const carryForward = Math.min(50, student.previousMonthUnusedCredits || 0);
      
      student.credits = 100 + carryForward;
      student.monthlySendingLimit = 100;
      student.creditsSentThisMonth = 0;
      student.previousMonthUnusedCredits = previousCredits;
      student.lastResetMonth = currentMonth;
      
      await student.save();
      resetCount++;
      totalCarryForward += carryForward;
    }

    return {
      success: true,
      resetCount,
      totalCarryForward,
      currentMonth,
      message: `Successfully reset ${resetCount} student(s)`,
    };
  } catch (error) {
    throw new Error(`Batch reset failed: ${error.message}`);
  }
};

/**
 * Get reset statistics for monitoring
 * @returns {Promise<Object>} - Reset statistics
 */
export const getResetStatistics = async () => {
  const currentMonth = getCurrentMonth();
  
  const totalStudents = await Student.countDocuments();
  const studentsNeedingReset = await Student.countDocuments({
    $or: [
      { lastResetMonth: { $ne: currentMonth } },
      { lastResetMonth: null },
    ],
  });
  
  const studentsWithCarryForward = await Student.countDocuments({
    previousMonthUnusedCredits: { $gt: 0, $lte: 50 },
  });
  
  const studentsWithMaxCarryForward = await Student.countDocuments({
    previousMonthUnusedCredits: { $gt: 50 },
  });

  return {
    currentMonth,
    totalStudents,
    studentsNeedingReset,
    studentsWithCarryForward,
    studentsWithMaxCarryForward,
    resetPercentage: totalStudents > 0 
      ? ((studentsNeedingReset / totalStudents) * 100).toFixed(2) 
      : 0,
  };
};

