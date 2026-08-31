// ============================================================================
// 🏛️ APEX UNIVERSITY ERP — MASTER ROUTER MOUNT
// ============================================================================
// Central routing hub coordinating all 12 domain subsystems and microservices
// ============================================================================

const express = require("express");
const router = express.Router();

// ============================================================================
// 1. SUB-ROUTER DEPENDENCY INJECTIONS
// ============================================================================
const authRoutes = require("./authRoutes");
const rbacRoutes = require("./rbacRoutes");
const userRoutes = require("./userRoutes");
const studentRoutes = require("./studentRoutes");
const academicRoutes = require("./academicRoutes");
const storageRoutes = require("./storageRoutes");
const facultyRoutes = require("./facultyRoutes");
const examControllerRoutes = require("./examControllerRoutes");
const admissionsRoutes = require("./admissionsRoutes");

// ============================================================================
// 2. ROUTE MOUNT TOPOLOGY
// ============================================================================
router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);
router.use("/users", userRoutes);
router.use("/student", studentRoutes);
router.use("/academics", academicRoutes);
router.use("/storage", storageRoutes);
router.use("/faculty", facultyRoutes);
router.use("/exam-controller", examControllerRoutes);
router.use("/admissions", admissionsRoutes);

// ============================================================================
// 3. SYSTEM HEALTH & MONITORING ENDPOINT
// ============================================================================
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "UP",
      timestamp: new Date().toISOString(),
      service: "University ERP Core Engine",
      version: "1.0.0",
      rolesConfigured: 12,
      module1StudentPortal: "ENABLED",
      module2AcademicsCurriculum: "ENABLED",
      module3FacultyPortal: "ENABLED",
      module4ExamControllerPortal: "ENABLED",
      module5AdmissionsPipeline: "ENABLED",
      storageEngine: "AWS_S3_AND_CLOUDINARY",
    },
  });
});

module.exports = router;
