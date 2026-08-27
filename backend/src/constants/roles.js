/**
 * 12 Universal System Roles for College / University Management ERP
 */
const SystemRoles = Object.freeze({
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  ACCOUNTANT: "ACCOUNTANT",
  LIBRARIAN: "LIBRARIAN",
  HR_MANAGER: "HR_MANAGER",
  WARDEN: "WARDEN",
  DRIVER: "DRIVER",
  ADMISSIONS_OFFICER: "ADMISSIONS_OFFICER",
  EXAM_CONTROLLER: "EXAM_CONTROLLER",
  STAFF: "STAFF",
});

const RoleHierarchyWeight = Object.freeze({
  SUPER_ADMIN: 100,
  ADMIN: 90,
  EXAM_CONTROLLER: 80,
  HR_MANAGER: 75,
  ACCOUNTANT: 75,
  ADMISSIONS_OFFICER: 70,
  TEACHER: 60,
  LIBRARIAN: 50,
  WARDEN: 50,
  STAFF: 40,
  DRIVER: 30,
  STUDENT: 20,
});

module.exports = {
  SystemRoles,
  RoleHierarchyWeight,
  ALL_ROLES: Object.values(SystemRoles),
};
