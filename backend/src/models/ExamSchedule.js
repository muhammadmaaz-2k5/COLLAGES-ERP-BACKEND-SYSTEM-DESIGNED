const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ExamSchedule = sequelize.define(
  "ExamSchedule",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    termName: {
      type: DataTypes.STRING,
      defaultValue: "Fall 2026 Midterm Examination",
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    examDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      defaultValue: "09:00 AM",
    },
    endTime: {
      type: DataTypes.STRING,
      defaultValue: "12:00 PM",
    },
    room: {
      type: DataTypes.STRING,
      defaultValue: "Examination Hall A",
    },
    seatNumber: {
      type: DataTypes.STRING,
      defaultValue: "HA-042",
    },
    invigilator: {
      type: DataTypes.STRING,
      defaultValue: "Prof. Arthur Pendleton",
    },
  },
  {
    tableName: "exam_schedules",
    timestamps: true,
  }
);

const Announcement = sequelize.define(
  "Announcement",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("ACADEMIC", "EXAMINATION", "FINANCE", "EVENT", "GENERAL"),
      defaultValue: "ACADEMIC",
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "URGENT"),
      defaultValue: "MEDIUM",
    },
    authorName: {
      type: DataTypes.STRING,
      defaultValue: "Office of the Registrar",
    },
    publishedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "announcements",
    timestamps: true,
  }
);

module.exports = {
  ExamSchedule,
  Announcement,
};
