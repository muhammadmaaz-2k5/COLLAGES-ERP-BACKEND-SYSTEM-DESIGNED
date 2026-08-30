// ============================================================================
// 👨‍🏫 APEX UNIVERSITY ERP — FACULTY CONTROLLER
// ============================================================================
// REST controller handling faculty dashboard, course rosters, attendance,
// coursework submissions, grading, and gradebook management.
// ============================================================================

const FacultyService = require("../services/facultyService");

class FacultyController {
  /**
   * GET /api/v1/faculty/dashboard
   * Consolidated faculty overview, active offerings, and teaching timetable
   */
  static async getDashboard(req, res, next) {
    try {
      const teacherId = req.user?.id;
      const data = await FacultyService.getFacultyDashboard(teacherId);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/faculty/courses/:offeringId/roster
   * Enrolled student roster with attendance percentage and current scores
   */
  static async getCourseRoster(req, res, next) {
    try {
      const { offeringId } = req.params;
      const data = await FacultyService.getCourseRoster(offeringId);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/faculty/attendance/mark
   * Bulk marks daily class attendance for course offering
   */
  static async markAttendance(req, res, next) {
    try {
      const { offeringId, date, sessionTopic, records } = req.body;

      if (!offeringId || !records || !Array.isArray(records)) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "offeringId and records array are required" },
        });
      }

      const result = await FacultyService.markAttendance({
        offeringId,
        date,
        sessionTopic,
        records,
        req,
      });

      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/faculty/assessments/assignments
   * Create coursework assignment with due date and maximum marks
   */
  static async createAssignment(req, res, next) {
    try {
      const { offeringId, title, description, dueDate, maxMarks, s3Key } = req.body;

      if (!offeringId || !title || !dueDate) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "offeringId, title, and dueDate are required" },
        });
      }

      const assignment = await FacultyService.createAssignment({
        offeringId,
        title,
        description,
        dueDate,
        maxMarks,
        s3Key,
        req,
      });

      return res.status(201).json({ success: true, data: assignment });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/faculty/assessments/assignments/:assignmentId/submissions
   * View student submissions for an assignment
   */
  static async getAssignmentSubmissions(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const data = await FacultyService.getAssignmentSubmissions(assignmentId);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/faculty/assessments/assignments/submissions/:submissionId/grade
   * Score student assignment with obtained marks and feedback
   */
  static async gradeSubmission(req, res, next) {
    try {
      const { submissionId } = req.params;
      const { obtainedMarks, feedback } = req.body;

      if (obtainedMarks === undefined) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "obtainedMarks is required" },
        });
      }

      const submission = await FacultyService.gradeSubmission({
        submissionId,
        obtainedMarks,
        feedback,
        req,
      });

      return res.status(200).json({ success: true, data: submission });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/faculty/assessments/quizzes
   * Create interactive timed quiz with question bank
   */
  static async createQuiz(req, res, next) {
    try {
      const { offeringId, title, durationMinutes, totalMarks, questions } = req.body;

      if (!offeringId || !title) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "offeringId and title are required" },
        });
      }

      const quiz = await FacultyService.createQuiz({
        offeringId,
        title,
        durationMinutes,
        totalMarks,
        questions,
        req,
      });

      return res.status(201).json({ success: true, data: quiz });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/faculty/grades/submit-marks
   * Bulk submit sessional and midterm marks for Exam Controller lock
   */
  static async submitSessionalMarks(req, res, next) {
    try {
      const { offeringId, marksData } = req.body;

      if (!offeringId || !marksData || !Array.isArray(marksData)) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "offeringId and marksData array are required" },
        });
      }

      const result = await FacultyService.submitSessionalMarks({
        offeringId,
        marksData,
        req,
      });

      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FacultyController;
