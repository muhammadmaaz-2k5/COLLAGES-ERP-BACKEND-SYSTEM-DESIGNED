const { Role, Permission, RolePermission, User } = require("../models");
const AuditService = require("./auditService");

class RBACService {
  /**
   * Get all system roles with their attached permissions
   */
  static async getAllRolesWithPermissions() {
    return Role.findAll({
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
      order: [["hierarchyWeight", "DESC"]],
    });
  }

  /**
   * Get all granular permissions in catalog
   */
  static async getAllPermissions() {
    return Permission.findAll({
      order: [["module", "ASC"], ["code", "ASC"]],
    });
  }

  /**
   * Get permissions for a specific role code
   */
  static async getPermissionsForRole(roleCode) {
    const role = await Role.findOne({
      where: { code: roleCode },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
    });

    if (!role) return [];
    return role.permissions.map((p) => p.code);
  }

  /**
   * Grant a permission to a role
   */
  static async grantPermissionToRole({ roleCode, permissionCode, actorUser, req }) {
    const role = await Role.findOne({ where: { code: roleCode } });
    if (!role) throw new Error(`Role '${roleCode}' not found`);

    const permission = await Permission.findOne({ where: { code: permissionCode } });
    if (!permission) throw new Error(`Permission '${permissionCode}' not found`);

    const [rp, created] = await RolePermission.findOrCreate({
      where: { roleId: role.id, permissionId: permission.id },
      defaults: { roleId: role.id, permissionId: permission.id },
    });

    if (created) {
      await AuditService.logAction({
        userId: actorUser?.id,
        userEmail: actorUser?.email,
        action: "RBAC.PERMISSION_GRANTED",
        entityType: "RolePermission",
        entityId: rp.id,
        details: { roleCode, permissionCode },
        req,
      });
    }

    return { success: true, created };
  }

  /**
   * Revoke a permission from a role
   */
  static async revokePermissionFromRole({ roleCode, permissionCode, actorUser, req }) {
    const role = await Role.findOne({ where: { code: roleCode } });
    if (!role) throw new Error(`Role '${roleCode}' not found`);

    const permission = await Permission.findOne({ where: { code: permissionCode } });
    if (!permission) throw new Error(`Permission '${permissionCode}' not found`);

    const deletedCount = await RolePermission.destroy({
      where: { roleId: role.id, permissionId: permission.id },
    });

    if (deletedCount > 0) {
      await AuditService.logAction({
        userId: actorUser?.id,
        userEmail: actorUser?.email,
        action: "RBAC.PERMISSION_REVOKED",
        entityType: "RolePermission",
        entityId: `${role.id}:${permission.id}`,
        details: { roleCode, permissionCode },
        req,
      });
    }

    return { success: true, revoked: deletedCount > 0 };
  }

  /**
   * Assign a role to a user
   */
  static async assignRoleToUser({ targetUserId, newRoleCode, actorUser, req }) {
    const user = await User.findByPk(targetUserId);
    if (!user) throw new Error("Target user not found");

    const role = await Role.findOne({ where: { code: newRoleCode } });
    if (!role) throw new Error(`Role '${newRoleCode}' does not exist`);

    const oldRoleCode = user.roleCode;
    user.roleCode = newRoleCode;
    await user.save();

    await AuditService.logAction({
      userId: actorUser?.id,
      userEmail: actorUser?.email,
      action: "USER.ROLE_ASSIGNED",
      entityType: "User",
      entityId: user.id,
      details: { previousRole: oldRoleCode, newRole: newRoleCode },
      req,
    });

    return user.toSafeJSON();
  }
}

module.exports = RBACService;
