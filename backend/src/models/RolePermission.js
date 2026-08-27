const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    roleId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "role_permissions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["roleId", "permissionId"],
      },
    ],
  }
);

module.exports = RolePermission;
