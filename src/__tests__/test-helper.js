/**
 * Test helper utilities
 */

/**
 * Create a test student
 */
export const createTestStudent = async (Student, studentData = {}) => {
  const defaultData = {
    studentId: `TEST_${Date.now()}`,
    name: "Test Student",
    email: `test${Date.now()}@test.com`,
    credits: 100,
    monthlySendingLimit: 100,
    creditsSentThisMonth: 0,
    totalCreditsReceived: 0,
    ...studentData,
  };

  return await Student.create(defaultData);
};

/**
 * Clean up test data
 */
export const cleanupTestData = async (models, testIds) => {
  const { Student, Recognition, Endorsement } = models;
  
  if (testIds.studentIds) {
    await Student.deleteMany({ studentId: { $in: testIds.studentIds } });
  }
  
  if (testIds.recognitionIds) {
    await Recognition.deleteMany({ _id: { $in: testIds.recognitionIds } });
  }
  
  if (testIds.endorsementIds) {
    await Endorsement.deleteMany({ _id: { $in: testIds.endorsementIds } });
  }
};

/**
 * Wait for async operations
 */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

