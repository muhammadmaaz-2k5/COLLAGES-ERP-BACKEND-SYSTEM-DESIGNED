const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hierarchyWeight: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isSystemRole: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
  }
);

module.exports = Role;
