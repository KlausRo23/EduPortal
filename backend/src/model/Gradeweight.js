import mongoose from "mongoose";

const classStandingComponentSchema = new mongoose.Schema(
  {
    // e.g. "quiz", "activity", "assignment", "project", "recitation", "seatwork"
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // e.g. if classStandingWeight=80 and quiz weight=40,
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

    // Weight allocated to the exam component (out of 100 total)
    examWeight: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },

    // Weight allocated to class standing as a whole (out of 100 total)
    // Must satisfy: examWeight + classStandingWeight === 100
    classStandingWeight: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },

    // Flexible components that make up the class standing slice
    // Their individual weights must sum to 100 (percentage of the CS slice)
    classStandingComponents: {
      type: [classStandingComponentSchema],
      validate: {
        validator: function (components) {
          if (!components || components.length === 0) return false;
          const total = components.reduce((sum, c) => sum + c.weight, 0);
          return Math.round(total) === 100;
        },
        message:
          "classStandingComponents weights must sum to exactly 100. " +
          "They represent percentages of the class standing slice.",
      },
    },

    // Midterm vs Finals period weight split for the final grade
    // Default: Midterm 40% + Finals 60%
    midtermWeight: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
      default: 50,
    },

    finalsWeight: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
      default: 50,
    },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Compound index — one weight config per course per semester
// ---------------------------------------------------------------------------
gradeWeightSchema.index({ course: 1, semester: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// Validator: examWeight + classStandingWeight must equal 100
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Instance method: Returns a human-readable breakdown of the weight structure
//
// Usage: weightConfig.describe()
//
// Output example:
//   Exam: 20% of total
//   Class Standing: 80% of total
//     └─ quiz: 40% of CS → 32% of total grade
//     └─ activity: 30% of CS → 24% of total grade
//     └─ assignment: 30% of CS → 24% of total grade
// ---------------------------------------------------------------------------
gradeWeightSchema.methods.describe = function () {
  const lines = [
    `Exam: ${this.examWeight}% of total`,
    `Class Standing: ${this.classStandingWeight}% of total`,
  ];

  for (const c of this.classStandingComponents) {
    const effectiveWeight = ((c.weight / 100) * this.classStandingWeight).toFixed(1);
    lines.push(
      `  └─ ${c.name}: ${c.weight}% of CS → ${effectiveWeight}% of total grade`
    );
  }

  lines.push(`Period split: Midterm ${this.midtermWeight}% / Finals ${this.finalsWeight}%`);

  return lines.join("\n");
};

const GradeWeight = mongoose.model("GradeWeight", gradeWeightSchema);

export default GradeWeight;