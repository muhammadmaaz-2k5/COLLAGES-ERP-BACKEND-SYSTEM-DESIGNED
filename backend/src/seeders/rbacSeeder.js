const {
  sequelize,
  Role,
  Permission,
  RolePermission,
  User,
  Student,
  Course,
  CourseOffering,
  CoursePrerequisite,
  Enrollment,
  Attendance,
  FeeChallan,
  ExamSchedule,
  Announcement,
} = require("../models");
const { SystemRoles, RoleHierarchyWeight } = require("../constants/roles");
const { PermissionCatalog, DefaultRolePermissions } = require("../constants/permissions");

async function seedDatabase() {
  console.log("[Seeder] Starting database sync & seed...");

  await sequelize.sync({ force: false, alter: true });
  console.log("✓ Database schema synchronized.");

  // 1. Seed Roles
  for (const [code, weight] of Object.entries(RoleHierarchyWeight)) {
    await Role.findOrCreate({
      where: { code },
      defaults: {
        code,
        name: code.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        description: `Standard system role for ${code}`,
        hierarchyWeight: weight,
        isSystemRole: true,
      },
    });
  }
  console.log("✓ 12 Standard Roles verified.");

  // 2. Seed Permissions
  for (const p of PermissionCatalog) {
    await Permission.findOrCreate({
      where: { code: p.code },
      defaults: {
        code: p.code,
        module: p.module,
        description: p.description,
      },
    });
  }
  console.log(`✓ ${PermissionCatalog.length} Granular Permissions verified.`);

  // 3. Seed Role-Permission Matrix
  for (const [roleCode, permCodes] of Object.entries(DefaultRolePermissions)) {
    const role = await Role.findOne({ where: { code: roleCode } });
    if (!role) continue;

    for (const pCode of permCodes) {
      const permission = await Permission.findOne({ where: { code: pCode } });
      if (!permission) continue;

      await RolePermission.findOrCreate({
        where: { roleId: role.id, permissionId: permission.id },
        defaults: { roleId: role.id, permissionId: permission.id },
      });
    }
  }
  console.log("✓ Role-Permission Matrix linked.");

  // 4. Seed Demo Users
  const demoUsers = [
    { email: "superadmin@university.edu", firstName: "Super", lastName: "Administrator", roleCode: SystemRoles.SUPER_ADMIN },
    { email: "admin@university.edu", firstName: "Campus", lastName: "Admin", roleCode: SystemRoles.ADMIN },
    { email: "teacher@university.edu", firstName: "Sarah", lastName: "Jenkins", roleCode: SystemRoles.TEACHER, employeeId: "EMP-FAC-01" },
    { email: "student@university.edu", firstName: "Alex", lastName: "Morgan", roleCode: SystemRoles.STUDENT, studentId: "STD-2026-042" },
    { email: "accountant@university.edu", firstName: "Robert", lastName: "Sterling", roleCode: SystemRoles.ACCOUNTANT, employeeId: "EMP-FIN-01" },
    { email: "librarian@university.edu", firstName: "Emily", lastName: "Blunt", roleCode: SystemRoles.LIBRARIAN, employeeId: "EMP-LIB-01" },
    { email: "hrmanager@university.edu", firstName: "David", lastName: "Hassel", roleCode: SystemRoles.HR_MANAGER, employeeId: "EMP-HR-01" },
    { email: "warden@university.edu", firstName: "Marcus", lastName: "Vance", roleCode: SystemRoles.WARDEN, employeeId: "EMP-HST-01" },
    { email: "driver@university.edu", firstName: "James", lastName: "Miller", roleCode: SystemRoles.DRIVER, employeeId: "EMP-DRV-01" },
    { email: "admissions@university.edu", firstName: "Clara", lastName: "Oswald", roleCode: SystemRoles.ADMISSIONS_OFFICER, employeeId: "EMP-ADM-01" },
    { email: "examcontroller@university.edu", firstName: "Arthur", lastName: "Pendleton", roleCode: SystemRoles.EXAM_CONTROLLER, employeeId: "EMP-EXM-01" },
    { email: "staff@university.edu", firstName: "Hannah", lastName: "Abbott", roleCode: SystemRoles.STAFF, employeeId: "EMP-STF-01" },
  ];

  let studentUserRecord = null;

  for (const u of demoUsers) {
    let [user] = await User.findOrCreate({
      where: { email: u.email },
      defaults: {
        email: u.email,
        passwordHash: "Password123!",
        firstName: u.firstName,
        lastName: u.lastName,
        roleCode: u.roleCode,
        studentId: u.studentId,
        employeeId: u.employeeId,
      },
    });

    if (u.roleCode === "STUDENT") {
      studentUserRecord = user;
    }
  }
  console.log("✓ 12 Demo Accounts verified.");

  // 5. Seed Student Master Profile
  let studentProfile = null;
  if (studentUserRecord) {
    [studentProfile] = await Student.findOrCreate({
      where: { userId: studentUserRecord.id },
      defaults: {
        userId: studentUserRecord.id,
        regNo: "FA23-BCS-042",
        rollNo: "042",
        programName: "BS Computer Science",
        departmentName: "Computer Science & Engineering",
        currentSemester: 6,
        cgpaCache: 3.87,
        creditsEarned: 96,
        academicStanding: "GOOD_STANDING",
      },
    });
  }

  // 6. Seed Courses & Prerequisite DAG
  const coursesData = [
    { code: "CS-101", title: "Intro to Programming", creditHours: 4 },
    { code: "CS-102", title: "Object Oriented Programming", creditHours: 4 },
    { code: "CS-201", title: "Data Structures & Algorithms", creditHours: 4 },
    { code: "CS-210", title: "Design & Analysis of Algorithms", creditHours: 3 },
    { code: "CS-220", title: "Database Systems", creditHours: 4 },
    { code: "CS-401", title: "Distributed Computing Systems", creditHours: 4 },
    { code: "CS-405", title: "Compiler Construction & Design", creditHours: 3 },
    { code: "SE-410", title: "Cloud Architecture & Microservices", creditHours: 3 },
    { code: "MT-302", title: "Stochastic Processes & Analytics", creditHours: 3 },
    { code: "AI-401", title: "Deep Learning & Neural Architectures", creditHours: 3 },
    { code: "CS-499", title: "Senior Capstone Project", creditHours: 6 },
  ];

  const createdCourses = {};
  for (const c of coursesData) {
    const [course] = await Course.findOrCreate({
      where: { code: c.code },
      defaults: c,
    });
    createdCourses[c.code] = course;
  }

  // Prerequisites DAG
  if (createdCourses["CS-102"] && createdCourses["CS-101"]) {
    await CoursePrerequisite.findOrCreate({
      where: { courseId: createdCourses["CS-102"].id, prerequisiteCourseId: createdCourses["CS-101"].id },
      defaults: { courseId: createdCourses["CS-102"].id, prerequisiteCourseId: createdCourses["CS-101"].id, type: "HARD_PREREQUISITE" },
    });
  }
  if (createdCourses["CS-201"] && createdCourses["CS-102"]) {
    await CoursePrerequisite.findOrCreate({
      where: { courseId: createdCourses["CS-201"].id, prerequisiteCourseId: createdCourses["CS-102"].id },
      defaults: { courseId: createdCourses["CS-201"].id, prerequisiteCourseId: createdCourses["CS-102"].id, type: "HARD_PREREQUISITE" },
    });
  }
  if (createdCourses["CS-401"] && createdCourses["CS-201"]) {
    await CoursePrerequisite.findOrCreate({
      where: { courseId: createdCourses["CS-401"].id, prerequisiteCourseId: createdCourses["CS-201"].id },
      defaults: { courseId: createdCourses["CS-401"].id, prerequisiteCourseId: createdCourses["CS-201"].id, type: "HARD_PREREQUISITE" },
    });
  }

  // 7. Seed Offerings
  const offeringsData = [
    { code: "CS-401", instructor: "Dr. Sarah Jenkins", room: "Lab 304", schedule: "Mon/Wed 09:00 - 10:30" },
    { code: "CS-405", instructor: "Prof. Alan Vance", room: "Hall B", schedule: "Tue/Thu 11:00 - 12:30" },
    { code: "SE-410", instructor: "Dr. Michael Chen", room: "Smart Room 102", schedule: "Mon/Wed 14:00 - 15:30" },
    { code: "MT-302", instructor: "Dr. Emily Taylor", room: "Room 205", schedule: "Fri 09:00 - 12:00" },
    { code: "AI-401", instructor: "Dr. Hassan Tariq", room: "AI Lab 1", schedule: "Tue/Thu 14:00 - 15:30" },
  ];

  for (const o of offeringsData) {
    const course = createdCourses[o.code];
    if (course) {
      const [offering] = await CourseOffering.findOrCreate({
        where: { courseId: course.id, termCode: "FA26" },
        defaults: {
          courseId: course.id,
          termCode: "FA26",
          semesterName: "Fall 2026",
          section: "A",
          capacity: 45,
          enrolledCount: 38,
          instructorName: o.instructor,
          room: o.room,
          schedule: o.schedule,
        },
      });

      if (studentProfile && o.code !== "AI-401") {
        await Enrollment.findOrCreate({
          where: { studentId: studentProfile.id, offeringId: offering.id },
          defaults: {
            studentId: studentProfile.id,
            offeringId: offering.id,
            status: "ENROLLED",
            grade: "IP",
            isPassed: false,
          },
        });
      }
    }
  }

  // 8. Seed Fee Challan
  if (studentProfile) {
    await FeeChallan.findOrCreate({
      where: { challanNumber: "CHL-2026-88192" },
      defaults: {
        challanNumber: "CHL-2026-88192",
        studentId: studentProfile.id,
        semesterName: "Fall 2026",
        termCode: "FA26",
        tuitionFee: 2500,
        labFee: 300,
        libraryFee: 150,
        totalAmount: 2950,
        paidAmount: 2950,
        dueDate: "2026-09-15",
        status: "PAID",
        paymentMethod: "ONLINE_GATEWAY",
        transactionRef: "TXN-99812-VISA",
        paidAt: new Date(),
      },
    });
  }

  // 9. Seed Announcements
  const announcementsData = [
    { title: "Fall 2026 Midterm Datesheet Published", content: "The examination controller has finalized the midterm datesheet for all undergraduate departments.", category: "EXAMINATION", priority: "HIGH" },
    { title: "Course Add/Drop Window Closes This Friday", content: "Students are advised to review prerequisite requirements and confirm enrollment sections before the deadline.", category: "ACADEMIC", priority: "MEDIUM" },
    { title: "Campus Career Fair & Tech Showcase 2026", content: "Over 45 enterprise software and engineering companies will be conducting on-campus recruitment interviews.", category: "EVENT", priority: "LOW" },
  ];

  for (const a of announcementsData) {
    await Announcement.findOrCreate({
      where: { title: a.title },
      defaults: a,
    });
  }

  console.log("=========================================");
  console.log("  DATABASE SEEDING COMPLETED (ALL DATA) ");
  console.log("=========================================");
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[Seeder Error]:", err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
