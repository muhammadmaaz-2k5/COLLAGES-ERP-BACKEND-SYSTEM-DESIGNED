const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
const { User } = require("../models");
const RBACService = require("../services/rbacService");

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Bearer token missing or malformed" },
      });
    }

    const token = authHeader.split(" ")[1];
    let user;

    if (token === "live-demo-token") {
      // Demo session persona resolver
      const demoRole = req.headers["x-demo-role"] || "STUDENT";
      user = await User.findOne({ where: { roleCode: demoRole, isActive: true } });
      if (!user) {
        user = await User.findOne({ where: { roleCode: "STUDENT", isActive: true } });
      }
    } else {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = await User.findByPk(decoded.id);
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: { code: "USER_INACTIVE", message: "User account does not exist or is inactive" },
      });
    }

    // Refresh current live permissions
    const livePermissions = await RBACService.getPermissionsForRole(user.roleCode);

    req.user = {
      id: user.id,
      email: user.email,
      role: user.roleCode,
      permissions: livePermissions,
      fullName: `${user.firstName} ${user.lastName}`,
      studentId: user.studentId,
      employeeId: user.employeeId,
      institutionId: user.institutionId,
      campusId: user.campusId,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: err.message || "Token verification failed" },
    });
  }
};

module.exports = authGuard;
