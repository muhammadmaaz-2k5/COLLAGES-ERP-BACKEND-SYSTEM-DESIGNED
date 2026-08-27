const sequelize = require("../config/database");
const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");
const RefreshToken = require("./RefreshToken");
const AuditLog = require("./AuditLog");
const Student = require("./Student");
const Department = require("./Department");
const { Program, DegreeRequirement } = require("./Program");
const Course = require("./Course");
const CoursePrerequisite = require("./CoursePrerequisite");
const CourseOffering = require("./CourseOffering");
const Enrollment = require("./Enrollment");
const Attendance = require("./Attendance");
const { Assignment, AssignmentSubmission } = require("./Assignment");
const { Quiz, QuizAttempt } = require("./Quiz");
const FeeChallan = require("./FeeChallan");
const { ExamSchedule, Announcement } = require("./ExamSchedule");

// IAM Associations
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(AuditLog, { foreignKey: "userId", as: "auditLogs" });
AuditLog.belongsTo(User, { foreignKey: "userId", as: "user" });

// Student & Academic Associations
User.hasOne(Student, { foreignKey: "userId", as: "student" });
Student.belongsTo(User, { foreignKey: "userId", as: "user" });

Department.hasMany(Program, { foreignKey: "departmentId", as: "programs" });
Program.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

Department.hasMany(Course, { foreignKey: "departmentId", as: "courses" });
Course.belongsTo(Department, { foreignKey: "departmentId", as: "departmentObj" });

Program.hasMany(DegreeRequirement, { foreignKey: "programId", as: "requirements" });
DegreeRequirement.belongsTo(Program, { foreignKey: "programId", as: "program" });
DegreeRequirement.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Course.hasMany(CourseOffering, { foreignKey: "courseId", as: "offerings" });
CourseOffering.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Course.hasMany(CoursePrerequisite, { foreignKey: "courseId", as: "prerequisites" });
CoursePrerequisite.belongsTo(Course, { foreignKey: "courseId", as: "course" });
CoursePrerequisite.belongsTo(Course, { foreignKey: "prerequisiteCourseId", as: "prerequisiteCourse" });

Student.hasMany(Enrollment, { foreignKey: "studentId", as: "enrollments" });
Enrollment.belongsTo(Student, { foreignKey: "studentId", as: "student" });
CourseOffering.hasMany(Enrollment, { foreignKey: "offeringId", as: "enrollments" });
Enrollment.belongsTo(CourseOffering, { foreignKey: "offeringId", as: "offering" });

Student.hasMany(Attendance, { foreignKey: "studentId", as: "attendances" });
Attendance.belongsTo(Student, { foreignKey: "studentId", as: "student" });
CourseOffering.hasMany(Attendance, { foreignKey: "offeringId", as: "attendances" });
Attendance.belongsTo(CourseOffering, { foreignKey: "offeringId", as: "offering" });

CourseOffering.hasMany(Assignment, { foreignKey: "offeringId", as: "assignments" });
Assignment.belongsTo(CourseOffering, { foreignKey: "offeringId", as: "offering" });
Assignment.hasMany(AssignmentSubmission, { foreignKey: "assignmentId", as: "submissions" });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });
Student.hasMany(AssignmentSubmission, { foreignKey: "studentId", as: "submissions" });
AssignmentSubmission.belongsTo(Student, { foreignKey: "studentId", as: "student" });

CourseOffering.hasMany(Quiz, { foreignKey: "offeringId", as: "quizzes" });
Quiz.belongsTo(CourseOffering, { foreignKey: "offeringId", as: "offering" });
Quiz.hasMany(QuizAttempt, { foreignKey: "quizId", as: "attempts" });
QuizAttempt.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });
Student.hasMany(QuizAttempt, { foreignKey: "studentId", as: "quizAttempts" });
QuizAttempt.belongsTo(Student, { foreignKey: "studentId", as: "student" });

Student.hasMany(FeeChallan, { foreignKey: "studentId", as: "challans" });
FeeChallan.belongsTo(Student, { foreignKey: "studentId", as: "student" });

module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  RefreshToken,
  AuditLog,
  Student,
  Department,
  Program,
  DegreeRequirement,
  Course,
  CoursePrerequisite,
  CourseOffering,
  Enrollment,
  Attendance,
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizAttempt,
  FeeChallan,
  ExamSchedule,
  Announcement,
};
