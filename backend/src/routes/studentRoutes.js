const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/studentController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");

// All student routes require valid student or admin authentication
router.use(authGuard);

// 1. Dashboard
router.get("/dashboard", StudentController.getDashboard);

// 2. Course Registration & Prerequisite DAG
router.get("/courses/available", StudentController.getAvailableCourses);
router.post("/courses/register", StudentController.registerCourse);
router.delete("/courses/enrollments/:enrollmentId", StudentController.dropCourse);

// 3. Transcript
router.get("/transcript", StudentController.getTranscript);

// 4. Attendance
router.get("/attendance", StudentController.getAttendance);

// 5. LMS Assignments & Quizzes
router.get("/lms/assignments", StudentController.getAssignments);
router.post("/lms/assignments/:id/submit", StudentController.submitAssignment);
router.get("/lms/quizzes", StudentController.getQuizzes);
router.post("/lms/quizzes/:id/attempt", StudentController.attemptQuiz);

// 6. Fee Management
router.get("/finance/challans", StudentController.getFeeChallans);
router.post("/finance/pay", StudentController.payFeeChallan);

// 7. Examinations
router.get("/examinations", StudentController.getExamSchedule);

// 8. Timetable
router.get("/timetable", StudentController.getWeeklyTimetable);

// 9. Announcements & Notifications
router.get("/announcements", StudentController.getAnnouncements);

module.exports = router;
