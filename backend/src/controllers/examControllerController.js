// ============================================================================
// 📝 APEX UNIVERSITY ERP — EXAMINATION CONTROLLER CONTROLLER
// ============================================================================
// REST controller for examination controller operations
// ============================================================================

const ExamControllerService = require("../services/examControllerService");

class ExamControllerController {
  /**
   * GET /api/v1/exam-controller/dashboard
   * Consolidated overview of exam terms, scheduled papers, and grade submissions
   */
  static async getDashboard(req, res, next) {
    try {
      const data = await ExamControllerService.getDashboard();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/exam-controller/datesheets
   * Schedule exam paper slot
   */
  static async scheduleExamSlot(req, res, next) {
    try {
      const { termName, courseCode, courseTitle, examDate, startTime, endTime, room } = req.body;

      if (!courseCode || !examDate || !startTime || !endTime || !room) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "All schedule parameters are required" },
        });
      }

      const slot = await ExamControllerService.scheduleExamSlot({
        termName,
        courseCode,
        courseTitle,
        examDate,
        startTime,
        endTime,
        room,
        req,
      });

      return res.status(201).json({ success: true, data: slot });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/exam-controller/grades/:offeringId/lock-approve
   * Officially locks and publishes course section grades
   */
  static async lockAndApproveGrades(req, res, next) {
    try {
      const { offeringId } = req.params;
      const result = await ExamControllerService.lockAndApproveGrades({ offeringId, req });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExamControllerController;
