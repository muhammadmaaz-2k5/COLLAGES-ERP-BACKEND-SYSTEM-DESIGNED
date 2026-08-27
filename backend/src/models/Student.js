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
    section: {
      type: DataTypes.STRING,
      defaultValue: "A",
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
    admissionSession: {
      type: DataTypes.STRING,
      defaultValue: "Fall 2023",
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: "Male",
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      defaultValue: "2004-05-14",
    },
    bloodGroup: {
      type: DataTypes.STRING,
      defaultValue: "O+",
    },
    cnic: {
      type: DataTypes.STRING,
      defaultValue: "42101-9876543-1",
    },
    permanentAddress: {
      type: DataTypes.TEXT,
      defaultValue: "House 42, Sector F-8/2, University Avenue",
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: "Capital City",
    },
    emergencyContact: {
      type: DataTypes.STRING,
      defaultValue: "+1 (555) 234-5678",
    },
    guardianName: {
      type: DataTypes.STRING,
      defaultValue: "Arthur Morgan",
    },
    guardianRelation: {
      type: DataTypes.STRING,
      defaultValue: "Father",
    },
    guardianPhone: {
      type: DataTypes.STRING,
      defaultValue: "+1 (555) 987-6543",
    },
    guardianEmail: {
      type: DataTypes.STRING,
      defaultValue: "arthur.morgan@parent.university.edu",
    },
    facultyMentor: {
      type: DataTypes.STRING,
      defaultValue: "Dr. Sarah Jenkins",
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

module.exports = Student;
