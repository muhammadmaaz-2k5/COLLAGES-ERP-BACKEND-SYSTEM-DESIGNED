const express = require("express");
const router = express.Router();
const GoogleClassroomController = require("../controllers/googleClassroomController");
const { authenticateToken } = require("../middleware/authGuard");

// OAuth Authorization URL & Callback
router.get("/auth-url", GoogleClassroomController.getAuthUrl);
router.get("/callback", GoogleClassroomController.handleCallback);

// Google Classroom Courses & Synchronization
router.get("/courses", GoogleClassroomController.getCourses);
router.post("/sync-offering", authenticateToken, GoogleClassroomController.syncOffering);
router.post("/sync-coursework", authenticateToken, GoogleClassroomController.syncCourseWork);

module.exports = router;
