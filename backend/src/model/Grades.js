import mongoose from "mongoose";

/**
 * Grades Model — EduPortal
 *
 * Pure schema only. All business logic lives in:
 *   - utils/gradeUtils.js      → pure computation (no DB)
 *   - services/gradeService.js → DB queries + orchestration
 *
 * Grade structure:
 *   Total (100%) = Exam % + Class Standing %
 *   Class Standing = flexible components (quiz, activity, etc.)
 *   Final Grade   = Midterm % + Finals %
 *   Weights defined per course in GradeWeight model.
 */

const componentScoreSchema = new mongoose.Schema(
  {
    // Matches a component name in GradeWeight.classStandingComponents
    // e.g. "quiz", "activity", "assignment", "project", "recitation"
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { _id: false }
);

const periodGradesSchema = new mongoose.Schema(
  {
    examScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // Scores per class standing component
    // Absent students already have score: 0 here (set by attendanceService)
    classStandingScores: {
      type: [componentScoreSchema],
      default: [],
    },
    // Computed and written by gradeService — do not set manually
    periodGrade: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
  },
  { _id: false }
);

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
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Setting",
      required: true,
    },
    gradeWeight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GradeWeight",
      required: true,
    },
    midterm: {
      type: periodGradesSchema,
      default: () => ({}),
    },
    finals: {
      type: periodGradesSchema,
      default: () => ({}),
    },
    // Written by gradeService after computation
    finalGrade: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    // Philippine GPA scale 1.0–5.0, written by gradeService
    gradePoint: {
      type: Number,
      enum: [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 5.0],
      default: null,
    },
    remarks: {
      type: String,
      enum: ["Passed", "Failed", "Incomplete", "Dropped", "No Grade"],
      default: "No Grade",
    },
    // Set to true to disable auto-computation — teacher/admin handles grade manually
    isManualOverride: {
      type: Boolean,
      default: false,
    },
    overrideReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    encodedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// One grade record per student per course per semester
gradeSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;