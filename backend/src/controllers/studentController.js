const StudentService = require("../services/studentService");

class StudentController {
  static async getDashboard(req, res, next) {
    try {
      const data = await StudentService.getDashboard(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getAvailableCourses(req, res, next) {
    try {
      const data = await StudentService.getAvailableCoursesForRegistration(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async registerCourse(req, res, next) {
    try {
      const { offeringId } = req.body;
      if (!offeringId) {
        return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "offeringId is required" } });
      }
      const data = await StudentService.registerCourse({
        studentId: req.user.id,
        offeringId,
        req,
      });
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(422).json({ success: false, error: { code: "PREREQUISITE_ERROR", message: err.message } });
    }
  }

  static async dropCourse(req, res, next) {
    try {
      const { enrollmentId } = req.params;
      const data = await StudentService.dropCourse({
        studentId: req.user.id,
        enrollmentId,
        req,
      });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getTranscript(req, res, next) {
    try {
      const data = await StudentService.getTranscript(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getAttendance(req, res, next) {
    try {
      const data = await StudentService.getAttendance(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getAssignments(req, res, next) {
    try {
      const data = await StudentService.getAssignments(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async submitAssignment(req, res, next) {
    try {
      const { id } = req.params;
      const { fileUrl, comments } = req.body;
      const data = await StudentService.submitAssignment({
        studentId: req.user.id,
        assignmentId: id,
        fileUrl,
        comments,
        req,
      });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getQuizzes(req, res, next) {
    try {
      const data = await StudentService.getQuizzes(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async attemptQuiz(req, res, next) {
    try {
      const { id } = req.params;
      const { answers } = req.body;
      const data = await StudentService.attemptQuiz({
        studentId: req.user.id,
        quizId: id,
        answers,
        req,
      });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getFeeChallans(req, res, next) {
    try {
      const data = await StudentService.getFeeChallans(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async payFeeChallan(req, res, next) {
    try {
      const { challanId, paymentMethod } = req.body;
      const data = await StudentService.payFeeChallan({
        studentId: req.user.id,
        challanId,
        paymentMethod,
        req,
      });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getExamSchedule(req, res, next) {
    try {
      const data = await StudentService.getExamSchedule(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getWeeklyTimetable(req, res, next) {
    try {
      const data = await StudentService.getWeeklyTimetable(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getAnnouncements(req, res, next) {
    try {
      const data = await StudentService.getAnnouncements();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StudentController;
