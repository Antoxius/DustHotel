import { config } from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { upsertReviews } from "../lib/reviewsServer.js";

config({ path: ".env.local" });
config();

function resolveBackupPath() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    return path.join(process.cwd(), "backups", "reviews", "latest.json");
  }

  return path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath);
}

function parsePayload(raw) {
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (Array.isArray(parsed.reviews)) {
    return parsed.reviews;
  }

  return [];
}

async function run() {
  const backupPath = resolveBackupPath();
  const raw = await fs.readFile(backupPath, "utf8");
  const reviews = parsePayload(raw);

  if (reviews.length === 0) {
    console.log("Ingen anmeldelser fundet i backupfilen.");
    return;
  }

  const result = await upsertReviews(reviews);
  console.log(`Restore færdig. Processerede anmeldelser: ${result.processed}`);
}

run().catch((error) => {
  console.error("Restore fejlede:", error);
  process.exit(1);
});
