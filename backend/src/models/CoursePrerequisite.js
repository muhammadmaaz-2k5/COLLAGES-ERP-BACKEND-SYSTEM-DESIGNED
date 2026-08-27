const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CoursePrerequisite = sequelize.define(
  "CoursePrerequisite",
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
    prerequisiteCourseId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("HARD_PREREQUISITE", "CO_REQUISITE", "ADVISORY"),
      defaultValue: "HARD_PREREQUISITE",
    },
    minGradePoint: {
      type: DataTypes.FLOAT,
      defaultValue: 2.0,
    },
  },
  {
    tableName: "course_prerequisites",
    timestamps: true,
  }
);

module.exports = CoursePrerequisite;
