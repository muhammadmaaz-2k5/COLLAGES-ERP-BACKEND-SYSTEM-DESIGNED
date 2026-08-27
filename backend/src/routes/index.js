const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const rbacRoutes = require("./rbacRoutes");
const userRoutes = require("./userRoutes");
const studentRoutes = require("./studentRoutes");
const academicRoutes = require("./academicRoutes");

// Mount sub-routers
router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);
router.use("/users", userRoutes);
router.use("/student", studentRoutes);
router.use("/academics", academicRoutes);

// System Health endpoint
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
    },
  });
});

module.exports = router;
