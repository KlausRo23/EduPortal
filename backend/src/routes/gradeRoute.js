import express from "express";
import {
  submitGrade,
  syncGrade,
  manualOverride,
  viewStudentGrades,
  viewCourseGrades,
} from "../controllers/gradeController.js";
import { authenticate } from "../middleware/verifyToken.js";
import authorize from "../middleware/verifyRoles.js";


const router = express.Router();

// Submit exam scores → triggers full grade computation
router.post(
  "/",
  authenticate,
  authorize("teacher"),
  submitGrade
);

// Re-sync grade after a SubmittedWork score is updated
router.patch(
  "/:id/recompute",
  authenticate,
  authorize("teacher"),
  syncGrade
);

// Manual override for special cases (Incomplete, Dropped, etc.)
router.patch(
  "/:id/override",
  authenticate,
  authorize("admin"),
  manualOverride
);

// Student grade card — filtered by semester via query param
router.get(
  "/student/:studentId",
  authenticate,
  authorize("student", "teacher", "admin"),
  viewStudentGrades
);

// Full class grade sheet — filtered by semester via query param
router.get(
  "/course/:courseId",
  authenticate,
  authorize("teacher", "admin"),
  viewCourseGrades
);

export default router;