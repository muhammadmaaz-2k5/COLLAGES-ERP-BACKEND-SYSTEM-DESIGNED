// ============================================================================
// 💼 APEX UNIVERSITY ERP — PLACEMENT & RESEARCH ROUTES
// ============================================================================
// Route Mount: /api/v1/placements
// ============================================================================

const express = require("express");
const router = express.Router();
const PlacementController = require("../controllers/placementController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

const placementAuth = [
  authGuard,
  roleGuard([SystemRoles.STAFF, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN, SystemRoles.TEACHER, SystemRoles.STUDENT]),
];

// Placement & Research Overview
router.get("/overview", ...placementAuth, PlacementController.getOverview);

// Jobs Board
router.get("/jobs", ...placementAuth, PlacementController.getJobs);
router.post("/jobs", ...placementAuth, PlacementController.postJob);

// Student Applications
router.get("/applications", ...placementAuth, PlacementController.getApplications);
router.post("/applications/apply", ...placementAuth, PlacementController.applyForJob);

// Research Projects & Grants
router.get("/research/grants", ...placementAuth, PlacementController.getResearchGrants);
router.post("/research/grants", ...placementAuth, PlacementController.submitResearchGrant);

module.exports = router;
