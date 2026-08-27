const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const ensureDatabaseExists = require("./config/ensureDatabase");
const { sequelize } = require("./models");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const seedRBAC = require("./seeders/rbacSeeder");

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Mount Master API Router
app.use("/api/v1", routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Global Error Handler
app.use(errorHandler);

// Database initialization & server boot
async function bootstrap() {
  try {
    // 1. Ensure PostgreSQL database 'erpc' exists
    await ensureDatabaseExists();

    // 2. Authenticate Sequelize with PostgreSQL
    await sequelize.authenticate();
    console.log("✓ PostgreSQL database connection ('erpc') established successfully.");

    // 3. Sync database models and seed initial standard data
    await seedRBAC();

    app.listen(PORT, () => {
      console.log(`🚀 University ERP Backend Server running on port ${PORT}`);
      console.log(`👉 Health check: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();

module.exports = app;
