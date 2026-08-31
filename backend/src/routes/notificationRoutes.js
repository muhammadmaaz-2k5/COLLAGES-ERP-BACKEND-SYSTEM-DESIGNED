// ============================================================================
// 🔔 APEX UNIVERSITY ERP — NOTIFICATION ROUTES
// ============================================================================
// Route Mount: /api/v1/notifications
// ============================================================================

const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notificationController");

// Public / Token-optional SSE Stream
router.get("/stream", NotificationController.streamNotifications);

// Notification List & Mutations
router.get("/", NotificationController.getNotifications);
router.post("/dispatch", NotificationController.dispatchNotification);
router.patch("/:id/read", NotificationController.markAsRead);
router.post("/mark-all-read", NotificationController.markAllAsRead);

module.exports = router;
