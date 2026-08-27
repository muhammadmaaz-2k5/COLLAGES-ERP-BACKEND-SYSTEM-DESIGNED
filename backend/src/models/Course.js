const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define(
  "Course",
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creditHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    lectureHours: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    labHours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    department: {
      type: DataTypes.STRING,
      defaultValue: "Computer Science",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

module.exports = Course;
