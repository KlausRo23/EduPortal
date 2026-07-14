import mongoose from "mongoose";

// This is to store the student's personal details
const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["irregular", "regular"],
    default: "regular",
  },
  program: {
    type: String,
    enum: [
      "Bachelor of Science in Information Technology",
      "Bachelor of Science in Computer Science",
      "Bachelor of Science in Information Systems",
      "Bachelor of Science in Accountancy",
      "Bachelor of Science in Management Accounting",
      "Bachelor of Science in Entrepreneurship",
      "Bachelor of Science in Industrial Engineering",
      "Bachelor of Science in Electronics Engineering",
      "Bachelor of Science in Computer Engineering",
      "Bachelor of Early Childhood Education",
    ],
    required: true,
  },
  yearLevel: {
    type: String,
    enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    required: true,
  },
  enrolledIn: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  grades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
    },
  ],
  section: {
    type: String,
    trim: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;