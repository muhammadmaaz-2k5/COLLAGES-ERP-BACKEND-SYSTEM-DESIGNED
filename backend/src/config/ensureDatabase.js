const { Client } = require("pg");
require("dotenv").config();

/**
 * Checks if the target PostgreSQL database exists; if not, creates it automatically.
 */
async function ensureDatabaseExists() {
  const dbName = process.env.DB_NAME || "erpc";
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "maaz";
  const host = process.env.DB_HOST || "localhost";
  const port = Number(process.env.DB_PORT) || 5432;

  // Connect to default 'postgres' database
  const client = new Client({
    user,
    password,
    host,
    port,
    database: "postgres",
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`[PostgreSQL] Database "${dbName}" not found. Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[PostgreSQL] ✓ Database "${dbName}" created successfully.`);
    } else {
      console.log(`[PostgreSQL] ✓ Database "${dbName}" exists.`);
    }
  } catch (err) {
    console.warn(`[PostgreSQL Check Warning]: ${err.message}`);
  } finally {
    await client.end().catch(() => {});
  }
}

module.exports = ensureDatabaseExists;
