const jwt = require("jsonwebtoken");
const { User, RefreshToken } = require("../models");
const { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN } = require("../config/jwt");
const RBACService = require("./rbacService");
const AuditService = require("./auditService");

class AuthService {
  /**
   * Generate access token and refresh token for user
   */
  static async generateTokens(user) {
    const permissions = await RBACService.getPermissionsForRole(user.roleCode);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.roleCode,
      permissions,
      fullName: user.fullName,
      studentId: user.studentId,
      employeeId: user.employeeId,
      institutionId: user.institutionId,
      campusId: user.campusId,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        ...user.toSafeJSON(),
        permissions,
      },
    };
  }

  /**
   * Register a new user
   */
  static async register({ email, password, firstName, lastName, roleCode = "STUDENT", studentId, employeeId, req }) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new Error("A user with this email already exists");
    }

    const user = await User.create({
      email,
      passwordHash: password,
      firstName,
      lastName,
      roleCode,
      studentId,
      employeeId,
    });

    await AuditService.logAction({
      userId: user.id,
      userEmail: user.email,
      action: "USER.REGISTERED",
      entityType: "User",
      entityId: user.id,
      details: { roleCode },
      req,
    });

    return this.generateTokens(user);
  }

  /**
   * Authenticate user with credentials
   */
  static async login({ email, password, req }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("This account has been deactivated. Please contact campus administrator.");
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    user.lastLoginAt = new Date();
    await user.save();

    await AuditService.logAction({
      userId: user.id,
      userEmail: user.email,
      action: "AUTH.LOGIN_SUCCESS",
      entityType: "User",
      entityId: user.id,
      req,
    });

    return this.generateTokens(user);
  }

  /**
   * Refresh expired access token
   */
  static async refreshToken({ token }) {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const dbToken = await RefreshToken.findOne({
      where: { token, userId: decoded.id, isRevoked: false },
    });

    if (!dbToken || new Date() > dbToken.expiresAt) {
      throw new Error("Refresh token is invalid or expired");
    }

    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      throw new Error("User account unavailable");
    }

    // Revoke old token
    dbToken.isRevoked = true;
    await dbToken.save();

    return this.generateTokens(user);
  }
}

module.exports = AuthService;
