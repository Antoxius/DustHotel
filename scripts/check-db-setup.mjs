import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });
config();

function printMissingEnv() {
  const missing = [];

  if (!process.env.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }

  if (missing.length > 0) {
    console.error(`Manglende env variabler: ${missing.join(", ")}`);
    process.exit(1);
  }
}

function resolveSslConfig() {
  if (process.env.DATABASE_SSL === "disable") {
    return false;
  }

  return { rejectUnauthorized: false };
}

async function run() {
  printMissingEnv();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: resolveSslConfig(),
  });

  await client.connect();

  const ping = await client.query("SELECT NOW() AS now");
  console.log(`Database forbindelse OK: ${ping.rows[0].now}`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      hotel_slug TEXT NOT NULL,
      author TEXT NOT NULL,
      email TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      text TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const count = await client.query("SELECT COUNT(*)::int AS total FROM reviews");
  console.log(`reviews tabel klar. Antal rækker: ${count.rows[0].total}`);

  await client.end();
}

run().catch(async (error) => {
  console.error("DB setup-check fejlede:", error.message);
  process.exit(1);
});
