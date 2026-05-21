import { config } from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { getAllReviews } from "../lib/reviewsServer.js";

config({ path: ".env.local" });
config();

function buildTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function resolveBackupDir() {
  if (process.env.BACKUP_TARGET) {
    return path.isAbsolute(process.env.BACKUP_TARGET)
      ? process.env.BACKUP_TARGET
      : path.join(process.cwd(), process.env.BACKUP_TARGET);
  }

  return path.join(process.cwd(), "backups", "reviews");
}

async function pruneOldBackups(backupDir) {
  const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS || 0);

  if (!Number.isFinite(retentionDays) || retentionDays <= 0) {
    return 0;
  }

  const files = await fs.readdir(backupDir);
  const cutoffMs = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  let deleted = 0;

  for (const file of files) {
    if (!file.startsWith("reviews-") || !file.endsWith(".json")) {
      continue;
    }

    const fullPath = path.join(backupDir, file);
    const stats = await fs.stat(fullPath);

    if (stats.mtimeMs < cutoffMs) {
      await fs.unlink(fullPath);
      deleted += 1;
    }
  }

  return deleted;
}

async function run() {
  const reviews = await getAllReviews();
  const backupDir = resolveBackupDir();
  const timestamp = buildTimestamp();
  const backupFilePath = path.join(backupDir, `reviews-${timestamp}.json`);
  const latestFilePath = path.join(backupDir, "latest.json");

  const payload = {
    createdAt: new Date().toISOString(),
    count: reviews.length,
    reviews,
  };

  await fs.mkdir(backupDir, { recursive: true });
  await fs.writeFile(backupFilePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(latestFilePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  const deleted = await pruneOldBackups(backupDir);

  console.log(`Backup oprettet: ${backupFilePath}`);
  console.log(`Anmeldelser i backup: ${payload.count}`);
  console.log(`Slettede gamle backups: ${deleted}`);
}

run().catch((error) => {
  console.error("Backup fejlede:", error);
  process.exit(1);
});
