const ensureDatabaseExists = require("../config/ensureDatabase");
const {
  sequelize,
  Role,
  Permission,
  RolePermission,
  User,
  Student,
  Department,
  Program,
  DegreeRequirement,
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
  console.log("[Seeder] Starting Department Curricular Schemes & PostgreSQL Database Seeding for 'erpc'...");

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
  console.log("✓ Roles & Granular Permissions verified.");

  // 6. Seed Departments
  const departmentsData = [
    { code: "CS", name: "Department of Computer Science", description: "Computing, Algorithms, AI and Systems" },
    { code: "SE", name: "Department of Software Engineering", description: "Large Scale Software Architecture & DevOps" },
    { code: "AI", name: "Department of Artificial Intelligence", description: "Machine Learning, Robotics and Autonomous Systems" },
    { code: "DS", name: "Department of Data Science", description: "Big Data Analytics, Statistics & Mining" },
    { code: "EE", name: "Department of Electrical Engineering", description: "Circuits, Signal Processing & Embedded Systems" },
    { code: "MS", name: "Department of Management Sciences", description: "Business Administration & Analytics" },
  ];

  const deptMap = {};
  for (const d of departmentsData) {
    const [dept] = await Department.findOrCreate({
      where: { code: d.code },
      defaults: d,
    });
    deptMap[d.code] = dept;
  }
  console.log("✓ 6 Academic Departments verified.");

  // 7. Seed Programs
  const programsData = [
    { deptCode: "CS", code: "BSCS", name: "Bachelor of Science in Computer Science", totalSemesters: 8, totalCreditsRequired: 134 },
    { deptCode: "SE", code: "BSSE", name: "Bachelor of Science in Software Engineering", totalSemesters: 8, totalCreditsRequired: 136 },
    { deptCode: "AI", code: "BSAI", name: "Bachelor of Science in Artificial Intelligence", totalSemesters: 8, totalCreditsRequired: 134 },
    { deptCode: "MS", code: "BBA", name: "Bachelor of Business Administration", totalSemesters: 8, totalCreditsRequired: 130 },
  ];

  const progMap = {};
  for (const pr of programsData) {
    const dept = deptMap[pr.deptCode];
    if (dept) {
      const [prog] = await Program.findOrCreate({
        where: { code: pr.code },
        defaults: {
          departmentId: dept.id,
          name: pr.name,
          code: pr.code,
          degreeLevel: "UNDERGRADUATE",
          totalSemesters: pr.totalSemesters,
          totalCreditsRequired: pr.totalCreditsRequired,
        },
      });
      progMap[pr.code] = prog;
    }
  }
  console.log("✓ Degree Programs verified.");

  // 8. Seed Complete 8-Semester Course Catalog
  const comprehensiveCourses = [
    // Semester 1
    { code: "CS-101", title: "Intro to Computing & Programming", creditHours: 4, lectureHours: 3, labHours: 1, deptCode: "CS", sem: 1 },
    { code: "MT-101", title: "Calculus & Analytical Geometry", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 1 },
    { code: "PH-101", title: "Applied Physics & Circuit Theory", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 1 },
    { code: "HU-101", title: "English Composition & Comprehension", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 1 },
    { code: "PK-101", title: "Pakistan Studies & History", creditHours: 2, lectureHours: 2, labHours: 0, deptCode: "CS", sem: 1 },
    // Semester 2
    { code: "CS-102", title: "Object Oriented Programming (OOP)", creditHours: 4, lectureHours: 3, labHours: 1, deptCode: "CS", sem: 2 },
    { code: "CS-105", title: "Discrete Structures & Logic", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 2 },
    { code: "MT-102", title: "Linear Algebra & Matrix Analysis", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 2 },
    { code: "HU-102", title: "Technical Report Writing", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 2 },
    { code: "IS-101", title: "Islamic Studies & Universal Ethics", creditHours: 2, lectureHours: 2, labHours: 0, deptCode: "CS", sem: 2 },
    // Semester 3
    { code: "CS-201", title: "Data Structures & Algorithms", creditHours: 4, lectureHours: 3, labHours: 1, deptCode: "CS", sem: 3 },
    { code: "CS-203", title: "Digital Logic Design (DLD)", creditHours: 4, lectureHours: 3, labHours: 1, deptCode: "CS", sem: 3 },
    { code: "MT-201", title: "Multivariable Calculus", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 3 },
    { code: "HU-201", title: "Professional & Academic Ethics", creditHours: 2, lectureHours: 2, labHours: 0, deptCode: "CS", sem: 3 },
    // Semester 4
    { code: "CS-210", title: "Design & Analysis of Algorithms", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 4 },
    { code: "CS-220", title: "Database Systems & SQL Modeling", creditHours: 4, lectureHours: 3, labHours: 1, deptCode: "CS", sem: 4 },
    { code: "CS-230", title: "Operating Systems Principles", creditHours: 4, lectureHours: 3, labHours: 1, deptCode: "CS", sem: 4 },
    { code: "MT-202", title: "Probability & Statistical Inference", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 4 },
    // Semester 5
    { code: "CS-301", title: "Theory of Automata & Computation", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 5 },
    { code: "SE-301", title: "Software Engineering & Architecture", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "SE", sem: 5 },
    { code: "CS-320", title: "Computer Networks & Protocols", creditHours: 4, lectureHours: 3, labHours: 1, deptCode: "CS", sem: 5 },
    { code: "CS-330", title: "Artificial Intelligence Fundamentals", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "AI", sem: 5 },
    // Semester 6 (Current Active Term)
    { code: "CS-401", title: "Distributed Computing Systems", creditHours: 4, lectureHours: 3, labHours: 1, deptCode: "CS", sem: 6 },
    { code: "CS-405", title: "Compiler Construction & Design", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 6 },
    { code: "SE-410", title: "Cloud Architecture & Microservices", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "SE", sem: 6 },
    { code: "MT-302", title: "Stochastic Processes & Analytics", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 6 },
    // Semester 7
    { code: "AI-401", title: "Deep Learning & Neural Architectures", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "AI", sem: 7 },
    { code: "CS-420", title: "Cyber Security & Cryptography", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 7 },
    { code: "CS-499A", title: "Senior Capstone Project Part I", creditHours: 3, lectureHours: 0, labHours: 3, deptCode: "CS", sem: 7 },
    { code: "CS-430", title: "Big Data Technologies & Hadoop", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "DS", sem: 7 },
    // Semester 8
    { code: "CS-499B", title: "Senior Capstone Project Part II", creditHours: 3, lectureHours: 0, labHours: 3, deptCode: "CS", sem: 8 },
    { code: "CS-480", title: "High Performance Computing", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "CS", sem: 8 },
    { code: "MG-401", title: "Technology Entrepreneurship", creditHours: 3, lectureHours: 3, labHours: 0, deptCode: "MS", sem: 8 },
  ];

  const courseObjMap = {};
  for (const c of comprehensiveCourses) {
    const dept = deptMap[c.deptCode] || deptMap["CS"];
    const [course] = await Course.findOrCreate({
      where: { code: c.code },
      defaults: {
        code: c.code,
        title: c.title,
        creditHours: c.creditHours,
        lectureHours: c.lectureHours,
        labHours: c.labHours,
        departmentId: dept.id,
      },
    });
    courseObjMap[c.code] = course;

    // Link into Program 8-Semester Degree Requirements
    const bscs = progMap["BSCS"];
    if (bscs) {
      await DegreeRequirement.findOrCreate({
        where: { programId: bscs.id, courseId: course.id },
        defaults: {
          programId: bscs.id,
          courseId: course.id,
          recommendedSemester: c.sem,
          isElective: c.sem >= 7,
          minGradeRequired: "D",
        },
      });
    }
  }
  console.log(`✓ ${comprehensiveCourses.length} Courses mapped into 8-Semester Scheme of Studies.`);

  // 9. Prerequisite DAG Links
  const prereqPairs = [
    { target: "CS-102", prereq: "CS-101" },
    { target: "CS-201", prereq: "CS-102" },
    { target: "CS-210", prereq: "CS-201" },
    { target: "CS-220", prereq: "CS-201" },
    { target: "CS-230", prereq: "CS-201" },
    { target: "CS-301", prereq: "CS-105" },
    { target: "CS-401", prereq: "CS-201" },
    { target: "CS-405", prereq: "CS-301" },
    { target: "SE-410", prereq: "CS-230" },
    { target: "MT-302", prereq: "MT-102" },
    { target: "AI-401", prereq: "CS-330" },
    { target: "CS-499A", prereq: "SE-301" },
    { target: "CS-499B", prereq: "CS-499A" },
  ];

  for (const p of prereqPairs) {
    if (courseObjMap[p.target] && courseObjMap[p.prereq]) {
      await CoursePrerequisite.findOrCreate({
        where: { courseId: courseObjMap[p.target].id, prerequisiteCourseId: courseObjMap[p.prereq].id },
        defaults: { courseId: courseObjMap[p.target].id, prerequisiteCourseId: courseObjMap[p.prereq].id, type: "HARD_PREREQUISITE" },
      });
    }
  }

  // 10. Seed Staff Users
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

  // 11. Seed Faculty Teachers
  const facultyUsers = [
    { email: "teacher@university.edu", firstName: "Sarah", lastName: "Jenkins", employeeId: "EMP-FAC-01" },
    { email: "alan.vance@university.edu", firstName: "Alan", lastName: "Vance", employeeId: "EMP-FAC-02" },
    { email: "michael.chen@university.edu", firstName: "Michael", lastName: "Chen", employeeId: "EMP-FAC-03" },
    { email: "emily.taylor@university.edu", firstName: "Emily", lastName: "Taylor", employeeId: "EMP-FAC-04" },
    { email: "hassan.tariq@university.edu", firstName: "Hassan", lastName: "Tariq", employeeId: "EMP-FAC-05" },
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

  // 12. Seed Students
  const studentsCatalog = [
    { email: "student@university.edu", firstName: "Alex", lastName: "Morgan", regNo: "FA23-BCS-042", rollNo: "042", programName: "BS Computer Science", departmentName: "Computer Science", semester: 6, cgpa: 3.87, credits: 96, standing: "GOOD_STANDING" },
    { email: "zain.ahmed@university.edu", firstName: "Zain", lastName: "Ahmed", regNo: "FA23-BCS-015", rollNo: "015", programName: "BS Computer Science", departmentName: "Computer Science", semester: 6, cgpa: 3.72, credits: 96, standing: "GOOD_STANDING" },
    { email: "ayesha.malik@university.edu", firstName: "Ayesha", lastName: "Malik", regNo: "SP24-BSE-028", rollNo: "028", programName: "BS Software Engineering", departmentName: "Software Engineering", semester: 5, cgpa: 3.94, credits: 80, standing: "GOOD_STANDING" },
    { email: "bilal.khan@university.edu", firstName: "Bilal", lastName: "Khan", regNo: "FA24-BAI-009", rollNo: "009", programName: "BS Artificial Intelligence", departmentName: "Artificial Intelligence", semester: 4, cgpa: 3.65, credits: 64, standing: "GOOD_STANDING" },
    { email: "fatima.noor@university.edu", firstName: "Fatima", lastName: "Noor", regNo: "FA25-BDS-051", rollNo: "051", programName: "BS Data Science", departmentName: "Data Science", semester: 3, cgpa: 3.88, credits: 48, standing: "GOOD_STANDING" },
    { email: "usman.javed@university.edu", firstName: "Usman", lastName: "Javed", regNo: "FA22-BCS-003", rollNo: "003", programName: "BS Computer Science", departmentName: "Computer Science", semester: 8, cgpa: 3.96, credits: 128, standing: "GOOD_STANDING" },
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

    const [profile] = await Student.findOrCreate({
      where: { userId: user.id },
      defaults: {
        userId: user.id,
        regNo: st.regNo,
        rollNo: st.rollNo,
        programName: st.programName,
        departmentName: st.departmentName,
        currentSemester: st.semester,
        section: "A",
        cgpaCache: st.cgpa,
        creditsEarned: st.credits,
        academicStanding: st.standing,
      },
    });

    if (st.email === "student@university.edu") {
      primaryStudentProfile = profile;
    }
  }

  // 13. Seed Course Offerings for Current Semester 6 (FA26)
  const sem6Offerings = [
    { code: "CS-401", instructor: "Dr. Sarah Jenkins", room: "Lab 304", schedule: "Mon/Wed 09:00 - 10:30" },
    { code: "CS-405", instructor: "Prof. Alan Vance", room: "Hall B", schedule: "Tue/Thu 11:00 - 12:30" },
    { code: "SE-410", instructor: "Dr. Michael Chen", room: "Smart Room 102", schedule: "Mon/Wed 14:00 - 15:30" },
    { code: "MT-302", instructor: "Dr. Emily Taylor", room: "Room 205", schedule: "Fri 09:00 - 12:00" },
  ];

  const createdOfferings = {};
  for (const o of sem6Offerings) {
    const course = courseObjMap[o.code];
    if (course) {
      const [offering] = await CourseOffering.findOrCreate({
        where: { courseId: course.id, termCode: "FA26" },
        defaults: {
          courseId: course.id,
          termCode: "FA26",
          semesterName: "Fall 2026",
          section: "A",
          capacity: 50,
          enrolledCount: 38,
          instructorName: o.instructor,
          room: o.room,
          schedule: o.schedule,
          status: "OPEN",
        },
      });
      createdOfferings[o.code] = offering;

      if (primaryStudentProfile) {
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

  // 14. Seed Attendance, Assignments, Quizzes & Challans
  if (primaryStudentProfile && createdOfferings["CS-401"]) {
    const dates = ["2026-08-10", "2026-08-12", "2026-08-17", "2026-08-19", "2026-08-24", "2026-08-26"];
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

    const [asg1] = await Assignment.findOrCreate({
      where: { offeringId: createdOfferings["CS-401"].id, title: "Assignment 1: Raft Consensus Simulator" },
      defaults: {
        offeringId: createdOfferings["CS-401"].id,
        title: "Assignment 1: Raft Consensus Simulator",
        description: "Implement leader election and log replication with fault tolerance.",
        maxMarks: 100,
        dueDate: new Date(Date.now() + 86400000 * 7),
        isPublished: true,
      },
    });

    await AssignmentSubmission.findOrCreate({
      where: { assignmentId: asg1.id, studentId: primaryStudentProfile.id },
      defaults: {
        assignmentId: asg1.id,
        studentId: primaryStudentProfile.id,
        fileUrl: "https://storage.university.edu/submissions/fa23-bcs-042-raft.zip",
        comments: "Implemented cluster leader election and heartbeats.",
        obtainedMarks: 94,
        feedback: "Outstanding implementation.",
        status: "GRADED",
      },
    });

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
        paidAt: new Date("2026-08-20T10:15:00Z"),
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
    { title: "Fall 2026 Curricular Course Allocations Finalized", content: "The Academic Department Coordinator has published the semester 1-8 course schemes of studies and instructor assignments.", category: "ACADEMIC", priority: "HIGH" },
    { title: "Fall 2026 Midterm Datesheet Published", content: "The examination controller has finalized the midterm datesheet for all undergraduate departments.", category: "EXAMINATION", priority: "HIGH" },
    { title: "Campus Career Fair & Tech Showcase 2026", content: "Over 45 enterprise software and engineering companies will be conducting on-campus recruitment interviews.", category: "EVENT", priority: "LOW" },
  ];

  for (const a of announcementsData) {
    await Announcement.findOrCreate({
      where: { title: a.title },
      defaults: a,
    });
  }

  console.log("=======================================================================");
  console.log("  8-SEMESTER SCHEME OF STUDIES & ACADEMIC DATA SEEDED SUCCESSFULLY    ");
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
