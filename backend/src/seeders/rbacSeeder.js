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
  console.log("✓ Operations Staff & Faculty Teachers verified.");

  // 8. Seed Detailed Student Profiles
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
      section: "A",
      cgpa: 3.87,
      credits: 96,
      standing: "GOOD_STANDING",
      gender: "Male",
      dob: "2004-05-14",
      blood: "O+",
      cnic: "42101-9876543-1",
      city: "Capital City",
      address: "House 42, Sector F-8/2, University Avenue",
      emergency: "+1 (555) 234-5678",
      guardian: "Arthur Morgan",
      relation: "Father",
      gPhone: "+1 (555) 987-6543",
      gEmail: "arthur.morgan@parent.university.edu",
      mentor: "Dr. Sarah Jenkins",
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
      section: "A",
      cgpa: 3.72,
      credits: 96,
      standing: "GOOD_STANDING",
      gender: "Male",
      dob: "2004-08-22",
      blood: "A+",
      cnic: "42101-1122334-3",
      city: "Capital City",
      address: "Apartment 14-B, Executive Heights",
      emergency: "+1 (555) 345-6789",
      guardian: "Tariq Ahmed",
      relation: "Father",
      gPhone: "+1 (555) 876-5432",
      gEmail: "tariq.ahmed@parent.university.edu",
      mentor: "Dr. Michael Chen",
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
      section: "B",
      cgpa: 3.94,
      credits: 80,
      standing: "GOOD_STANDING",
      gender: "Female",
      dob: "2004-11-09",
      blood: "B+",
      cnic: "42101-5566778-2",
      city: "Capital City",
      address: "Villa 109, Palm Enclave",
      emergency: "+1 (555) 456-7890",
      guardian: "Kamran Malik",
      relation: "Father",
      gPhone: "+1 (555) 765-4321",
      gEmail: "kamran.malik@parent.university.edu",
      mentor: "Prof. Alan Vance",
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
      section: "A",
      cgpa: 3.65,
      credits: 64,
      standing: "GOOD_STANDING",
      gender: "Male",
      dob: "2005-02-18",
      blood: "AB+",
      cnic: "42101-9988776-5",
      city: "Capital City",
      address: "Street 7, Sector G-11/3",
      emergency: "+1 (555) 567-8901",
      guardian: "Nadeem Khan",
      relation: "Father",
      gPhone: "+1 (555) 654-3210",
      gEmail: "nadeem.khan@parent.university.edu",
      mentor: "Dr. Hassan Tariq",
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
      section: "A",
      cgpa: 3.88,
      credits: 48,
      standing: "GOOD_STANDING",
      gender: "Female",
      dob: "2005-07-30",
      blood: "O-",
      cnic: "42101-4433221-8",
      city: "Capital City",
      address: "House 204, Sector I-8/4",
      emergency: "+1 (555) 678-9012",
      guardian: "Sohail Noor",
      relation: "Father",
      gPhone: "+1 (555) 543-2109",
      gEmail: "sohail.noor@parent.university.edu",
      mentor: "Dr. Emily Taylor",
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
      section: "A",
      cgpa: 3.96,
      credits: 128,
      standing: "GOOD_STANDING",
      gender: "Male",
      dob: "2003-03-12",
      blood: "A+",
      cnic: "42101-1234567-9",
      city: "Capital City",
      address: "House 88, Sector E-7",
      emergency: "+1 (555) 789-0123",
      guardian: "Javed Akhtar",
      relation: "Father",
      gPhone: "+1 (555) 432-1098",
      gEmail: "javed.akhtar@parent.university.edu",
      mentor: "Dr. Sarah Jenkins",
    },
  ];

  const studentProfileMap = {};

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
        section: st.section,
        cgpaCache: st.cgpa,
        creditsEarned: st.credits,
        academicStanding: st.standing,
        gender: st.gender,
        dateOfBirth: st.dob,
        bloodGroup: st.blood,
        cnic: st.cnic,
        permanentAddress: st.address,
        city: st.city,
        emergencyContact: st.emergency,
        guardianName: st.guardian,
        guardianRelation: st.relation,
        guardianPhone: st.gPhone,
        guardianEmail: st.gEmail,
        facultyMentor: st.mentor,
      },
    });

    studentProfileMap[st.email] = profile;
  }
  console.log(`✓ ${studentsCatalog.length} Detailed Student Profiles & Demographics seeded.`);

  // 9. Seed Comprehensive Courses Catalog
  const coursesCatalog = [
    { code: "CS-101", title: "Intro to Computing & Programming", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "MT-101", title: "Calculus & Analytical Geometry", creditHours: 3, lectureHours: 3, labHours: 0, department: "Mathematics" },
    { code: "PH-101", title: "Applied Physics & Circuits", creditHours: 3, lectureHours: 3, labHours: 0, department: "Natural Sciences" },
    { code: "HU-101", title: "English Composition & Comprehension", creditHours: 3, lectureHours: 3, labHours: 0, department: "Humanities" },
    { code: "PK-101", title: "Pakistan Studies & History", creditHours: 2, lectureHours: 2, labHours: 0, department: "Humanities" },
    { code: "CS-102", title: "Object Oriented Programming (OOP)", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-105", title: "Discrete Structures & Logic", creditHours: 3, lectureHours: 3, labHours: 0, department: "Computer Science" },
    { code: "MT-102", title: "Linear Algebra & Matrices", creditHours: 3, lectureHours: 3, labHours: 0, department: "Mathematics" },
    { code: "CS-201", title: "Data Structures & Algorithms", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-203", title: "Digital Logic Design (DLD)", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-210", title: "Design & Analysis of Algorithms", creditHours: 3, lectureHours: 3, labHours: 0, department: "Computer Science" },
    { code: "CS-220", title: "Database Systems & SQL", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-230", title: "Operating Systems Principles", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-301", title: "Theory of Automata & Computation", creditHours: 3, lectureHours: 3, labHours: 0, department: "Computer Science" },
    { code: "SE-301", title: "Software Engineering & Architecture", creditHours: 3, lectureHours: 3, labHours: 0, department: "Software Engineering" },
    { code: "CS-401", title: "Distributed Computing Systems", creditHours: 4, lectureHours: 3, labHours: 1, department: "Computer Science" },
    { code: "CS-405", title: "Compiler Construction & Design", creditHours: 3, lectureHours: 3, labHours: 0, department: "Computer Science" },
    { code: "SE-410", title: "Cloud Architecture & Microservices", creditHours: 3, lectureHours: 3, labHours: 0, department: "Software Engineering" },
    { code: "MT-302", title: "Stochastic Processes & Analytics", creditHours: 3, lectureHours: 3, labHours: 0, department: "Mathematics" },
    { code: "AI-401", title: "Deep Learning & Neural Architectures", creditHours: 3, lectureHours: 3, labHours: 0, department: "Artificial Intelligence" },
    { code: "CS-499", title: "Senior Capstone Project", creditHours: 6, lectureHours: 0, labHours: 6, department: "Computer Science" },
  ];

  const createdCourses = {};
  for (const c of coursesCatalog) {
    const [course] = await Course.findOrCreate({
      where: { code: c.code },
      defaults: c,
    });
    createdCourses[c.code] = course;
  }

  // Prerequisite DAG Relations
  const prereqPairs = [
    { target: "CS-102", prereq: "CS-101" },
    { target: "CS-201", prereq: "CS-102" },
    { target: "CS-210", prereq: "CS-201" },
    { target: "CS-401", prereq: "CS-201" },
    { target: "CS-405", prereq: "CS-301" },
    { target: "SE-410", prereq: "CS-230" },
    { target: "MT-302", prereq: "MT-102" },
    { target: "CS-499", prereq: "SE-301" },
  ];

  for (const p of prereqPairs) {
    if (createdCourses[p.target] && createdCourses[p.prereq]) {
      await CoursePrerequisite.findOrCreate({
        where: { courseId: createdCourses[p.target].id, prerequisiteCourseId: createdCourses[p.prereq].id },
        defaults: { courseId: createdCourses[p.target].id, prerequisiteCourseId: createdCourses[p.prereq].id, type: "HARD_PREREQUISITE" },
      });
    }
  }
  console.log("✓ 21 Courses & Prerequisite DAGs verified.");

  // 10. Seed Course Offerings across Terms
  const offerings = [
    // Current Term Fall 2026
    { code: "CS-401", term: "FA26", semName: "Fall 2026", instructor: "Dr. Sarah Jenkins", room: "Lab 304", schedule: "Mon/Wed 09:00 - 10:30" },
    { code: "CS-405", term: "FA26", semName: "Fall 2026", instructor: "Prof. Alan Vance", room: "Hall B", schedule: "Tue/Thu 11:00 - 12:30" },
    { code: "SE-410", term: "FA26", semName: "Fall 2026", instructor: "Dr. Michael Chen", room: "Smart Room 102", schedule: "Mon/Wed 14:00 - 15:30" },
    { code: "MT-302", term: "FA26", semName: "Fall 2026", instructor: "Dr. Emily Taylor", room: "Room 205", schedule: "Fri 09:00 - 12:00" },
    { code: "AI-401", term: "FA26", semName: "Fall 2026", instructor: "Dr. Hassan Tariq", room: "AI Lab 1", schedule: "Tue/Thu 14:00 - 15:30" },
    { code: "CS-499", term: "FA26", semName: "Fall 2026", instructor: "Faculty Board", room: "Project Lab", schedule: "Arranged with Advisor" },
    // Past Term Fall 2023
    { code: "CS-101", term: "FA23", semName: "Fall 2023", instructor: "Dr. Sarah Jenkins", room: "Hall A", schedule: "Mon/Wed 09:00 - 10:30" },
    { code: "MT-101", term: "FA23", semName: "Fall 2023", instructor: "Dr. Emily Taylor", room: "Room 101", schedule: "Tue/Thu 09:00 - 10:30" },
    // Past Term Spring 2024
    { code: "CS-102", term: "SP24", semName: "Spring 2024", instructor: "Prof. Alan Vance", room: "Lab 201", schedule: "Mon/Wed 11:00 - 12:30" },
    { code: "CS-105", term: "SP24", semName: "Spring 2024", instructor: "Dr. Michael Chen", room: "Room 302", schedule: "Tue/Thu 11:00 - 12:30" },
  ];

  const createdOfferings = {};
  for (const o of offerings) {
    const course = createdCourses[o.code];
    if (course) {
      const key = `${o.code}_${o.term}`;
      const [offering] = await CourseOffering.findOrCreate({
        where: { courseId: course.id, termCode: o.term },
        defaults: {
          courseId: course.id,
          termCode: o.term,
          semesterName: o.semName,
          section: "A",
          capacity: 45,
          enrolledCount: 38,
          instructorName: o.instructor,
          room: o.room,
          schedule: o.schedule,
          status: "OPEN",
        },
      });
      createdOfferings[key] = offering;
    }
  }

  // 11. Seed Detailed Multi-Semester Enrollments for Students
  const primaryStudent = studentProfileMap["student@university.edu"];
  if (primaryStudent) {
    // Current Active Enrollments
    const activeKeys = ["CS-401_FA26", "CS-405_FA26", "SE-410_FA26", "MT-302_FA26"];
    for (const k of activeKeys) {
      if (createdOfferings[k]) {
        await Enrollment.findOrCreate({
          where: { studentId: primaryStudent.id, offeringId: createdOfferings[k].id },
          defaults: {
            studentId: primaryStudent.id,
            offeringId: createdOfferings[k].id,
            status: "ENROLLED",
            grade: "IP",
            isPassed: false,
          },
        });
      }
    }

    // Past Completed Enrollments
    const pastEnrollments = [
      { key: "CS-101_FA23", grade: "A", gp: 4.0, marks: 94, passed: true },
      { key: "MT-101_FA23", grade: "A-", gp: 3.67, marks: 87, passed: true },
      { key: "CS-102_SP24", grade: "A", gp: 4.0, marks: 95, passed: true },
      { key: "CS-105_SP24", grade: "A", gp: 4.0, marks: 91, passed: true },
    ];

    for (const pe of pastEnrollments) {
      if (createdOfferings[pe.key]) {
        await Enrollment.findOrCreate({
          where: { studentId: primaryStudent.id, offeringId: createdOfferings[pe.key].id },
          defaults: {
            studentId: primaryStudent.id,
            offeringId: createdOfferings[pe.key].id,
            status: "COMPLETED",
            grade: pe.grade,
            gradePoint: pe.gp,
            totalMarks: pe.marks,
            isPassed: pe.passed,
          },
        });
      }
    }
  }

  // 12. Seed Detailed Attendance Records
  if (primaryStudent && createdOfferings["CS-401_FA26"]) {
    const dates = [
      { date: "2026-08-10", status: "PRESENT" },
      { date: "2026-08-12", status: "PRESENT" },
      { date: "2026-08-17", status: "PRESENT" },
      { date: "2026-08-19", status: "PRESENT" },
      { date: "2026-08-24", status: "PRESENT" },
      { date: "2026-08-26", status: "PRESENT" },
    ];

    for (const d of dates) {
      await Attendance.findOrCreate({
        where: { studentId: primaryStudent.id, offeringId: createdOfferings["CS-401_FA26"].id, date: d.date },
        defaults: {
          studentId: primaryStudent.id,
          offeringId: createdOfferings["CS-401_FA26"].id,
          date: d.date,
          status: d.status,
          remarks: "Regular lecture attendance",
        },
      });
    }
  }

  // 13. Seed Detailed Coursework Assignments & Submissions
  if (createdOfferings["CS-401_FA26"]) {
    const [asg1] = await Assignment.findOrCreate({
      where: { offeringId: createdOfferings["CS-401_FA26"].id, title: "Assignment 1: Raft Consensus Algorithm Simulator" },
      defaults: {
        offeringId: createdOfferings["CS-401_FA26"].id,
        title: "Assignment 1: Raft Consensus Algorithm Simulator",
        description: "Implement leader election, term numbering, and heartbeat timer in Go/TypeScript.",
        maxMarks: 100,
        dueDate: new Date(Date.now() + 86400000 * 7),
        isPublished: true,
      },
    });

    if (primaryStudent) {
      await AssignmentSubmission.findOrCreate({
        where: { assignmentId: asg1.id, studentId: primaryStudent.id },
        defaults: {
          assignmentId: asg1.id,
          studentId: primaryStudent.id,
          fileUrl: "https://storage.university.edu/submissions/fa23-bcs-042-raft.zip",
          comments: "Implemented 3-node cluster leader election with heartbeats and unit tests.",
          obtainedMarks: 94,
          feedback: "Outstanding implementation of leader election and log replication.",
          status: "GRADED",
        },
      });
    }
  }

  if (createdOfferings["CS-405_FA26"]) {
    const [asg2] = await Assignment.findOrCreate({
      where: { offeringId: createdOfferings["CS-405_FA26"].id, title: "Assignment 2: Lexical Analyzer & Parser Generator" },
      defaults: {
        offeringId: createdOfferings["CS-405_FA26"].id,
        title: "Assignment 2: Lexical Analyzer & Parser Generator",
        description: "Build a Flex/Bison compiler front-end for the C-Minus language syntax.",
        maxMarks: 100,
        dueDate: new Date(Date.now() + 86400000 * 14),
        isPublished: true,
      },
    });

    if (primaryStudent) {
      await AssignmentSubmission.findOrCreate({
        where: { assignmentId: asg2.id, studentId: primaryStudent.id },
        defaults: {
          assignmentId: asg2.id,
          studentId: primaryStudent.id,
          fileUrl: "https://storage.university.edu/submissions/fa23-bcs-042-compiler.zip",
          comments: "Grammar rules and precedence disambiguation resolved.",
          status: "SUBMITTED",
        },
      });
    }
  }

  // 14. Seed Quizzes & Attempts
  if (createdOfferings["CS-401_FA26"]) {
    const [qz1] = await Quiz.findOrCreate({
      where: { offeringId: createdOfferings["CS-401_FA26"].id, title: "Quiz 1: CAP Theorem & Vector Clocks" },
      defaults: {
        offeringId: createdOfferings["CS-401_FA26"].id,
        title: "Quiz 1: CAP Theorem & Vector Clocks",
        durationMinutes: 20,
        totalMarks: 20,
        totalQuestions: 10,
        startTime: new Date(Date.now() - 86400000 * 3),
        endTime: new Date(Date.now() + 86400000 * 5),
        isPublished: true,
      },
    });

    if (primaryStudent) {
      await QuizAttempt.findOrCreate({
        where: { quizId: qz1.id, studentId: primaryStudent.id },
        defaults: {
          quizId: qz1.id,
          studentId: primaryStudent.id,
          score: 19,
          totalMarks: 20,
          status: "SUBMITTED",
        },
      });
    }
  }

  if (createdOfferings["CS-405_FA26"]) {
    await Quiz.findOrCreate({
      where: { offeringId: createdOfferings["CS-405_FA26"].id, title: "Quiz 2: Context-Free Grammars & LL(1) Tables" },
      defaults: {
        offeringId: createdOfferings["CS-405_FA26"].id,
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

  // 15. Seed Multi-Term Fee Challans in PostgreSQL
  if (primaryStudent) {
    // Current Term Fall 2026 Challan
    await FeeChallan.findOrCreate({
      where: { challanNumber: "CHL-2026-88192" },
      defaults: {
        challanNumber: "CHL-2026-88192",
        studentId: primaryStudent.id,
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

    // Past Spring 2026 Challan
    await FeeChallan.findOrCreate({
      where: { challanNumber: "CHL-2026-34211" },
      defaults: {
        challanNumber: "CHL-2026-34211",
        studentId: primaryStudent.id,
        semesterName: "Spring 2026",
        termCode: "SP26",
        tuitionFee: 2400,
        labFee: 300,
        libraryFee: 150,
        totalAmount: 2850,
        paidAmount: 2850,
        dueDate: "2026-02-15",
        status: "PAID",
        paymentMethod: "BANK_TRANSFER",
        transactionRef: "FT-44109-HBL",
        paidAt: new Date("2026-02-10T14:30:00Z"),
      },
    });
  }

  // 16. Seed Exam Schedules
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

  // 17. Seed Announcements
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
  console.log("  ALL DETAILED STUDENT DATA SEEDED SUCCESSFULLY IN POSTGRESQL (erpc)  ");
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
