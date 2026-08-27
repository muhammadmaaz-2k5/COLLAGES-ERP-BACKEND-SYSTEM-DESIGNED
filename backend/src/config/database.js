const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

const dbUrl = process.env.DATABASE_URL;

if (dbUrl && dbUrl.startsWith("postgres")) {
  sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? false : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: process.env.DB_SSL === "true" ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
  });
} else if (process.env.DB_HOST && process.env.DB_NAME) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "maaz",
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      dialect: "postgres",
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
} else {
  // SQLite zero-config fallback for seamless test execution
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  });
}

module.exports = sequelize;
