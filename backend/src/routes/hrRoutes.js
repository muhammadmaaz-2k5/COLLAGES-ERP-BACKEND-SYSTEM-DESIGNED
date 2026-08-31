// ============================================================================
// 👔 APEX UNIVERSITY ERP — HR & WORKFORCE ROUTES
// ============================================================================
// Route Mount: /api/v1/hr
// Protected: /overview, /employees, /leaves, /payroll/generate-slips, /payroll/slips
// ============================================================================

const express = require("express");
const router = express.Router();
const HRController = require("../controllers/hrController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

const hrAuth = [
  authGuard,
  roleGuard([SystemRoles.HR_MANAGER, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
];

// Workforce Analytics Overview
router.get("/overview", ...hrAuth, HRController.getOverview);

// Employee Master Directory & Onboarding
router.get("/employees", ...hrAuth, HRController.getEmployees);
router.post("/employees", ...hrAuth, HRController.onboardEmployee);

// Leave Requests & Review Desk
router.get("/leaves", ...hrAuth, HRController.getLeaves);
router.patch("/leaves/:id/review", ...hrAuth, HRController.reviewLeave);

// Monthly Payroll & Salary Slips
router.post("/payroll/generate-slips", ...hrAuth, HRController.generatePayroll);
router.get("/payroll/slips", ...hrAuth, HRController.getSalarySlips);

module.exports = router;
