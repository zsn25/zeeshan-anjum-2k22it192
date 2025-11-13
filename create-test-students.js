import dotenv from "dotenv";
import mongoose from "mongoose";
import Student from "./src/models/Student.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const testStudents = [
  {
    studentId: "STU001",
    name: "Alice Johnson",
    email: "alice@college.edu",
    credits: 100,
    monthlySendingLimit: 100,
    creditsSentThisMonth: 0,
    totalCreditsReceived: 0,
  },
  {
    studentId: "STU002",
    name: "Bob Smith",
    email: "bob@college.edu",
    credits: 100,
    monthlySendingLimit: 100,
    creditsSentThisMonth: 0,
    totalCreditsReceived: 0,
  },
  {
    studentId: "STU003",
    name: "Charlie Brown",
    email: "charlie@college.edu",
    credits: 100,
    monthlySendingLimit: 100,
    creditsSentThisMonth: 0,
    totalCreditsReceived: 0,
  },
];

const createTestStudents = async () => {
  try {
    await connectDB();
    console.log("📝 Creating test students...\n");

    for (const studentData of testStudents) {
      try {
        // Check if student already exists
        const existing = await Student.findOne({ studentId: studentData.studentId });
        if (existing) {
          console.log(`⚠️  Student ${studentData.studentId} already exists, skipping...`);
          continue;
        }

        const student = await Student.create(studentData);
        console.log(`✅ Created student: ${student.studentId} - ${student.name}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Student ${studentData.studentId} already exists (duplicate key)`);
        } else {
          console.error(`❌ Error creating ${studentData.studentId}:`, error.message);
        }
      }
    }

    console.log("\n✅ Test students setup complete!");
    console.log("\n📊 Current students in database:");
    const allStudents = await Student.find().select("studentId name email credits").lean();
    allStudents.forEach((s) => {
      console.log(`   - ${s.studentId}: ${s.name} (${s.email}) - Credits: ${s.credits}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createTestStudents();

