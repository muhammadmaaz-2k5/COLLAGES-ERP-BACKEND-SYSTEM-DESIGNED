// ============================================================================
// 🚌 APEX UNIVERSITY ERP — TRANSPORT FLEET ROUTES
// ============================================================================
// Route Mount: /api/v1/transport
// Protected: /overview, /routes, /vehicles, /passes, /passes/issue
// ============================================================================

const express = require("express");
const router = express.Router();
const TransportController = require("../controllers/transportController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

const transportAuth = [
  authGuard,
  roleGuard([SystemRoles.DRIVER, SystemRoles.STAFF, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
];

// Overview & KPIs
router.get("/overview", ...transportAuth, TransportController.getOverview);

// Routes & Stop Schedules
router.get("/routes", ...transportAuth, TransportController.getRoutes);
router.post("/routes", ...transportAuth, TransportController.addRoute);

// Fleet Vehicles
router.get("/vehicles", ...transportAuth, TransportController.getVehicles);

// Commuter Passes
router.get("/passes", ...transportAuth, TransportController.getPasses);
router.post("/passes/issue", ...transportAuth, TransportController.issuePass);

module.exports = router;
