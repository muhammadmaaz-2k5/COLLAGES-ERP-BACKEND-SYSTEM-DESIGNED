const express = require("express");
const router = express.Router();
const RBACController = require("../controllers/rbacController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const permissionGuard = require("../middleware/permissionGuard");

// Role & Permission Inspection
router.get("/roles", authGuard, RBACController.getRoles);
router.get("/permissions", authGuard, RBACController.getPermissions);
router.get("/roles/:roleCode/permissions", authGuard, RBACController.getRolePermissions);

// RBAC Matrix Mutations (Admin or SUPER_ADMIN required)
router.post(
  "/permissions/grant",
  authGuard,
  roleGuard(["SUPER_ADMIN", "ADMIN"]),
  permissionGuard("SYSTEM.RBAC.MANAGE"),
  RBACController.grantPermission
);

router.post(
  "/permissions/revoke",
  authGuard,
  roleGuard(["SUPER_ADMIN", "ADMIN"]),
  permissionGuard("SYSTEM.RBAC.MANAGE"),
  RBACController.revokePermission
);

router.post(
  "/users/assign-role",
  authGuard,
  roleGuard(["SUPER_ADMIN", "ADMIN"]),
  permissionGuard("SYSTEM.RBAC.MANAGE"),
  RBACController.assignRole
);

// Audit Logs
router.get(
  "/audit-logs",
  authGuard,
  roleGuard(["SUPER_ADMIN", "ADMIN"]),
  permissionGuard("SYSTEM.AUDIT.VIEW"),
  RBACController.getAuditLogs
);

module.exports = router;
