/**
 * ObjectScopeGuard: Enforces object-level isolation.
 * e.g., Students can only access their own studentId records.
 */
const objectScopeGuard = (targetParamName = "studentId", userField = "studentId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    // Admins and Super Admins bypass object-level student checks
    if (["SUPER_ADMIN", "ADMIN", "EXAM_CONTROLLER"].includes(req.user.role)) {
      return next();
    }

    const targetId = req.params[targetParamName] || req.query[targetParamName] || req.body[targetParamName];
    const userScopeId = req.user[userField];

    if (targetId && userScopeId && targetId !== userScopeId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "OBJECT_SCOPE_VIOLATION",
          message: "Forbidden. You do not have permission to access another user's records.",
        },
      });
    }

    next();
  };
};

module.exports = objectScopeGuard;
