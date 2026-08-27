const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offeringId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("REGISTERED", "ENROLLED", "DROPPED", "COMPLETED", "FAILED"),
      defaultValue: "ENROLLED",
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gradePoint: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalMarks: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isPassed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "enrollments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["studentId", "offeringId"],
      },
    ],
  }
);

module.exports = Enrollment;
