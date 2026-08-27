require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "enterprise-university-erp-jwt-secret-key-2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "enterprise-university-erp-refresh-secret-2026",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
};
