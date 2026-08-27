/**
 * PermissionGuard: Checks if the user's role has the required permission code.
 * Super Admin always has full bypass privileges.
 */
const permissionGuard = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    if (userPermissions.includes(requiredPermission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: {
        code: "PERMISSION_DENIED",
        message: `Forbidden. Missing required capability: '${requiredPermission}'`,
      },
    });
  };
};

module.exports = permissionGuard;
