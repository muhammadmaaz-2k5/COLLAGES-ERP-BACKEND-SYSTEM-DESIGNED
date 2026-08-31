// ============================================================================
// 💼 APEX UNIVERSITY ERP — PLACEMENT & RESEARCH CONTROLLER
// ============================================================================
// REST controller for campus recruitment, job applications, and research grants.
// ============================================================================

const PlacementService = require("../services/placementService");

class PlacementController {
  /**
   * GET /api/v1/placements/overview
   * Placement & research KPIs
   */
  static async getOverview(req, res, next) {
    try {
      const data = await PlacementService.getOverview();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/placements/jobs
   * Campus recruitment job openings
   */
  static async getJobs(req, res, next) {
    try {
      const { department, jobType, search } = req.query;
      const data = await PlacementService.getJobs({ department, jobType, search });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/placements/jobs
   * Post new recruitment job
   */
  static async postJob(req, res, next) {
    try {
      const { companyName, jobTitle } = req.body;
      if (!companyName || !jobTitle) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "companyName and jobTitle are required" },
        });
      }

      const data = await PlacementService.postJob(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/placements/applications
   * Student job applications
   */
  static async getApplications(req, res, next) {
    try {
      const { jobId, status } = req.query;
      const data = await PlacementService.getApplications({ jobId, status });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/placements/applications/apply
   * Apply for a job vacancy
   */
  static async applyForJob(req, res, next) {
    try {
      const { jobId, studentRollNo, studentCGPA } = req.body;
      if (!jobId || !studentRollNo) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "jobId and studentRollNo are required" },
        });
      }

      const data = await PlacementService.applyForJob(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/placements/research/grants
   * Faculty research grants & DOI papers
   */
  static async getResearchGrants(req, res, next) {
    try {
      const data = await PlacementService.getResearchGrants();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/placements/research/grants
   * Submit research proposal
   */
  static async submitResearchGrant(req, res, next) {
    try {
      const { projectTitle, principalInvestigator } = req.body;
      if (!projectTitle || !principalInvestigator) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "projectTitle and principalInvestigator are required" },
        });
      }

      const data = await PlacementService.submitResearchGrant(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PlacementController;
