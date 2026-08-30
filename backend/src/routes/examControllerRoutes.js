// ============================================================================
// 📝 APEX UNIVERSITY ERP — EXAMINATION CONTROLLER ROUTES
// ============================================================================
// Route Mount: /api/v1/exam-controller
// Protection : authGuard + roleGuard(['EXAM_CONTROLLER', 'ADMIN', 'SUPER_ADMIN'])
// ============================================================================

const express = require("express");
const router = express.Router();
const ExamControllerController = require("../controllers/examControllerController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

// Require authentication for all exam controller endpoints
router.use(authGuard);

// Authorize exam controller and administrative personas
router.use(
  roleGuard([SystemRoles.EXAM_CONTROLLER, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN])
);

// ============================================================================
// 1. DASHBOARD & EXAM OVERVIEW
// ============================================================================
router.get("/dashboard", ExamControllerController.getDashboard);

// ============================================================================
// 2. DATESHEETS & SCHEDULE PUBLISHING
// ============================================================================
router.post("/datesheets", ExamControllerController.scheduleExamSlot);

// ============================================================================
// 3. GRADE APPROVAL & PERMANENT GRADE LOCK
// ============================================================================
router.post("/grades/:offeringId/lock-approve", ExamControllerController.lockAndApproveGrades);

module.exports = router;
