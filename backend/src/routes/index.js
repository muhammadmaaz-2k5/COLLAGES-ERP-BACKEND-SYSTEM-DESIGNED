const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const rbacRoutes = require("./rbacRoutes");
const userRoutes = require("./userRoutes");

// Mount sub-routers
router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);
router.use("/users", userRoutes);

// System Health endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "UP",
      timestamp: new Date().toISOString(),
      service: "University ERP IAM & RBAC Engine",
      version: "1.0.0",
      rolesConfigured: 12,
    },
  });
});

module.exports = router;
