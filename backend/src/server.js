// ============================================================================
// 🏛️ APEX UNIVERSITY ERP — BACKEND SERVER ENGINE
// ============================================================================
// High-performance Express.js server engine connecting PostgreSQL (Sequelize),
// RBAC authorization guards, AWS S3 storage, and Cloudinary media microservices.
// ============================================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Configuration & Database
const ensureDatabaseExists = require("./config/ensureDatabase");
const { sequelize } = require("./models");
const seedRBAC = require("./seeders/rbacSeeder");

// Master Routing & Middleware
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

// ============================================================================
// 1. APPLICATION INITIALIZATION & CONFIGURATION
// ============================================================================
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ============================================================================
// 2. GLOBAL SECURITY & REQUEST MIDDLEWARE
// ============================================================================

// Enable Cross-Origin Resource Sharing (CORS) with credential support
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Payload Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// HTTP Request Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ============================================================================
// 3. MASTER API ROUTING MOUNT
// ============================================================================

// Mount Version 1 API Hub
app.use("/api/v1", routes);

// Root Index Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Apex University ERP Backend Core Engine Online",
    docs: "/api/v1/health",
    version: "1.0.0",
  });
});

// ============================================================================
// 4. EXCEPTION HANDLING & NOT-FOUND CATCHERS
// ============================================================================

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Resource endpoint '${req.method} ${req.originalUrl}' does not exist on this server`,
    },
  });
});

// Centralized Global Error Handler Middleware
app.use(errorHandler);

// ============================================================================
// 5. SERVER BOOTLOADER & DATABASE BOOTSTRAP
// ============================================================================

/**
 * Initializes database infrastructure, synchronizes models, seeds initial data,
 * and launches the Express HTTP server listener.
 */
async function bootstrap() {
  try {
    console.log("============================================================");
    console.log("🚀 Starting Apex University ERP Backend Server...");
    console.log("============================================================");

    // 1. Ensure target PostgreSQL database ('erpc') exists
    await ensureDatabaseExists();

    // 2. Establish connection with PostgreSQL via Sequelize
    await sequelize.authenticate();
    console.log("✓ PostgreSQL Database Connection ('erpc') Established Successfully.");

    // 3. Synchronize models & seed baseline RBAC roles, permissions, and demo data
    await seedRBAC();
    console.log("✓ RBAC Roles, Permissions, and Standard Academic Data Synchronized.");

    // 4. Start HTTP Server Listener
    app.listen(PORT, () => {
      console.log("============================================================");
      console.log(`🌐 Server Running On Port : http://localhost:${PORT}`);
      console.log(`📡 API Health Endpoint   : http://localhost:${PORT}/api/v1/health`);
      console.log(`☁️ Storage Microservice   : AWS S3 + Cloudinary CDN Enabled`);
      console.log("============================================================");
    });
  } catch (error) {
    console.error("❌ Fatal Error During Server Boot:", error);
    process.exit(1);
  }
}

// Boot application unless running in unit test context
if (process.env.NODE_ENV !== "test") {
  bootstrap();
}

module.exports = app;
