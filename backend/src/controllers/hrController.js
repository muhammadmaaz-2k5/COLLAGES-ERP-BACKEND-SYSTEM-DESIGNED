// ============================================================================
// 👔 APEX UNIVERSITY ERP — HR & WORKFORCE CONTROLLER
// ============================================================================
// REST controller for employee directory, leave management, and monthly payroll.
// ============================================================================

const HRService = require("../services/hrService");

class HRController {
  /**
   * GET /api/v1/hr/overview
   * Workforce metrics, faculty/staff distribution, and leave requests
   */
  static async getOverview(req, res, next) {
    try {
      const data = await HRService.getWorkforceOverview();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/hr/employees
   * Employee directory with type and department filtering
   */
  static async getEmployees(req, res, next) {
    try {
      const { type, department, search } = req.query;
      const data = await HRService.getEmployees({ type, department, search });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/hr/employees
   * Onboards a new employee into the unified spine
   */
  static async onboardEmployee(req, res, next) {
    try {
      const { fullName, email, phone, cnic, type, department, designation, basicSalary } = req.body;
      if (!fullName || !email || !cnic) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "Full Name, Email, and CNIC are required" },
        });
      }

      const data = await HRService.onboardEmployee(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/hr/leaves
   * Retrieves leave applications queue
   */
  static async getLeaves(req, res, next) {
    try {
      const { status } = req.query;
      const data = await HRService.getLeaveApplications({ status });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/hr/leaves/:id/review
   * Approves or rejects an employee leave request
   */
  static async reviewLeave(req, res, next) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "status is required" },
        });
      }

      const data = await HRService.reviewLeave(id, { status, remarks }, req);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/hr/payroll/generate-slips
   * Runs monthly payroll calculation and generates salary slips
   */
  static async generatePayroll(req, res, next) {
    try {
      const { monthYear } = req.body;
      const data = await HRService.generateMonthlyPayroll({ monthYear }, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/hr/payroll/slips
   * Retrieves generated monthly salary slips
   */
  static async getSalarySlips(req, res, next) {
    try {
      const { monthYear } = req.query;
      const data = await HRService.getSalarySlips(monthYear);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = HRController;
