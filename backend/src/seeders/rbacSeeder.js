const ensureDatabaseExists = require("../config/ensureDatabase");
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
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizAttempt,
  FeeChallan,
  ExamSchedule,
  Announcement,
} = require("../models");
const { SystemRoles, RoleHierarchyWeight } = require("../constants/roles");
const { PermissionCatalog, DefaultRolePermissions } = require("../constants/permissions");

async function seedDatabase() {
  console.log("[Seeder] Starting Comprehensive PostgreSQL Database Seeding for 'erpc'...");

  // 1. Ensure PostgreSQL database exists
  await ensureDatabaseExists();

  // 2. Synchronize database tables
  await sequelize.sync({ force: false, alter: true });
  console.log("✓ Database schema synchronized on PostgreSQL (erpc).");

  // 3. Seed Roles
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

  // 4. Seed Permissions
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

  // 5. Seed Role-Permission Matrix
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

  // 6. Seed Administrative & Faculty Staff Users
  const staffUsers = [
    { email: "superadmin@university.edu", firstName: "Super", lastName: "Administrator", roleCode: SystemRoles.SUPER_ADMIN },
    { email: "admin@university.edu", firstName: "Campus", lastName: "Admin", roleCode: SystemRoles.ADMIN },
    { email: "examcontroller@university.edu", firstName: "Arthur", lastName: "Pendleton", roleCode: SystemRoles.EXAM_CONTROLLER, employeeId: "EMP-EXM-01" },
    { email: "accountant@university.edu", firstName: "Robert", lastName: "Sterling", roleCode: SystemRoles.ACCOUNTANT, employeeId: "EMP-FIN-01" },
    { email: "librarian@university.edu", firstName: "Emily", lastName: "Blunt", roleCode: SystemRoles.LIBRARIAN, employeeId: "EMP-LIB-01" },
    { email: "hrmanager@university.edu", firstName: "David", lastName: "Hassel", roleCode: SystemRoles.HR_MANAGER, employeeId: "EMP-HR-01" },
    { email: "warden@university.edu", firstName: "Marcus", lastName: "Vance", roleCode: SystemRoles.WARDEN, employeeId: "EMP-HST-01" },
    { email: "driver@university.edu", firstName: "James", lastName: "Miller", roleCode: SystemRoles.DRIVER, employeeId: "EMP-DRV-01" },
    { email: "admissions@university.edu", firstName: "Clara", lastName: "Oswald", roleCode: SystemRoles.ADMISSIONS_OFFICER, employeeId: "EMP-ADM-01" },
    { email: "staff@university.edu", firstName: "Hannah", lastName: "Abbott", roleCode: SystemRoles.STAFF, employeeId: "EMP-STF-01" },
  ];

  for (const s of staffUsers) {
    await User.findOrCreate({
      where: { email: s.email },
      defaults: {
        email: s.email,
        passwordHash: "Password123!",
        firstName: s.firstName,
        lastName: s.lastName,
        roleCode: s.roleCode,
        employeeId: s.employeeId,
      },
    });
  }
  console.log("✓ Administrative & Operations Users seeded.");

  // 7. Seed Faculty / Teachers
  const facultyUsers = [
    { email: "teacher@university.edu", firstName: "Sarah", lastName: "Jenkins", department: "Computer Science", employeeId: "EMP-FAC-01" },
    { email: "alan.vance@university.edu", firstName: "Alan", lastName: "Vance", department: "Software Engineering", employeeId: "EMP-FAC-02" },
    { email: "michael.chen@university.edu", firstName: "Michael", lastName: "Chen", department: "Computer Science", employeeId: "EMP-FAC-03" },
    { email: "emily.taylor@university.edu", firstName: "Emily", lastName: "Taylor", department: "Mathematics", employeeId: "EMP-FAC-04" },
    { email: "hassan.tariq@university.edu", firstName: "Hassan", lastName: "Tariq", department: "Artificial Intelligence", employeeId: "EMP-FAC-05" },
  ];

  for (const f of facultyUsers) {
    await User.findOrCreate({
      where: { email: f.email },
      defaults: {
        email: f.email,
        passwordHash: "Password123!",
        firstName: f.firstName,
        lastName: f.lastName,
        roleCode: SystemRoles.TEACHER,
        employeeId: f.employeeId,
      },
    });
  }
  console.log(`✓ ${facultyUsers.length} Faculty Teachers seeded.`);

  // 8. Seed All Students across Degrees & Semesters
  const studentsCatalog = [
    {
      email: "student@university.edu",
      firstName: "Alex",
      lastName: "Morgan",
      regNo: "FA23-BCS-042",
      rollNo: "042",
      programName: "BS Computer Science",
      departmentName: "Computer Science & Engineering",
      semester: 6,
      cgpa: 3.87,
      credits: 96,
      standing: "GOOD_STANDING",
    },
    {
      email: "zain.ahmed@university.edu",
      firstName: "Zain",
      lastName: "Ahmed",
      regNo: "FA23-BCS-015",
      rollNo: "015",
      programName: "BS Computer Science",
      departmentName: "Computer Science & Engineering",
      semester: 6,
      cgpa: 3.72,
      credits: 96,
      standing: "GOOD_STANDING",
    },
    {
      email: "ayesha.malik@university.edu",
      firstName: "Ayesha",
      lastName: "Malik",
      regNo: "SP24-BSE-028",
      rollNo: "028",
      programName: "BS Software Engineering",
      departmentName: "Software Engineering",
      semester: 5,
      cgpa: 3.94,
      credits: 80,
      standing: "GOOD_STANDING",
    },
    {
      email: "bilal.khan@university.edu",
      firstName: "Bilal",
      lastName: "Khan",
      regNo: "FA24-BAI-009",
      rollNo: "009",
      programName: "BS Artificial Intelligence",
      departmentName: "Artificial Intelligence",
      semester: 4,
      cgpa: 3.65,
      credits: 64,
      standing: "GOOD_STANDING",
    },
    {
      email: "fatima.noor@university.edu",
      firstName: "Fatima",
      lastName: "Noor",
      regNo: "FA25-BDS-051",
      rollNo: "051",
      programName: "BS Data Science",
      departmentName: "Data Science",
      semester: 3,
      cgpa: 3.88,
      credits: 48,
      standing: "GOOD_STANDING",
    },
    {
      email: "hamza.tariq@university.edu",
      firstName: "Hamza",
      lastName: "Tariq",
      regNo: "SP25-BCY-019",
      rollNo: "019",
      programName: "BS Cyber Security",
      departmentName: "Computer Science",
      semester: 2,
      cgpa: 3.58,
      credits: 32,
      standing: "GOOD_STANDING",
    },
    {
      email: "sara.siddiqui@university.edu",
      firstName: "Sara",
      lastName: "Siddiqui",
      regNo: "FA25-BEE-034",
      rollNo: "034",
      programName: "BS Electrical Engineering",
      departmentName: "Electrical Engineering",
      semester: 2,
      cgpa: 3.81,
      credits: 34,
      standing: "GOOD_STANDING",
    },
    {
      email: "usman.javed@university.edu",
      firstName: "Usman",
      lastName: "Javed",
      regNo: "FA22-BCS-003",
      rollNo: "003",
      programName: "BS Computer Science",
      departmentName: "Computer Science & Engineering",
      semester: 8,
      cgpa: 3.96,
      credits: 128,
      standing: "GOOD_STANDING",
    },
    {
      email: "mahnoor.raza@university.edu",
      firstName: "Mahnoor",
      lastName: "Raza",
      regNo: "FA24-BBA-012",
      rollNo: "012",
      programName: "BBA Business Administration",
      departmentName: "Management Sciences",
      semester: 4,
      cgpa: 3.69,
      credits: 62,
      standing: "GOOD_STANDING",
    },
    {
      email: "daniyal.shah@university.edu",
      firstName: "Daniyal",
      lastName: "Shah",
      regNo: "SP23-BSE-044",
      rollNo: "044",
      programName: "BS Software Engineering",
      departmentName: "Software Engineering",
      semester: 7,
      cgpa: 3.45,
      credits: 112,
      standing: "GOOD_STANDING",
    },
    {
      email: "anum.tariq@university.edu",
      firstName: "Anum",
      lastName: "Tariq",
      regNo: "FA23-BAI-021",
      rollNo: "021",
      programName: "BS Artificial Intelligence",
      departmentName: "Artificial Intelligence",
      semester: 6,
      cgpa: 3.91,
      credits: 96,
      standing: "GOOD_STANDING",
    },
    {
      email: "farhan.ali@university.edu",
      firstName: "Farhan",
      lastName: "Ali",
      regNo: "FA25-BCS-088",
      rollNo: "088",
      programName: "BS Computer Science",
      departmentName: "Computer Science",
      semester: 2,
      cgpa: 3.76,
      credits: 32,
      standing: "GOOD_STANDING",
    },
  ];

  let primaryStudentProfile = null;

  for (const st of studentsCatalog) {
    const [user] = await User.findOrCreate({
      where: { email: st.email },
      defaults: {
        email: st.email,
        passwordHash: "Password123!",
        firstName: st.firstName,
        lastName: st.lastName,
        roleCode: SystemRoles.STUDENT,
        studentId: st.regNo,
      },
    });

    const [studentProfile] = await Student.findOrCreate({
      where: { userId: user.id },
      defaults: {
        userId: user.id,
        regNo: st.regNo,
        rollNo: st.rollNo,
        programName: st.programName,
        departmentName: st.departmentName,
        currentSemester: st.semester,
        cgpaCache: st.cgpa,
        creditsEarned: st.credits,
        academicStanding: st.standing,
      },
    });

    if (st.email === "student@university.edu") {
      primaryStudentProfile = studentProfile;
    }
  }
  console.log(`✓ ${studentsCatalog.length} Student Profiles & User Accounts seeded in PostgreSQL.`);

  // 9. Seed Courses & Prerequisite DAG
  const coursesData = [
    { code: "CS-101", title: "Intro to Programming", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-102", title: "Object Oriented Programming", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-201", title: "Data Structures & Algorithms", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-210", title: "Design & Analysis of Algorithms", creditHours: 3, lectureHours: 3, labHours: 0, department: "Computer Science" },
    { code: "CS-220", title: "Database Systems", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-301", title: "Theory of Automata & Computation", creditHours: 3, lectureHours: 3, labHours: 0, department: "Computer Science" },
    { code: "CS-401", title: "Distributed Computing Systems", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-405", title: "Compiler Construction & Design", creditHours: 3, lectureHours: 3, labHours: 0, department: "Computer Science" },
    { code: "SE-410", title: "Cloud Architecture & Microservices", creditHours: 3, lectureHours: 3, labHours: 0, department: "Software Engineering" },
    { code: "MT-302", title: "Stochastic Processes & Analytics", creditHours: 3, lectureHours: 3, labHours: 0, department: "Mathematics" },
    { code: "AI-401", title: "Deep Learning & Neural Architectures", creditHours: 3, lectureHours: 3, labHours: 0, department: "Artificial Intelligence" },
    { code: "CS-499", title: "Senior Capstone Project", creditHours: 6, lectureHours: 0, labHours: 6, department: "Computer Science" },
  ];

  const createdCourses = {};
  for (const c of coursesData) {
    const [course] = await Course.findOrCreate({
      where: { code: c.code },
      defaults: c,
    });
    createdCourses[c.code] = course;
  }

  // Prerequisite DAG Relations
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
  if (createdCourses["CS-405"] && createdCourses["CS-301"]) {
    await CoursePrerequisite.findOrCreate({
      where: { courseId: createdCourses["CS-405"].id, prerequisiteCourseId: createdCourses["CS-301"].id },
      defaults: { courseId: createdCourses["CS-405"].id, prerequisiteCourseId: createdCourses["CS-301"].id, type: "HARD_PREREQUISITE" },
    });
  }
  console.log("✓ Course Catalog & Prerequisite DAG seeded.");

  // 10. Seed Course Offerings
  const offeringsData = [
    { code: "CS-401", instructor: "Dr. Sarah Jenkins", room: "Lab 304", schedule: "Mon/Wed 09:00 - 10:30" },
    { code: "CS-405", instructor: "Prof. Alan Vance", room: "Hall B", schedule: "Tue/Thu 11:00 - 12:30" },
    { code: "SE-410", instructor: "Dr. Michael Chen", room: "Smart Room 102", schedule: "Mon/Wed 14:00 - 15:30" },
    { code: "MT-302", instructor: "Dr. Emily Taylor", room: "Room 205", schedule: "Fri 09:00 - 12:00" },
    { code: "AI-401", instructor: "Dr. Hassan Tariq", room: "AI Lab 1", schedule: "Tue/Thu 14:00 - 15:30" },
    { code: "CS-499", instructor: "Department Board", room: "Project Lab", schedule: "Arranged with Advisor" },
  ];

  const createdOfferings = {};
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
          status: "OPEN",
        },
      });
      createdOfferings[o.code] = offering;

      if (primaryStudentProfile && o.code !== "AI-401" && o.code !== "CS-499") {
        await Enrollment.findOrCreate({
          where: { studentId: primaryStudentProfile.id, offeringId: offering.id },
          defaults: {
            studentId: primaryStudentProfile.id,
            offeringId: offering.id,
            status: "ENROLLED",
            grade: "IP",
            isPassed: false,
          },
        });
      }
    }
  }

  // 11. Seed Attendance
  if (primaryStudentProfile && createdOfferings["CS-401"]) {
    const dates = ["2026-08-18", "2026-08-20", "2026-08-22", "2026-08-25", "2026-08-27"];
    for (const d of dates) {
      await Attendance.findOrCreate({
        where: { studentId: primaryStudentProfile.id, offeringId: createdOfferings["CS-401"].id, date: d },
        defaults: {
          studentId: primaryStudentProfile.id,
          offeringId: createdOfferings["CS-401"].id,
          date: d,
          status: "PRESENT",
          remarks: "Regular lecture attendance",
        },
      });
    }
  }

  // 12. Seed Assignments & Submissions
  if (createdOfferings["CS-401"]) {
    const [asg1] = await Assignment.findOrCreate({
      where: { offeringId: createdOfferings["CS-401"].id, title: "Assignment 1: Raft Consensus Algorithm Simulator" },
      defaults: {
        offeringId: createdOfferings["CS-401"].id,
        title: "Assignment 1: Raft Consensus Algorithm Simulator",
        description: "Implement leader election and log replication with fault tolerance.",
        maxMarks: 100,
        dueDate: new Date(Date.now() + 86400000 * 7),
        isPublished: true,
      },
    });

    if (primaryStudentProfile) {
      await AssignmentSubmission.findOrCreate({
        where: { assignmentId: asg1.id, studentId: primaryStudentProfile.id },
        defaults: {
          assignmentId: asg1.id,
          studentId: primaryStudentProfile.id,
          fileUrl: "https://storage.university.edu/submissions/fa23-bcs-042-raft.zip",
          comments: "Implemented 3-node cluster leader election with heartbeats.",
          obtainedMarks: 94,
          feedback: "Excellent implementation and state machine testing.",
          status: "GRADED",
        },
      });
    }
  }

  if (createdOfferings["CS-405"]) {
    const [asg2] = await Assignment.findOrCreate({
      where: { offeringId: createdOfferings["CS-405"].id, title: "Assignment 2: Lexical Analyzer & Parser Generator" },
      defaults: {
        offeringId: createdOfferings["CS-405"].id,
        title: "Assignment 2: Lexical Analyzer & Parser Generator",
        description: "Build a Flex/Bison compiler front-end for the C-Minus language.",
        maxMarks: 100,
        dueDate: new Date(Date.now() + 86400000 * 14),
        isPublished: true,
      },
    });

    if (primaryStudentProfile) {
      await AssignmentSubmission.findOrCreate({
        where: { assignmentId: asg2.id, studentId: primaryStudentProfile.id },
        defaults: {
          assignmentId: asg2.id,
          studentId: primaryStudentProfile.id,
          fileUrl: "https://storage.university.edu/submissions/fa23-bcs-042-compiler.zip",
          comments: "Tokens defined and CFG ambiguity resolved.",
          status: "SUBMITTED",
        },
      });
    }
  }

  // 13. Seed Quizzes
  if (createdOfferings["CS-401"]) {
    const [qz1] = await Quiz.findOrCreate({
      where: { offeringId: createdOfferings["CS-401"].id, title: "Quiz 1: CAP Theorem & Vector Clocks" },
      defaults: {
        offeringId: createdOfferings["CS-401"].id,
        title: "Quiz 1: CAP Theorem & Vector Clocks",
        durationMinutes: 20,
        totalMarks: 20,
        totalQuestions: 10,
        startTime: new Date(Date.now() - 86400000 * 3),
        endTime: new Date(Date.now() + 86400000 * 5),
        isPublished: true,
      },
    });

    if (primaryStudentProfile) {
      await QuizAttempt.findOrCreate({
        where: { quizId: qz1.id, studentId: primaryStudentProfile.id },
        defaults: {
          quizId: qz1.id,
          studentId: primaryStudentProfile.id,
          score: 19,
          totalMarks: 20,
          status: "SUBMITTED",
        },
      });
    }
  }

  if (createdOfferings["CS-405"]) {
    await Quiz.findOrCreate({
      where: { offeringId: createdOfferings["CS-405"].id, title: "Quiz 2: Context-Free Grammars & LL(1) Tables" },
      defaults: {
        offeringId: createdOfferings["CS-405"].id,
        title: "Quiz 2: Context-Free Grammars & LL(1) Tables",
        durationMinutes: 25,
        totalMarks: 25,
        totalQuestions: 12,
        startTime: new Date(Date.now() - 86400000),
        endTime: new Date(Date.now() + 86400000 * 10),
        isPublished: true,
      },
    });
  }

  // 14. Seed Fee Challans
  if (primaryStudentProfile) {
    await FeeChallan.findOrCreate({
      where: { challanNumber: "CHL-2026-88192" },
      defaults: {
        challanNumber: "CHL-2026-88192",
        studentId: primaryStudentProfile.id,
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

  // 15. Seed Exam Schedules
  const examDates = [
    { code: "CS-401", title: "Distributed Computing Systems", date: "2026-10-12", time: "09:00 AM - 12:00 PM", room: "Exam Hall A", seat: "HA-042", inv: "Prof. Arthur Pendleton" },
    { code: "CS-405", title: "Compiler Construction & Design", date: "2026-10-15", time: "09:00 AM - 12:00 PM", room: "Exam Hall B", seat: "HB-018", inv: "Dr. Emily Blunt" },
    { code: "SE-410", title: "Cloud Architecture & Microservices", date: "2026-10-18", time: "02:00 PM - 05:00 PM", room: "Exam Hall A", seat: "HA-042", inv: "Dr. Sarah Jenkins" },
    { code: "MT-302", title: "Stochastic Processes & Analytics", date: "2026-10-21", time: "09:00 AM - 12:00 PM", room: "Room 205", seat: "R2-009", inv: "Prof. Marcus Vance" },
  ];

  for (const ex of examDates) {
    await ExamSchedule.findOrCreate({
      where: { courseCode: ex.code, termName: "Fall 2026 Midterm Examination" },
      defaults: {
        termName: "Fall 2026 Midterm Examination",
        courseCode: ex.code,
        courseName: ex.title,
        examDate: ex.date,
        startTime: ex.time.split(" - ")[0],
        endTime: ex.time.split(" - ")[1],
        room: ex.room,
        seatNumber: ex.seat,
        invigilator: ex.inv,
      },
    });
  }

  // 16. Seed Announcements
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

  console.log("=======================================================================");
  console.log("  ALL STUDENTS & ALL USERS SEEDED SUCCESSFULLY IN POSTGRESQL (erpc)   ");
  console.log("=======================================================================");
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
