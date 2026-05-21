import { config } from "dotenv";
import { migrateFileReviewsToDatabase } from "../lib/reviewsServer.js";

config({ path: ".env.local" });
config();

async function run() {
  const result = await migrateFileReviewsToDatabase();
  console.log(`Migreret: ${result.migrated}, sprunget over: ${result.skipped}, status: ${result.reason}`);
}

run().catch((error) => {
  console.error("Migration fejlede:", error);
  process.exit(1);
});
