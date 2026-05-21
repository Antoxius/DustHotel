import { Pool } from "pg";

let pool;

function resolveSslConfig() {
  if (process.env.DATABASE_SSL === "disable") {
    return false;
  }

  return { rejectUnauthorized: false };
}

export function getDbPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: resolveSslConfig(),
    });
  }

  return pool;
}
