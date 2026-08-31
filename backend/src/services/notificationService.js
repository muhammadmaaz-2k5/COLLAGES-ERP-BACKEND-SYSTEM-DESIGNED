// ============================================================================
// 🔔 APEX UNIVERSITY ERP — REAL-TIME NOTIFICATION SERVICE
// ============================================================================
// Server-Sent Events (SSE) live stream engine with multi-channel push dispatch
// (In-App real-time toast, SMTP email simulation, Twilio SMS broadcast).
// ============================================================================

const AuditService = require("./auditService");

// In-Memory Active SSE Client Connection Registry
let activeSSEClients = new Map();

// In-Memory Notification Store
let notificationStore = [
  {
    id: "notif_01",
    recipientId: "std_01",
    recipientRole: "STUDENT",
    title: "Fall 2026 Course Registration Open",
    message: "Registration for Fall 2026 courses is now open. Verify your prerequisites before selecting sections.",
    type: "ACADEMIC",
    priority: "HIGH",
    channel: "IN_APP",
    isRead: false,
    createdAt: "2026-08-28T08:00:00Z",
  },
  {
    id: "notif_02",
    recipientId: "std_01",
    recipientRole: "STUDENT",
    title: "Semester Challan Generated",
    message: "Your tuition fee challan for Fall 2026 (PKR 125,000) has been generated. Due date is Sept 15, 2026.",
    type: "FINANCE",
    priority: "MEDIUM",
    channel: "IN_APP",
    isRead: true,
    createdAt: "2026-08-27T10:30:00Z",
  },
  {
    id: "notif_03",
    recipientId: "emp_01",
    recipientRole: "TEACHER",
    title: "Sessional Grade Lock Notice",
    message: "Controller of Examinations has scheduled the immutable grade lock for Midterm terms on Sept 10.",
    type: "EXAMINATION",
    priority: "URGENT",
    channel: "IN_APP",
    isRead: false,
    createdAt: "2026-08-29T14:00:00Z",
  },
];

class NotificationService {
  // ==========================================================================
  // 1. SSE CLIENT REGISTRATION & HEARTBEAT
  // ==========================================================================

  static registerSSEClient(clientId, res, userId = "anonymous") {
    activeSSEClients.set(clientId, { res, userId, connectedAt: new Date().toISOString() });

    // Send initial handshake event
    res.write(`event: handshake\ndata: ${JSON.stringify({ clientId, status: "CONNECTED", activeStreams: activeSSEClients.size })}\n\n`);

    // Keep-alive heartbeat ping every 25 seconds
    const interval = setInterval(() => {
      if (activeSSEClients.has(clientId)) {
        res.write(`event: ping\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
      } else {
        clearInterval(interval);
      }
    }, 25000);

    return () => {
      clearInterval(interval);
      activeSSEClients.delete(clientId);
    };
  }

  // ==========================================================================
  // 2. DISPATCH NOTIFICATION (MULTI-CHANNEL)
  // ==========================================================================

  static async dispatchNotification(payload, req) {
    const { recipientId, recipientRole = "ALL", title, message, type = "GENERAL", priority = "MEDIUM", channels = ["IN_APP", "EMAIL"] } = payload;

    const newNotification = {
      id: `notif_${Date.now()}`,
      recipientId: recipientId || "ALL",
      recipientRole,
      title,
      message,
      type,
      priority,
      channels,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    notificationStore.unshift(newNotification);

    // 1. Broadcast to SSE active connected streams
    for (const [cId, client] of activeSSEClients.entries()) {
      if (recipientId === "ALL" || client.userId === recipientId) {
        try {
          client.res.write(`event: notification\ndata: ${JSON.stringify(newNotification)}\n\n`);
        } catch (err) {
          activeSSEClients.delete(cId);
        }
      }
    }

    // 2. Simulated Multi-Channel Dispatch (Email via SMTP & SMS via Twilio)
    if (channels.includes("EMAIL")) {
      console.log(`[SMTP EMAIL DISPATCH] To: ${recipientId}@apex.edu.pk | Subject: ${title}`);
    }
    if (channels.includes("SMS")) {
      console.log(`[TWILIO SMS DISPATCH] To: ${recipientId} | Message: ${title} - ${message}`);
    }

    await AuditService.logAction({
      userId: req?.user?.id || "system",
      userEmail: req?.user?.email,
      action: "NOTIFICATION.DISPATCHED",
      entityType: "Notification",
      entityId: newNotification.id,
      details: { title, recipientId, priority, channels },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newNotification;
  }

  // ==========================================================================
  // 3. RETRIEVE & MARK NOTIFICATIONS
  // ==========================================================================

  static async getNotifications({ recipientId, isRead } = {}) {
    let list = [...notificationStore];
    if (recipientId) {
      list = list.filter((n) => n.recipientId === recipientId || n.recipientId === "ALL");
    }
    if (isRead !== undefined && isRead !== "ALL") {
      const boolVal = isRead === "true" || isRead === true;
      list = list.filter((n) => n.isRead === boolVal);
    }
    return list;
  }

  static async markAsRead(notificationId) {
    const notif = notificationStore.find((n) => n.id === notificationId);
    if (notif) notif.isRead = true;
    return notif;
  }

  static async markAllAsRead(recipientId) {
    notificationStore.forEach((n) => {
      if (!recipientId || n.recipientId === recipientId || n.recipientId === "ALL") {
        n.isRead = true;
      }
    });
    return { success: true, message: "All notifications marked as read." };
  }
}

module.exports = NotificationService;
