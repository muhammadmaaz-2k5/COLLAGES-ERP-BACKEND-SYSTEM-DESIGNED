// ============================================================================
// 💳 APEX UNIVERSITY ERP — FINANCE & ACCOUNTANT ROUTES
// ============================================================================
// Route Mount: /api/v1/finance
// Protected: /overview, /fee-structures, /challans/generate-batch,
//            /payments/reconcile-bank, /general-ledger
// ============================================================================

const express = require("express");
const router = express.Router();
const AccountantController = require("../controllers/accountantController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

const accountantAuth = [
  authGuard,
  roleGuard([SystemRoles.ACCOUNTANT, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
];

// Financial Overview & KPIs
router.get("/overview", ...accountantAuth, AccountantController.getOverview);

// Fee Structure Templates
router.get("/fee-structures", ...accountantAuth, AccountantController.getFeeStructures);
router.post("/fee-structures", ...accountantAuth, AccountantController.createFeeStructure);

// Batch Challan Generation
router.post("/challans/generate-batch", ...accountantAuth, AccountantController.generateBatchChallans);

// Bank Scroll Reconciliation
router.post("/payments/reconcile-bank", ...accountantAuth, AccountantController.reconcileBankScroll);

// Double-Entry General Ledger & Trial Balance
router.get("/general-ledger", ...accountantAuth, AccountantController.getGeneralLedger);

module.exports = router;
