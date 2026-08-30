// ============================================================================
// 👨‍🏫 APEX UNIVERSITY ERP — FACULTY ROUTES
// ============================================================================
// Route Mount: /api/v1/faculty
// Protection : authGuard + roleGuard(['TEACHER', 'ADMIN', 'SUPER_ADMIN'])
// ============================================================================

const express = require("express");
const router = express.Router();
const FacultyController = require("../controllers/facultyController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

// Require authentication for all faculty endpoints
router.use(authGuard);

// Authorize faculty, admin, and super-admin personas
router.use(
  roleGuard([SystemRoles.TEACHER, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN, SystemRoles.EXAM_CONTROLLER])
);

// ============================================================================
// 1. DASHBOARD & TEACHING WORKLOAD
// ============================================================================
router.get("/dashboard", FacultyController.getDashboard);

// ============================================================================
// 2. COURSE ROSTER & ATTENDANCE MARKING
// ============================================================================
router.get("/courses/:offeringId/roster", FacultyController.getCourseRoster);
router.post("/attendance/mark", FacultyController.markAttendance);

// ============================================================================
// 3. COURSEWORK ASSIGNMENTS & SUBMISSION GRADING
// ============================================================================
router.post("/assessments/assignments", FacultyController.createAssignment);
router.get("/assessments/assignments/:assignmentId/submissions", FacultyController.getAssignmentSubmissions);
router.post("/assessments/assignments/submissions/:submissionId/grade", FacultyController.gradeSubmission);

// ============================================================================
// 4. TIMED QUIZ BUILDER
// ============================================================================
router.post("/assessments/quizzes", FacultyController.createQuiz);

// ============================================================================
// 5. GRADEBOOK & SESSIONAL MARKS SUBMISSION
// ============================================================================
router.post("/grades/submit-marks", FacultyController.submitSessionalMarks);

module.exports = router;
