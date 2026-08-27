const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CourseOffering = sequelize.define(
  "CourseOffering",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    termCode: {
      type: DataTypes.STRING,
      defaultValue: "FA26",
    },
    semesterName: {
      type: DataTypes.STRING,
      defaultValue: "Fall 2026",
    },
    section: {
      type: DataTypes.STRING,
      defaultValue: "A",
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 45,
    },
    enrolledCount: {
      type: DataTypes.INTEGER,
      defaultValue: 38,
    },
    instructorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      defaultValue: "Lab 304",
    },
    schedule: {
      type: DataTypes.STRING,
      defaultValue: "Mon/Wed 09:00 - 10:30",
    },
    status: {
      type: DataTypes.ENUM("OPEN", "CLOSED", "CANCELLED"),
      defaultValue: "OPEN",
    },
  },
  {
    tableName: "course_offerings",
    timestamps: true,
  }
);

module.exports = CourseOffering;
