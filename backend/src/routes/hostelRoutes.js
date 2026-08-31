// ============================================================================
// 🏢 APEX UNIVERSITY ERP — HOSTEL & RESIDENTIAL LIFE ROUTES
// ============================================================================
// Route Mount: /api/v1/hostels
// Protected: /overview, /buildings, /rooms, /allocations, /allocations/assign,
//            /requests, /requests/:id/review
// ============================================================================

const express = require("express");
const router = express.Router();
const HostelController = require("../controllers/hostelController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

const wardenAuth = [
  authGuard,
  roleGuard([SystemRoles.WARDEN, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
];

// Overview & KPIs
router.get("/overview", ...wardenAuth, HostelController.getOverview);

// Buildings & Room Matrix
router.get("/buildings", ...wardenAuth, HostelController.getBuildings);
router.get("/rooms", ...wardenAuth, HostelController.getRooms);

// Bed Allocation Contracts
router.get("/allocations", ...wardenAuth, HostelController.getAllocations);
router.post("/allocations/assign", ...wardenAuth, HostelController.assignBedAllocation);

// Room Change & Check-Out Clearance Requests
router.get("/requests", ...wardenAuth, HostelController.getRequests);
router.patch("/requests/:id/review", ...wardenAuth, HostelController.reviewRequest);

module.exports = router;
