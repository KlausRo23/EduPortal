import Attendance from "../models/Attendance.js";
import Classwork from "../models/Classwork.js";
import SubmittedWork from "../models/Submitwork.js";
import { buildSummary, isAbsent } from "../utils/attendanceUtils.js";

export async function recordAttendance(data) {
  const attendance = await new Attendance(data).save();

  let zeroedWorks = [];

  if (isAbsent(data.status)) {
    zeroedWorks = await zeroOutWorksByDate({
      studentId: data.student,
      courseId:  data.course,
      date:      data.date,
    });
  }

  return { attendance, zeroedWorks };
}

export async function updateAttendance(attendanceId, updates) {
  const existing = await Attendance.findById(attendanceId);
  if (!existing) throw new Error("Attendance record not found.");

  const wasAbsent = isAbsent(existing.status);
  const nowAbsent = isAbsent(updates.status);

  const attendance = await Attendance.findByIdAndUpdate(
    attendanceId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  let zeroedWorks    = [];
  let restoredWorks  = [];

  // Case 1: Newly marked as Absent → zero out works
  if (!wasAbsent && nowAbsent) {
    zeroedWorks = await zeroOutWorksByDate({
      studentId: existing.student,
      courseId:  existing.course,
      date:      existing.date,
    });
  }

  // Case 2: Absence corrected → restore works back to Pending so teacher can re-grade
  if (wasAbsent && !nowAbsent) {
    restoredWorks = await restoreWorksByDate({
      studentId: existing.student,
      courseId:  existing.course,
      date:      existing.date,
    });
  }

  return { attendance, zeroedWorks, restoredWorks };
}

// ---------------------------------------------------------------------------
// getSummary
//
// Returns a grouped attendance summary for a student in a course + semester.
//
// Called by: attendanceController (student/teacher dashboard)
//
// @param {string} studentId
// @param {string} courseId
// @param {string} semesterId
// @returns {Object}  - { midterm: {...}, finals: {...} }
// ---------------------------------------------------------------------------
export async function getSummary(studentId, courseId, semesterId) {
  const records = await Attendance.find({
    student:  studentId,
    course:   courseId,
    semester: semesterId,
  });

  return buildSummary(records);
}

// ---------------------------------------------------------------------------
// PRIVATE: zeroOutWorksByDate
//
// Finds all classworks in a course with a dueDate matching the absence date,
// then sets the student's SubmittedWork for each to score: 0, status: "Absent".
// Creates a SubmittedWork record if one doesn't exist yet.
//
// @param {Object} { studentId, courseId, date }
// @returns {Array} - The updated/created SubmittedWork documents
// ---------------------------------------------------------------------------
async function zeroOutWorksByDate({ studentId, courseId, date }) {
  // Normalize to match the full day (ignore time component)
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Find all classworks in this course due on the absent date
  // Excludes "lesson" type since lessons have no scored submission
  const classworks = await Classwork.find({
    course:  courseId,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
    classType: { $ne: "lesson" },
  });

  if (classworks.length === 0) return [];

  const results = [];

  for (const classwork of classworks) {
    // Upsert: update existing or create new with score 0 and status "Absent"
    const updated = await SubmittedWork.findOneAndUpdate(
      { submittedBy: studentId, classwork: classwork._id },
      {
        $set: {
          score:    0,
          status:   "Absent",
          feedback: "Automatically zeroed — student was absent on this date.",
        },
        // Only set these fields on insert (don't overwrite existing content/attachments)
        $setOnInsert: {
          submittedBy: studentId,
          classwork:   classwork._id,
          contents:    "",
          attachments: [],
        },
      },
      { upsert: true, new: true }
    );

    results.push(updated);
  }

  return results;
}

// ---------------------------------------------------------------------------
// PRIVATE: restoreWorksByDate
//
// When an absence is corrected, sets all zeroed SubmittedWork records for
// that date back to status: "Pending" so the teacher can re-grade them.
// Does NOT restore the score — teacher handles that manually.
//
// @param {Object} { studentId, courseId, date }
// @returns {Array} - The restored SubmittedWork documents
// ---------------------------------------------------------------------------
async function restoreWorksByDate({ studentId, courseId, date }) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const classworks = await Classwork.find({
    course:  courseId,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
    classType: { $ne: "lesson" },
  });

  if (classworks.length === 0) return [];

  const classworkIds = classworks.map((c) => c._id);

  // Only restore records that were auto-zeroed by the absence system
  await SubmittedWork.updateMany(
    {
      submittedBy: studentId,
      classwork:   { $in: classworkIds },
      status:      "Absent",
    },
    {
      $set: {
        status:   "Pending",
        feedback: "Absence corrected — please re-grade this work.",
      },
    }
  );

  // Return the updated docs for the controller response
  return await SubmittedWork.find({
    submittedBy: studentId,
    classwork:   { $in: classworkIds },
  });
}