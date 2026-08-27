const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Program = sequelize.define(
  "Program",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    departmentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    degreeLevel: {
      type: DataTypes.ENUM("UNDERGRADUATE", "POSTGRADUATE", "DOCTORATE", "DIPLOMA"),
      defaultValue: "UNDERGRADUATE",
    },
    totalSemesters: {
      type: DataTypes.INTEGER,
      defaultValue: 8,
    },
    totalCreditsRequired: {
      type: DataTypes.INTEGER,
      defaultValue: 134,
    },
  },
  {
    tableName: "programs",
    timestamps: true,
  }
);

const DegreeRequirement = sequelize.define(
  "DegreeRequirement",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    programId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recommendedSemester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isElective: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    minGradeRequired: {
      type: DataTypes.STRING,
      defaultValue: "D",
    },
  },
  {
    tableName: "degree_requirements",
    timestamps: true,
  }
);

module.exports = {
  Program,
  DegreeRequirement,
};
