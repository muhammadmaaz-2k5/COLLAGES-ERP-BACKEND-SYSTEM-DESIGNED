const sequelize = require("../config/database");
const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");
const RefreshToken = require("./RefreshToken");
const AuditLog = require("./AuditLog");

// Define Associations
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});

RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(AuditLog, {
  foreignKey: "userId",
  as: "auditLogs",
});

AuditLog.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  RefreshToken,
  AuditLog,
};
