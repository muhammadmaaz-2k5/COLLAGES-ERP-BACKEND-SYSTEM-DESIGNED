const { SystemRoles } = require("./roles");

/**
 * Standard Granular Permission Catalog
 * Syntax: <MODULE>.<RESOURCE>.<ACTION>
 */
const PermissionCatalog = [
  // SYSTEM & IAM
  { code: "SYSTEM.SETTINGS.MANAGE", module: "SYSTEM", description: "Manage institutional configuration and tenant settings" },
  { code: "SYSTEM.RBAC.MANAGE", module: "SYSTEM", description: "Manage roles, permissions, and matrix assignments" },
  { code: "SYSTEM.AUDIT.VIEW", module: "SYSTEM", description: "View immutable audit logs and security events" },
  { code: "USER.ACCOUNT.MANAGE", module: "IAM", description: "Create, deactivate, and reset user credentials" },

  // ACADEMICS & CURRICULUM
  { code: "ACADEMICS.PROGRAM.MANAGE", module: "ACADEMICS", description: "Create and update degree programs and curricular roadmaps" },
  { code: "ACADEMICS.COURSE.MANAGE", module: "ACADEMICS", description: "Manage course catalog, credit hours, and prerequisite DAGs" },
  { code: "ACADEMICS.OFFERING.SCHEDULE", module: "ACADEMICS", description: "Schedule semester course offerings, assign instructors and rooms" },
  { code: "ACADEMICS.TIMETABLE.VIEW", module: "ACADEMICS", description: "View weekly class timetables" },

  // LMS & ASSESSMENTS
  { code: "LMS.COURSEWORK.SUBMIT", module: "LMS", description: "Submit assignments and attempt timed online quizzes" },
  { code: "LMS.ASSIGNMENT.MANAGE", module: "LMS", description: "Create, edit, publish, and evaluate assignments" },
  { code: "LMS.QUIZ.MANAGE", module: "LMS", description: "Create question banks, publish quizzes, and grade attempts" },
  { code: "LMS.ATTENDANCE.MARK", module: "LMS", description: "Mark student daily lecture and lab attendance" },
  { code: "LMS.ATTENDANCE.VIEW_SELF", module: "LMS", description: "View personal attendance percentages and absence records" },

  // EXAMINATIONS & GRADES
  { code: "EXAM.TERM.MANAGE", module: "EXAMINATION", description: "Configure Midterm/Final examination terms and datesheets" },
  { code: "EXAM.INVIGILATOR.ASSIGN", module: "EXAMINATION", description: "Assign faculty and staff invigilators to exam halls" },
  { code: "GRADE.SUBMIT_DRAFT", module: "EXAMINATION", description: "Submit provisional grades for instructed sections" },
  { code: "GRADE.APPROVE_FINAL", module: "EXAMINATION", description: "Approve, publish, and lock official results" },
  { code: "TRANSCRIPT.GENERATE", module: "EXAMINATION", description: "Generate official grade transcripts and recalculate CGPA" },
  { code: "TRANSCRIPT.VIEW_SELF", module: "EXAMINATION", description: "View personal semester transcript and SGPA/CGPA" },

  // FINANCE & BILLING
  { code: "FINANCE.STRUCTURE.MANAGE", module: "FINANCE", description: "Configure program fee structures and itemized templates" },
  { code: "FINANCE.CHALLAN.GENERATE", module: "FINANCE", description: "Generate batch or student fee challan vouchers" },
  { code: "FINANCE.PAYMENT.VERIFY", module: "FINANCE", description: "Verify bank receipts and approve payment transactions" },
  { code: "FINANCE.SCHOLARSHIP.GRANT", module: "FINANCE", description: "Approve merit and need-based scholarships" },
  { code: "FINANCE.LEDGER.MANAGE", module: "FINANCE", description: "Manage Chart of Accounts and General Ledger reconciliation" },
  { code: "FINANCE.CHALLAN.VIEW_SELF", module: "FINANCE", description: "View personal fee challans and download payment receipts" },

  // ADMISSIONS
  { code: "ADMISSIONS.APPLICATION.REVIEW", module: "ADMISSIONS", description: "Screen candidate applications and uploaded certificates" },
  { code: "ADMISSIONS.TEST.GRADE", module: "ADMISSIONS", description: "Record admission test scores" },
  { code: "ADMISSIONS.MERIT.PUBLISH", module: "ADMISSIONS", description: "Calculate aggregate scores and publish merit lists" },

  // HR & WORKFORCE
  { code: "HR.EMPLOYEE.MANAGE", module: "HR", description: "Onboard employees, manage contracts, and designation titles" },
  { code: "HR.LEAVE.APPROVE", module: "HR", description: "Approve or reject employee leave requests" },
  { code: "HR.PAYROLL.GENERATE", module: "HR", description: "Calculate monthly salaries, deductions, and issue pay slips" },
  { code: "HR.ATTENDANCE.RECORD", module: "HR", description: "Record biometric/manual employee daily check-ins" },

  // CAMPUS OPERATIONS
  { code: "LIBRARY.CIRCULATION.MANAGE", module: "LIBRARY", description: "Issue, return, and renew library book copies" },
  { code: "LIBRARY.CATALOG.MANAGE", module: "LIBRARY", description: "Manage book titles, authors, and barcode inventory" },
  { code: "HOSTEL.ALLOCATION.MANAGE", module: "HOSTEL", description: "Manage dormitories, allocate student rooms and beds" },
  { code: "TRANSPORT.ROUTE.MANAGE", module: "TRANSPORT", description: "Manage vehicle fleet, routes, stops, and bus passes" },
  { code: "FACILITIES.ROOM.BOOK", module: "FACILITIES", description: "Book halls, labs, and auditorium spaces" },
  { code: "FACILITIES.MAINTENANCE.MANAGE", module: "FACILITIES", description: "Create and resolve maintenance work orders" },
];

