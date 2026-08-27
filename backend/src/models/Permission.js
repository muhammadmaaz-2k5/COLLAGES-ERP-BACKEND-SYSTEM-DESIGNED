const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Permission = sequelize.define(
  "Permission",
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
    module: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "permissions",
    timestamps: true,
  }
);

module.exports = Permission;
