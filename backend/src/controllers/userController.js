const { User } = require("../models");
const AuditService = require("../services/auditService");

class UserController {
  static async getUsers(req, res, next) {
    try {
      const { role, limit = 50, offset = 0 } = req.query;
      const where = {};
      if (role) where.roleCode = role;

      const users = await User.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        attributes: { exclude: ["passwordHash"] },
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["passwordHash"] },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "User not found" },
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleUserStatus(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "User not found" },
        });
      }

      user.isActive = !user.isActive;
      await user.save();

      await AuditService.logAction({
        userId: req.user.id,
        userEmail: req.user.email,
        action: user.isActive ? "USER.ACTIVATED" : "USER.DEACTIVATED",
        entityType: "User",
        entityId: user.id,
        req,
      });

      return res.status(200).json({
        success: true,
        data: user.toSafeJSON(),
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
