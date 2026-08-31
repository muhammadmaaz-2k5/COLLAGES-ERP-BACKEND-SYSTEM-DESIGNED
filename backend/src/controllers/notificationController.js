// ============================================================================
// 🔔 APEX UNIVERSITY ERP — NOTIFICATION CONTROLLER
// ============================================================================
// REST & SSE controller for real-time notification feeds.
// ============================================================================

const NotificationService = require("../services/notificationService");

class NotificationController {
  /**
   * GET /api/v1/notifications/stream
   * Persistent Server-Sent Events (SSE) live stream
   */
  static streamNotifications(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userId = req.user?.id || req.query.userId || "anonymous";

    const cleanup = NotificationService.registerSSEClient(clientId, res, userId);

    req.on("close", () => {
      cleanup();
    });
  }

  /**
   * GET /api/v1/notifications
   * Retrieve notification feed
   */
  static async getNotifications(req, res, next) {
    try {
      const { isRead } = req.query;
      const recipientId = req.user?.id || req.query.userId;
      const data = await NotificationService.getNotifications({ recipientId, isRead });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/notifications/dispatch
   * Dispatches a new notification across channels
   */
  static async dispatchNotification(req, res, next) {
    try {
      const { title, message } = req.body;
      if (!title || !message) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "title and message are required" },
        });
      }

      const data = await NotificationService.dispatchNotification(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   * Marks a notification as read
   */
  static async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const data = await NotificationService.markAsRead(id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/notifications/mark-all-read
   * Marks all notifications as read
   */
  static async markAllAsRead(req, res, next) {
    try {
      const recipientId = req.user?.id;
      const data = await NotificationService.markAllAsRead(recipientId);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
