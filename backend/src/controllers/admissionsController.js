// ============================================================================
// 📋 APEX UNIVERSITY ERP — ADMISSIONS CONTROLLER
// ============================================================================
// REST controller for public admissions intake, tracking, and officer desks
// ============================================================================

const AdmissionsService = require("../services/admissionsService");
const MeritRankingService = require("../services/meritRankingService");

class AdmissionsController {
  /**
   * POST /api/v1/admissions/apply
   * Public endpoint to submit an online admission application
   */
  static async submitApplication(req, res, next) {
    try {
      const { fullName, email, phone, cnic, programId, matricMarks, interMarks } = req.body;

      if (!fullName || !email || !phone || !cnic) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "Full Name, Email, Phone, and CNIC are required" },
        });
      }

      const application = await AdmissionsService.submitApplication(req.body, req);
      return res.status(201).json({ success: true, data: application });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admissions/applications/:trackingId
   * Public endpoint to track an application status
   */
  static async trackApplication(req, res, next) {
    try {
      const { trackingId } = req.params;
      const data = await AdmissionsService.trackApplication(trackingId);

      if (!data) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: `Application '${trackingId}' not found. Please check your Tracking ID or CNIC.` },
        });
      }

      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admissions/admin/applications
   * Protected endpoint for Admissions Officers to review applications
   */
  static async getAdminApplications(req, res, next) {
    try {
      const { status, programId, search } = req.query;
      const data = await AdmissionsService.getAdminApplications({ status, programId, search });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/admissions/admin/applications/:id/status
   * Protected endpoint to transition an application stage
   */
  static async updateApplicationStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, remarks, testDate, testVenue } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "status is required" },
        });
      }

      const updated = await AdmissionsService.updateApplicationStatus(id, { status, remarks, testDate, testVenue }, req);
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admissions/programs
   * Public endpoint to list available degree programs
   */
  static async getDegreePrograms(req, res, next) {
    try {
      const programs = await AdmissionsService.getDegreePrograms();
      return res.status(200).json({ success: true, data: programs });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admissions/tests/scores
   * Bulk record or upload entrance test scores
   */
  static async recordTestScores(req, res, next) {
    try {
      const { scores } = req.body;
      if (!scores || !Array.isArray(scores)) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "scores array is required" },
        });
      }

      const result = await MeritRankingService.recordTestScores(scores, req);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admissions/merit-lists/generate
   * Generates ranked merit list for a degree program
   */
  static async generateMeritList(req, res, next) {
    try {
      const { programId, listRound, seatCapacity } = req.body;
      if (!programId) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "programId is required" },
        });
      }

      const meritList = await MeritRankingService.generateMeritList({ programId, listRound, seatCapacity, req });
      return res.status(201).json({ success: true, data: meritList });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admissions/merit-lists/public
   * Public endpoint to retrieve published merit lists
   */
  static async getPublicMeritLists(req, res, next) {
    try {
      const { programId } = req.query;
      const lists = await MeritRankingService.getPublicMeritLists(programId);
      return res.status(200).json({ success: true, data: lists });
    } catch (err) {
      next(err);
    }
  }
}


module.exports = AdmissionsController;
