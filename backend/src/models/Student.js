const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    regNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rollNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    programName: {
      type: DataTypes.STRING,
      defaultValue: "Bachelor of Science in Computer Science",
    },
    departmentName: {
      type: DataTypes.STRING,
      defaultValue: "Computer Science & Engineering",
    },
    currentSemester: {
      type: DataTypes.INTEGER,
      defaultValue: 6,
    },
    cgpaCache: {
      type: DataTypes.FLOAT,
      defaultValue: 3.87,
    },
    creditsEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 96,
    },
    totalCreditsRequired: {
      type: DataTypes.INTEGER,
      defaultValue: 134,
    },
    academicStanding: {
      type: DataTypes.ENUM("GOOD_STANDING", "PROBATION", "SUSPENDED", "GRADUATED"),
      defaultValue: "GOOD_STANDING",
    },
    admissionDate: {
      type: DataTypes.DATEONLY,
      defaultValue: "2023-09-01",
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

module.exports = Student;
