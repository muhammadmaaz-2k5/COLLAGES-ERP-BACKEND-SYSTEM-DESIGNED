// ============================================================================
// 📋 APEX UNIVERSITY ERP — ADMISSIONS ROUTES
// ============================================================================
// Route Mount: /api/v1/admissions
// Public   : /apply, /applications/:trackingId, /programs
// Protected: /admin/applications, /admin/applications/:id/status
// ============================================================================

const express = require("express");
const router = express.Router();
const AdmissionsController = require("../controllers/admissionsController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

// ============================================================================
// 1. PUBLIC APPLICANT ENDPOINTS
// ============================================================================

// Submit new online application
router.post("/apply", AdmissionsController.submitApplication);

// Track application status
router.get("/applications/:trackingId", AdmissionsController.trackApplication);

// List degree programs & criteria
router.get("/programs", AdmissionsController.getDegreePrograms);

// Public merit lists
router.get("/merit-lists/public", AdmissionsController.getPublicMeritLists);

// ============================================================================
// 2. PROTECTED ADMISSIONS OFFICER WORKSTATION ENDPOINTS
// ============================================================================

// Review applications list
router.get(
  "/admin/applications",
  authGuard,
  roleGuard([SystemRoles.ADMISSIONS_OFFICER, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
  AdmissionsController.getAdminApplications
);

// Update application status / assign test slot
router.patch(
  "/admin/applications/:id/status",
  authGuard,
  roleGuard([SystemRoles.ADMISSIONS_OFFICER, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
  AdmissionsController.updateApplicationStatus
);

// Record entrance test scores
router.post(
  "/tests/scores",
  authGuard,
  roleGuard([SystemRoles.ADMISSIONS_OFFICER, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
  AdmissionsController.recordTestScores
);

// Generate automated merit list
router.post(
  "/merit-lists/generate",
  authGuard,
  roleGuard([SystemRoles.ADMISSIONS_OFFICER, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
  AdmissionsController.generateMeritList
);


module.exports = router;
