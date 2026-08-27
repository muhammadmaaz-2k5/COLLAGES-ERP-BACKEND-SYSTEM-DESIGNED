const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Quiz = sequelize.define(
  "Quiz",
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
    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    totalMarks: {
      type: DataTypes.FLOAT,
      defaultValue: 20,
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "quizzes",
    timestamps: true,
  }
);

const QuizAttempt = sequelize.define(
  "QuizAttempt",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    quizId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalMarks: {
      type: DataTypes.FLOAT,
      defaultValue: 20,
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("IN_PROGRESS", "SUBMITTED", "GRADED", "TIMED_OUT"),
      defaultValue: "SUBMITTED",
    },
  },
  {
    tableName: "quiz_attempts",
    timestamps: true,
  }
);

module.exports = {
  Quiz,
  QuizAttempt,
};
