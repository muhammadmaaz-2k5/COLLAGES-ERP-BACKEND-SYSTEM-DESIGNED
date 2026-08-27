const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Assignment = sequelize.define(
  "Assignment",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    offeringId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    maxMarks: {
      type: DataTypes.FLOAT,
      defaultValue: 100,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "assignments",
    timestamps: true,
  }
);

const AssignmentSubmission = sequelize.define(
  "AssignmentSubmission",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    assignmentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    obtainedMarks: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("SUBMITTED", "GRADED", "LATE", "RESUBMIT_REQUESTED"),
      defaultValue: "SUBMITTED",
    },
  },
  {
    tableName: "assignment_submissions",
    timestamps: true,
  }
);

module.exports = {
  Assignment,
  AssignmentSubmission,
};
