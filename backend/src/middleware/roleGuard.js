/**
 * RoleGuard: Allows access only if the authenticated user has one of the specified roles.
 * Super Admin always bypasses role checks.
 */
const roleGuard = (allowedRoles = []) => {
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

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN_ROLE",
        message: `Access denied. Required one of roles: [${allowedRoles.join(", ")}]. Current role: '${req.user.role}'`,
      },
    });
  };
};

module.exports = roleGuard;
