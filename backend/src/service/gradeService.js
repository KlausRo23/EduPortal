import Grade from "../models/Grades.js";
import GradeWeight from "../models/GradeWeight.js";
import Classwork from "../models/Classwork.js";
import SubmittedWork from "../models/Submitwork.js";
import {
  computePeriodGrade,
  computeFinalGrade,
  toGradePoint,
  deriveRemarks,
} from "../utils/gradeUtils.js";

// Pulls all graded SubmittedWork for a student in a course + semester,
// groups them by Classwork.classType and period, and returns the average
// score per category per period.
// This is what makes grade recording automatic — scores flow from
// SubmittedWork up into the Grade without the teacher manually entering them.

async function aggregateScoresByPeriod(studentId, courseId, semesterId) {
  // Fetch all classworks for this course + semester (excluding lessons — not graded)
  const classworks = await Classwork.find({
    course:     courseId,
    semester:   semesterId,
    classType:  { $ne: "lesson" },
  }).lean();

  if (classworks.length === 0) {
    return { midterm: [], finals: [] };
  }

  const classworkIds = classworks.map((c) => c._id);

  // Map classworkId → { classType, period } for quick lookup
  const classworkMap = {};
  for (const cw of classworks) {
    classworkMap[cw._id.toString()] = {
      classType: cw.classType,
      period:    cw.period, // "midterm" | "finals" — teacher sets this on the classwork
    };
  }

  // Fetch all submitted + graded work for this student in those classworks
  const submissions = await SubmittedWork.find({
    submittedBy: studentId,
    classwork:   { $in: classworkIds },
    status:      { $in: ["Graded", "Absent"] }, // Absent = 0, still counts
  }).lean();

  // Group scores by period → classType
  // Structure: { midterm: { quiz: [85, 90], activity: [78] }, finals: { ... } }
  const grouped = { midterm: {}, finals: {} };

  for (const submission of submissions) {
    const meta = classworkMap[submission.classwork.toString()];
    if (!meta) continue;

    const { classType, period } = meta;
    if (!grouped[period]) continue;

    if (!grouped[period][classType]) {
      grouped[period][classType] = [];
    }

    grouped[period][classType].push(submission.score);
  }

  // Average the scores per category per period
  const result = { midterm: [], finals: [] };

  for (const period of ["midterm", "finals"]) {
    for (const [name, scores] of Object.entries(grouped[period])) {
      const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      result[period].push({
        name,
        score: parseFloat(average.toFixed(2)),
      });
    }
  }

  return result;
}

// computeAndSaveGrade
// Automatically pulls scores from SubmittedWork, aggregates them by category,
// then computes and saves the full grade.
//
// Teacher only needs to provide: student, course, semester, gradeWeight,
// examScore (midterm + finals), and encodedBy.
// All classStandingScores are auto-populated from SubmittedWork.
//

export async function computeAndSaveGrade(gradeData) {
  const weightConfig = await GradeWeight.findById(gradeData.gradeWeight).lean();
  if (!weightConfig) {
    throw new Error("GradeWeight config not found for this course and semester.");
  }

  // Auto-aggregate class standing scores from SubmittedWork
  const aggregated = await aggregateScoresByPeriod(
    gradeData.student,
    gradeData.course,
    gradeData.semester
  );

  // Merge aggregated scores with incoming data (exam scores provided by teacher)
  const midterm = {
    examScore:            gradeData.midterm?.examScore ?? 0,
    classStandingScores:  aggregated.midterm,
  };
  const finals = {
    examScore:            gradeData.finals?.examScore ?? 0,
    classStandingScores:  aggregated.finals,
  };

  // Compute grades using pure utils
  midterm.periodGrade = computePeriodGrade(midterm, weightConfig);
  finals.periodGrade  = computePeriodGrade(finals, weightConfig);

  const finalGrade = computeFinalGrade(
    midterm.periodGrade,
    finals.periodGrade,
    weightConfig
  );

  const grade = new Grade({
    ...gradeData,
    midterm,
    finals,
    finalGrade,
    gradePoint: toGradePoint(finalGrade),
    remarks:    deriveRemarks(finalGrade),
  });

  return await grade.save();
}

// recomputeGrade
//
// Re-runs the full aggregation + computation on an existing grade record.
// Called when a teacher updates a SubmittedWork score after initial grading,
// or when a new classwork is added and scored.

export async function recomputeGrade(gradeId) {
  const grade = await Grade.findById(gradeId);
  if (!grade) throw new Error("Grade record not found.");
  if (grade.isManualOverride) return grade; // Don't touch overridden grades

  const weightConfig = await GradeWeight.findById(grade.gradeWeight).lean();
  if (!weightConfig) {
    throw new Error("GradeWeight config not found.");
  }

  const aggregated = await aggregateScoresByPeriod(
    grade.student,
    grade.course,
    grade.semester
  );

  // Preserve existing exam scores, refresh class standing scores
  grade.midterm.classStandingScores = aggregated.midterm;
  grade.finals.classStandingScores  = aggregated.finals;

  grade.midterm.periodGrade = computePeriodGrade(grade.midterm, weightConfig);
  grade.finals.periodGrade  = computePeriodGrade(grade.finals, weightConfig);

  grade.finalGrade = computeFinalGrade(
    grade.midterm.periodGrade,
    grade.finals.periodGrade,
    weightConfig
  );
  grade.gradePoint = toGradePoint(grade.finalGrade);
  grade.remarks    = deriveRemarks(grade.finalGrade);

  return await grade.save();
}

// overrideGrade
//
// Manually sets a grade, bypassing all computation.
// Used for special cases: Incomplete, Dropped, admin correction, etc.
//
// Called by: gradeController (admin or teacher override)

export async function overrideGrade(gradeId, override) {
  const grade = await Grade.findById(gradeId);
  if (!grade) throw new Error("Grade record not found.");

  grade.isManualOverride = true;
  grade.finalGrade       = override.finalGrade     ?? grade.finalGrade;
  grade.gradePoint       = override.gradePoint     ?? grade.gradePoint;
  grade.remarks          = override.remarks         ?? grade.remarks;
  grade.overrideReason   = override.overrideReason;

  return await grade.save();
}

export async function getStudentGrades(studentId, semesterId) {
  return await Grade.find({ student: studentId, semester: semesterId })
    .populate("course", "courseName courseCode")
    .lean();
}


export async function getCourseGrades(courseId, semesterId) {
  return await Grade.find({ course: courseId, semester: semesterId })
    .populate("student", "studentId")
    .lean();
}