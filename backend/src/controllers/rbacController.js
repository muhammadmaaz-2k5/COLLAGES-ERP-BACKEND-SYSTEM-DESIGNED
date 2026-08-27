const RBACService = require("../services/rbacService");
const AuditService = require("../services/auditService");
const { ALL_ROLES } = require("../constants/roles");

class RBACController {
  static async getRoles(req, res, next) {
    try {
      const roles = await RBACService.getAllRolesWithPermissions();
      return res.status(200).json({
        success: true,
        data: roles,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPermissions(req, res, next) {
    try {
      const permissions = await RBACService.getAllPermissions();
      return res.status(200).json({
        success: true,
        data: permissions,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRolePermissions(req, res, next) {
    try {
      const { roleCode } = req.params;
      const permissions = await RBACService.getPermissionsForRole(roleCode.toUpperCase());

      return res.status(200).json({
        success: true,
        data: {
          roleCode: roleCode.toUpperCase(),
          permissions,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async grantPermission(req, res, next) {
    try {
      const { roleCode, permissionCode } = req.body;
      if (!roleCode || !permissionCode) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "roleCode and permissionCode are required" },
        });
      }

      const result = await RBACService.grantPermissionToRole({
        roleCode: roleCode.toUpperCase(),
        permissionCode: permissionCode.toUpperCase(),
        actorUser: req.user,
        req,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async revokePermission(req, res, next) {
    try {
      const { roleCode, permissionCode } = req.body;
      if (!roleCode || !permissionCode) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "roleCode and permissionCode are required" },
        });
      }

      const result = await RBACService.revokePermissionFromRole({
        roleCode: roleCode.toUpperCase(),
        permissionCode: permissionCode.toUpperCase(),
        actorUser: req.user,
        req,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async assignRole(req, res, next) {
    try {
      const { targetUserId, newRoleCode } = req.body;
      if (!targetUserId || !newRoleCode) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "targetUserId and newRoleCode are required" },
        });
      }

      const updatedUser = await RBACService.assignRoleToUser({
        targetUserId,
        newRoleCode: newRoleCode.toUpperCase(),
        actorUser: req.user,
        req,
      });

      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAuditLogs(req, res, next) {
    try {
      const { limit = 50, offset = 0, action, entityType } = req.query;
      const logs = await AuditService.getRecentLogs({
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        action,
        entityType,
      });

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RBACController;