/**
 * Default Role-Permission Mappings Matrix
 */
const DefaultRolePermissions = {
  [SystemRoles.SUPER_ADMIN]: PermissionCatalog.map((p) => p.code),

  [SystemRoles.ADMIN]: [
    "USER.ACCOUNT.MANAGE",
    "ACADEMICS.PROGRAM.MANAGE",
    "ACADEMICS.COURSE.MANAGE",
    "ACADEMICS.OFFERING.SCHEDULE",
    "ACADEMICS.TIMETABLE.VIEW",
    "TRANSCRIPT.GENERATE",
    "ADMISSIONS.APPLICATION.REVIEW",
    "ADMISSIONS.MERIT.PUBLISH",
    "HR.LEAVE.APPROVE",
    "TRANSPORT.ROUTE.MANAGE",
    "FACILITIES.ROOM.BOOK",
    "FACILITIES.MAINTENANCE.MANAGE",
  ],

  [SystemRoles.TEACHER]: [
    "ACADEMICS.TIMETABLE.VIEW",
    "LMS.ASSIGNMENT.MANAGE",
    "LMS.QUIZ.MANAGE",
    "LMS.ATTENDANCE.MARK",
    "GRADE.SUBMIT_DRAFT",
    "FACILITIES.ROOM.BOOK",
  ],

  [SystemRoles.STUDENT]: [
    "ACADEMICS.TIMETABLE.VIEW",
    "LMS.COURSEWORK.SUBMIT",
    "LMS.ATTENDANCE.VIEW_SELF",
    "TRANSCRIPT.VIEW_SELF",
    "FINANCE.CHALLAN.VIEW_SELF",
  ],

  [SystemRoles.EXAM_CONTROLLER]: [
    "ACADEMICS.TIMETABLE.VIEW",
    "EXAM.TERM.MANAGE",
    "EXAM.INVIGILATOR.ASSIGN",
    "GRADE.APPROVE_FINAL",
    "TRANSCRIPT.GENERATE",
  ],

  [SystemRoles.ACCOUNTANT]: [
    "FINANCE.STRUCTURE.MANAGE",
    "FINANCE.CHALLAN.GENERATE",
    "FINANCE.PAYMENT.VERIFY",
    "FINANCE.SCHOLARSHIP.GRANT",
    "FINANCE.LEDGER.MANAGE",
  ],

  [SystemRoles.HR_MANAGER]: [
    "HR.EMPLOYEE.MANAGE",
    "HR.LEAVE.APPROVE",
    "HR.PAYROLL.GENERATE",
    "HR.ATTENDANCE.RECORD",
  ],

  [SystemRoles.ADMISSIONS_OFFICER]: [
    "ADMISSIONS.APPLICATION.REVIEW",
    "ADMISSIONS.TEST.GRADE",
    "ADMISSIONS.MERIT.PUBLISH",
  ],

  [SystemRoles.LIBRARIAN]: [
    "LIBRARY.CIRCULATION.MANAGE",
    "LIBRARY.CATALOG.MANAGE",
  ],

  [SystemRoles.WARDEN]: [
    "HOSTEL.ALLOCATION.MANAGE",
    "FACILITIES.MAINTENANCE.MANAGE",
  ],

  [SystemRoles.DRIVER]: [
    "TRANSPORT.ROUTE.MANAGE",
  ],

  [SystemRoles.STAFF]: [
    "FACILITIES.ROOM.BOOK",
    "FACILITIES.MAINTENANCE.MANAGE",
  ],
};

module.exports = {
  PermissionCatalog,
  DefaultRolePermissions,
};
