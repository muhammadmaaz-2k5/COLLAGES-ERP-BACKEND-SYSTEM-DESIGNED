const express = require("express");
const router = express.Router();
const AcademicController = require("../controllers/academicController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

// Public / Authenticated Department & Scheme routes
router.get("/departments", authGuard, AcademicController.getDepartments);
router.get("/programs/:programId/curriculum", authGuard, AcademicController.getProgramCurriculum);

// Admin-only Batch Course Assignment
router.post(
  "/assign-semester-courses",
  authGuard,
  roleGuard([SystemRoles.SUPER_ADMIN, SystemRoles.ADMIN, SystemRoles.EXAM_CONTROLLER]),
  AcademicController.assignSemesterCourses
);

// Student Curricular View
router.get("/student/curriculum", authGuard, AcademicController.getStudentCurriculum);

module.exports = router;
