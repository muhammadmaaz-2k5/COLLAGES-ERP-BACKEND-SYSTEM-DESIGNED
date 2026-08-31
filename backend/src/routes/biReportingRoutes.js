// ============================================================================
// 📈 APEX UNIVERSITY ERP — BI REPORTING ROUTES
// ============================================================================
// Route Mount: /api/v1/reporting
// Protected: /executive-kpis, /department-trends, /financial-breakdown,
//            /custom-query, /saved-templates
// ============================================================================

const express = require("express");
const router = express.Router();
const BIReportingController = require("../controllers/biReportingController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

const executiveAuth = [
  authGuard,
  roleGuard([SystemRoles.SUPER_ADMIN, SystemRoles.ADMIN, SystemRoles.EXAM_CONTROLLER]),
];

// Institutional KPIs & Trends
router.get("/executive-kpis", ...executiveAuth, BIReportingController.getExecutiveKPIs);
router.get("/department-trends", ...executiveAuth, BIReportingController.getDepartmentTrends);
router.get("/financial-breakdown", ...executiveAuth, BIReportingController.getFinancialBreakdown);

// Custom Query Builder
router.post("/custom-query", ...executiveAuth, BIReportingController.executeCustomQuery);

// Pre-Built Accreditation Templates
router.get("/saved-templates", ...executiveAuth, BIReportingController.getSavedTemplates);

module.exports = router;
