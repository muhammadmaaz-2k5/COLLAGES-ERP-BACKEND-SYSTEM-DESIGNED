// ============================================================================
// 📈 APEX UNIVERSITY ERP — BI REPORTING CONTROLLER
// ============================================================================
// REST controller for executive KPIs, department analytics, and custom query builder.
// ============================================================================

const BIReportingService = require("../services/biReportingService");

class BIReportingController {
  /**
   * GET /api/v1/reporting/executive-kpis
   * University executive KPIs and retention trends
   */
  static async getExecutiveKPIs(req, res, next) {
    try {
      const data = await BIReportingService.getExecutiveKPIs();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/reporting/department-trends
   * Departmental GPA and faculty-to-student ratios
   */
  static async getDepartmentTrends(req, res, next) {
    try {
      const data = await BIReportingService.getDepartmentTrends();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/reporting/financial-breakdown
   * Revenue quarter trends and stream breakdowns
   */
  static async getFinancialBreakdown(req, res, next) {
    try {
      const data = await BIReportingService.getFinancialBreakdown();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/reporting/custom-query
   * Executes a custom dynamic projection query
   */
  static async executeCustomQuery(req, res, next) {
    try {
      const data = await BIReportingService.executeCustomQuery(req.body, req);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/reporting/saved-templates
   * Pre-built accreditation and audit templates
   */
  static async getSavedTemplates(req, res, next) {
    try {
      const data = await BIReportingService.getSavedTemplates();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BIReportingController;
