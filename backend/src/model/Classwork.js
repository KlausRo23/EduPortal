import mongoose from "mongoose";

// This model is for teachers who post graded work for students in their course.
// The `period` field is critical — gradeService uses it to group SubmittedWork
// scores into midterm or finals when computing grades automatically.
const classworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    // classType must match a component name in GradeWeight.classStandingComponents
    // so gradeService can map scores to the correct grade category automatically.
    // "lesson" is excluded from grading — no SubmittedWork is created for it.
    classType: {
      type: String,
      enum: ["lesson", "quiz", "activity", "project", "assignment"],
      default: "lesson",
      required: true,
    },
    // Which grading period this classwork belongs to.
    // gradeService groups SubmittedWork scores by this field when computing grades.
    period: {
      type: String,
      enum: ["midterm", "finals"],
      required: true,
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    perfectScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    submittedWork: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubmittedWork",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    dueDate: {
      type: Date,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Setting",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

const Classwork = mongoose.model("Classwork", classworkSchema);

export default Classwork;