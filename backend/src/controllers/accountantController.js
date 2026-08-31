// ============================================================================
// 💳 APEX UNIVERSITY ERP — FINANCE & ACCOUNTANT CONTROLLER
// ============================================================================
// REST controller for billing, fee structures, batch challans,
// bank reconciliation scrolls, and double-entry General Ledger.
// ============================================================================

const FinanceService = require("../services/financeService");

class AccountantController {
  /**
   * GET /api/v1/finance/overview
   * Financial KPIs, collection rates, and recent transactions
   */
  static async getOverview(req, res, next) {
    try {
      const data = await FinanceService.getFinancialOverview();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/finance/fee-structures
   * Lists active fee structure templates
   */
  static async getFeeStructures(req, res, next) {
    try {
      const data = await FinanceService.getFeeStructures();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/finance/fee-structures
   * Creates a new program fee structure template
   */
  static async createFeeStructure(req, res, next) {
    try {
      const data = await FinanceService.createFeeStructure(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/finance/challans/generate-batch
   * Generates semester fee challans in bulk
   */
  static async generateBatchChallans(req, res, next) {
    try {
      const { programCode, semesterNo, dueDate } = req.body;
      const data = await FinanceService.generateBatchChallans({ programCode, semesterNo, dueDate }, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/finance/payments/reconcile-bank
   * Reconciles bank deposit scroll transactions
   */
  static async reconcileBankScroll(req, res, next) {
    try {
      const { transactions } = req.body;
      if (!transactions || !Array.isArray(transactions)) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "transactions array is required" },
        });
      }

      const data = await FinanceService.reconcileBankScroll(transactions, req);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/finance/general-ledger
   * Chart of accounts and double-entry trial balance
   */
  static async getGeneralLedger(req, res, next) {
    try {
      const data = await FinanceService.getGeneralLedger();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AccountantController;
