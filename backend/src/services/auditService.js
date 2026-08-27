const { AuditLog } = require("../models");

class AuditService {
  /**
   * Log an immutable security / business action to the database
   */
  static async logAction({ userId, userEmail, action, entityType, entityId, details, req }) {
    try {
      const ipAddress = req?.ip || req?.headers?.["x-forwarded-for"] || "127.0.0.1";
      const userAgent = req?.headers?.["user-agent"] || "System";

      return await AuditLog.create({
        userId,
        userEmail,
        action,
        entityType,
        entityId,
        details: typeof details === "object" ? JSON.stringify(details) : details,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent,
      });
    } catch (err) {
      console.error("[AuditService Error]:", err.message);
      return null;
    }
  }

  static async getRecentLogs({ limit = 50, offset = 0, action, entityType } = {}) {
    const where = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    return AuditLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }
}

module.exports = AuditService;
