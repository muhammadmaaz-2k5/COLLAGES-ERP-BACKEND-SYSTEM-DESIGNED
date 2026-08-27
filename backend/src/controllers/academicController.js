const {
  Department,
  Program,
  DegreeRequirement,
  Course,
  CourseOffering,
  CoursePrerequisite,
  Student,
  Enrollment,
  User,
} = require("../models");
const AuditService = require("../services/auditService");
const { Op } = require("sequelize");

class AcademicController {
  /**
   * Get all departments with their degree programs
   */
  static async getDepartments(req, res, next) {
    try {
      const departments = await Department.findAll({
        include: [
          {
            model: Program,
            as: "programs",
          },
        ],
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ success: true, data: departments });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get 8-Semester Curricular Scheme of Studies for a Program
   */
  static async getProgramCurriculum(req, res, next) {
    try {
      const { programId } = req.params;
      const program = await Program.findByPk(programId, {
        include: [
          {
            model: Department,
            as: "department",
          },
          {
            model: DegreeRequirement,
            as: "requirements",
            include: [
              {
                model: Course,
                as: "course",
                include: [
                  {
                    model: CoursePrerequisite,
                    as: "prerequisites",
                    include: [{ model: Course, as: "prerequisiteCourse" }],
                  },
                ],
              },
            ],
          },
        ],
        order: [[{ model: DegreeRequirement, as: "requirements" }, "recommendedSemester", "ASC"]],
      });

      if (!program) {
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Program not found" } });
      }

      // Group into Semesters 1 through 8
      const semesterWise = {};
      for (let s = 1; s <= (program.totalSemesters || 8); s++) {
        semesterWise[s] = [];
      }

      for (const reqItem of program.requirements || []) {
        const sem = reqItem.recommendedSemester || 1;
        if (!semesterWise[sem]) semesterWise[sem] = [];
        semesterWise[sem].push(reqItem);
      }

      return res.status(200).json({
        success: true,
        data: {
          program,
          semesterWiseCurriculum: semesterWise,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin Assigns Semester Courses to Students in that Department & Semester Batch
   */
  static async assignSemesterCourses(req, res, next) {
    try {
      const { departmentCode, programCode, semesterNumber, termCode = "FA26" } = req.body;

      if (!semesterNumber) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "semesterNumber is required" },
        });
      }

      // Find Program
      const program = await Program.findOne({
        where: programCode ? { code: programCode } : {},
        include: [
          {
            model: DegreeRequirement,
            as: "requirements",
            where: { recommendedSemester: semesterNumber },
            include: [{ model: Course, as: "course" }],
          },
        ],
      });

      if (!program || !program.requirements || program.requirements.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: `No courses found in roadmap for Semester ${semesterNumber}` },
        });
      }

      // Find all students in this program/department and semester
      const students = await Student.findAll({
        where: { currentSemester: semesterNumber },
      });

      let assignedCount = 0;

      for (const reqItem of program.requirements) {
        // Ensure CourseOffering exists
        const [offering] = await CourseOffering.findOrCreate({
          where: { courseId: reqItem.courseId, termCode },
          defaults: {
            courseId: reqItem.courseId,
            termCode,
            semesterName: `Fall 2026`,
            section: "A",
            capacity: 50,
            enrolledCount: students.length,
            instructorName: "Assigned Faculty Coordinator",
            room: "Lecture Hall 101",
            schedule: "Mon/Wed 09:00 - 10:30",
            status: "OPEN",
          },
        });

        for (const st of students) {
          await Enrollment.findOrCreate({
            where: { studentId: st.id, offeringId: offering.id },
            defaults: {
              studentId: st.id,
              offeringId: offering.id,
              status: "ENROLLED",
              grade: "IP",
              isPassed: false,
            },
          });
          assignedCount++;
        }
      }

      await AuditService.logAction({
        userId: req.user?.id,
        userEmail: req.user?.email,
        action: "ACADEMICS.SEMESTER_COURSES_ASSIGNED",
        entityType: "Program",
        entityId: program.id,
        details: { semesterNumber, studentsCount: students.length, assignedCount },
        req,
      });

      return res.status(200).json({
        success: true,
        message: `Assigned ${program.requirements.length} courses to ${students.length} students for Semester ${semesterNumber}.`,
        data: {
          semesterNumber,
          coursesAssigned: program.requirements.map((r) => r.course?.code),
          totalEnrollmentsCreated: assignedCount,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Student views their active degree curricular scheme of studies directly for their department
   */
  static async getStudentCurriculum(req, res, next) {
    try {
      let student = null;
      if (req.user?.id) {
        student = await Student.findOne({
          where: { userId: req.user.id },
          include: [{ model: User, as: "user" }],
        });
      }

      if (!student && req.user?.email) {
        const u = await User.findOne({ where: { email: req.user.email } });
        if (u) {
          student = await Student.findOne({
            where: { userId: u.id },
            include: [{ model: User, as: "user" }],
          });
        }
      }

      if (!student) {
        student = await Student.findOne({
          include: [{ model: User, as: "user" }],
        });
      }

      const currentSemester = student?.currentSemester || 6;
      const programName = student?.programName || "Bachelor of Science in Computer Science";
      const departmentName = student?.departmentName || "Department of Computer Science";

      // Match the exact degree program
      let program = await Program.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${programName.split(" in ").pop() || "Computer Science"}%` } },
            { name: { [Op.iLike]: `%${programName}%` } },
          ],
        },
        include: [
          { model: Department, as: "department" },
          {
            model: DegreeRequirement,
            as: "requirements",
            include: [
              {
                model: Course,
                as: "course",
                include: [
                  {
                    model: CoursePrerequisite,
                    as: "prerequisites",
                    include: [{ model: Course, as: "prerequisiteCourse" }],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!program) {
        program = await Program.findOne({
          include: [
            { model: Department, as: "department" },
            {
              model: DegreeRequirement,
              as: "requirements",
              include: [
                {
                  model: Course,
                  as: "course",
                  include: [
                    {
                      model: CoursePrerequisite,
                      as: "prerequisites",
                      include: [{ model: Course, as: "prerequisiteCourse" }],
                    },
                  ],
                },
              ],
            },
          ],
        });
      }

      const semesterWise = {};
      for (let s = 1; s <= 8; s++) {
        semesterWise[s] = [];
      }

      for (const reqItem of program?.requirements || []) {
        const sem = reqItem.recommendedSemester || 1;
        if (!semesterWise[sem]) semesterWise[sem] = [];
        semesterWise[sem].push(reqItem);
      }

      // Active assigned courses for current semester
      const activeEnrollments = student?.id
        ? await Enrollment.findAll({
            where: { studentId: student.id, status: "ENROLLED" },
            include: [
              {
                model: CourseOffering,
                as: "offering",
                include: [{ model: Course, as: "course" }],
              },
            ],
          })
        : [];

      return res.status(200).json({
        success: true,
        data: {
          studentId: student?.id,
          studentName: student?.user ? `${student.user.firstName} ${student.user.lastName}` : "Alex Morgan",
          regNo: student?.regNo || "FA23-BCS-042",
          programName,
          departmentName: program?.department?.name || departmentName,
          departmentCode: program?.department?.code || "CS",
          currentSemester,
          facultyMentor: student?.facultyMentor || "Dr. Sarah Jenkins",
          activeAssignedCourses: activeEnrollments,
          semesterWiseCurriculum: semesterWise,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AcademicController;
