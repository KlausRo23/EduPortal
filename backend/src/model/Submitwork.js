import mongoose from "mongoose";

// This model tracks the submitted works of the student.
// The "Absent" status is set automatically by attendanceService
// when a student is marked absent on the classwork's due date.
const submittedWorkSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    classwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classwork",
      required: true,
    },

    contents: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    attachments: [
      {
        type: String,
        trim: true,
      },
    ],

    score: {
      type: Number,
      min: 0,
      default: 0,
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      // "Absent" — auto-set by attendanceService when student was absent on due date
      // "Pending" — restored by attendanceService if absence is corrected
      enum: ["Pending", "Submitted", "Graded", "Late", "Absent"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index — one submission per student per classwork
submittedWorkSchema.index(
  { submittedBy: 1, classwork: 1 },
  { unique: true }
);

const SubmittedWork = mongoose.model("SubmittedWork", submittedWorkSchema);

export default SubmittedWork;