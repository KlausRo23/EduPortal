import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    finalGrade: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    remarks: {
      type: String,
      enum: ["Passed", "Failed", "Incomplete"],
    },
  },
  {
    timestamps: true,
  }
);

const Grade = mongoose.model("Grades", gradeSchema)

export default Grade