import mongoose from "mongoose";

/**
 * GradeWeight Model — EduPortal
 *
 * Pure schema only. Validation logic lives here as pre-save hooks
*/

const classStandingComponentSchema = new mongoose.Schema(
  {
    // Must match a Classwork.classType value (e.g. "quiz", "activity", "assignment")
    // This is how gradeService maps submitted scores → grade components automatically
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Percentage of the class standing slice (not of the total grade)
    // e.g. weight: 40 means 40% of classStandingWeight
    weight: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
  },
  { _id: false }
);

const gradeWeightSchema = new mongoose.Schema(
  {
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Weight of the exam out of total 100
    examWeight: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },

    // Weight of class standing out of total 100
    // Must satisfy: examWeight + classStandingWeight === 100
    classStandingWeight: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },

    // Flexible sub-components of class standing
    // Their weights must sum to 100 (as percentages of the CS slice)
    classStandingComponents: {
      type: [classStandingComponentSchema],
      validate: {
        validator(components) {
          if (!components || components.length === 0) return false;
          const total = components.reduce((sum, c) => sum + c.weight, 0);
          return Math.round(total) === 100;
        },
        message:
          "classStandingComponents weights must sum to 100 — they are percentages of the class standing slice.",
      },
    },

    // How midterm and finals are weighted toward the final grade
    // Default: Midterm 40% + Finals 60%
    midtermWeight: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
      default: 40,
    },
    finalsWeight: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
      default: 60,
    },
  },
  { timestamps: true }
);

// One weight config per course per semester
gradeWeightSchema.index({ course: 1, semester: 1 }, { unique: true });

// Schema-level constraint: weights must add up correctly
gradeWeightSchema.pre("save", function (next) {
  if (this.examWeight + this.classStandingWeight !== 100) {
    return next(
      new Error(
        `examWeight (${this.examWeight}) + classStandingWeight (${this.classStandingWeight}) must equal 100.`
      )
    );
  }
  if (this.midtermWeight + this.finalsWeight !== 100) {
    return next(
      new Error(
        `midtermWeight (${this.midtermWeight}) + finalsWeight (${this.finalsWeight}) must equal 100.`
      )
    );
  }
  next();
});

const GradeWeight = mongoose.model("GradeWeight", gradeWeightSchema);

export default GradeWeight;