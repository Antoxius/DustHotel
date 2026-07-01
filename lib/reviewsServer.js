import { promises as fs } from "fs";
import path from "path";
import { getDbPool } from "./db.js";

const reviewsFilePath = path.join(process.cwd(), "data", "reviews.json");
let schemaReady = false;

async function ensureDbSchema() {
  const pool = getDbPool();

  if (!pool || schemaReady) {
    return;
  }

  await pool.query(`
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

  await pool.query("CREATE INDEX IF NOT EXISTS idx_reviews_hotel_slug ON reviews (hotel_slug)");
  await pool.query("CREATE INDEX IF NOT EXISTS idx_reviews_date_desc ON reviews (date DESC)");

  schemaReady = true;
}

function mapReviewRow(row) {
  return {
    id: row.id,
    hotelSlug: row.hotel_slug,
    author: row.author,
    email: row.email,
    rating: row.rating,
    text: row.text,
    date: new Date(row.date).toISOString(),
  };
}

async function readReviewsFile() {
  try {
    const raw = await fs.readFile(reviewsFilePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(reviewsFilePath, "[]\n", "utf8");
      return [];
    }

    throw error;
  }
}

async function writeReviewsFile(reviews) {
  await fs.writeFile(reviewsFilePath, `${JSON.stringify(reviews, null, 2)}\n`, "utf8");
}

function getReviewKey(review) {
  if (review?.id) {
    return `id:${review.id}`;
  }

  return `fallback:${review?.hotelSlug ?? ""}|${review?.author ?? ""}|${review?.date ?? ""}|${review?.text ?? ""}`;
}

function sortReviewsByDateDesc(reviews) {
  return [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function mergeUniqueReviews(...reviewLists) {
  const byKey = new Map();

  for (const list of reviewLists) {
    if (!Array.isArray(list)) {
      continue;
    }

    for (const review of list) {
      if (review && typeof review === "object") {
        byKey.set(getReviewKey(review), review);
      }
    }
  }

  return sortReviewsByDateDesc([...byKey.values()]);
}

async function mergeReviewsIntoFile(reviews) {
  const existing = await readReviewsFile();
  const merged = mergeUniqueReviews(reviews, existing);
  await writeReviewsFile(merged);
  return merged;
}

async function upsertReviewsInDatabase(pool, reviews) {
  if (!pool || !Array.isArray(reviews) || reviews.length === 0) {
    return;
  }

  await ensureDbSchema();

  for (const review of reviews) {
    await pool.query(
      `
        INSERT INTO reviews (id, hotel_slug, author, email, rating, text, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id)
        DO UPDATE SET
          hotel_slug = EXCLUDED.hotel_slug,
          author = EXCLUDED.author,
          email = EXCLUDED.email,
          rating = EXCLUDED.rating,
          text = EXCLUDED.text,
          date = EXCLUDED.date
      `,
      [review.id, review.hotelSlug, review.author, review.email, review.rating, review.text, review.date]
    );
  }
}

async function trySyncFileReviewsToDatabase(pool, fileReviews) {
  if (!pool || !Array.isArray(fileReviews) || fileReviews.length === 0) {
    return;
  }

  try {
    await upsertReviewsInDatabase(pool, fileReviews);
  } catch (error) {
    console.error("Failed to sync file-backed reviews to database.", error);
  }
}

export async function getAllReviews() {
  const fileReviews = await readReviewsFile();
  const pool = getDbPool();

  if (!pool) {
    return fileReviews;
  }

  try {
    await trySyncFileReviewsToDatabase(pool, fileReviews);
    const result = await pool.query("SELECT * FROM reviews ORDER BY date DESC");
    const dbReviews = result.rows.map(mapReviewRow);
    return mergeUniqueReviews(dbReviews, fileReviews);
  } catch (error) {
    console.error("Failed to load reviews from database. Falling back to file storage.", error);
    return fileReviews;
  }
}

export async function getReviewsByHotelSlug(hotelSlug) {
  const fileReviews = (await readReviewsFile()).filter((review) => review.hotelSlug === hotelSlug);
  const pool = getDbPool();

  if (!pool) {
    return sortReviewsByDateDesc(fileReviews);
  }

  try {
    await trySyncFileReviewsToDatabase(pool, fileReviews);
    const result = await pool.query("SELECT * FROM reviews WHERE hotel_slug = $1 ORDER BY date DESC", [hotelSlug]);
    const dbReviews = result.rows.map(mapReviewRow);
    return mergeUniqueReviews(dbReviews, fileReviews);
  } catch (error) {
    console.error("Failed to load hotel reviews from database. Falling back to file storage.", error);
    return sortReviewsByDateDesc(fileReviews);
  }
}

export async function addReview(review) {
  let fileSaved = false;

  try {
    await mergeReviewsIntoFile([review]);
    fileSaved = true;
  } catch (error) {
    console.error("Failed to persist review to file storage.", error);
  }

  const pool = getDbPool();

  if (!pool) {
    if (fileSaved) {
      return review;
    }

    throw new Error("Unable to persist review because both database and file storage are unavailable.");
  }

  try {
    await upsertReviewsInDatabase(pool, [review]);

    return review;
  } catch (error) {
    console.error("Failed to save review to database. Keeping review in file storage.", error);

    if (fileSaved) {
      return review;
    }

    throw new Error("Unable to persist review because both database and file storage are unavailable.");
  }
}

export async function upsertReviews(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { processed: 0 };
  }

  let fileSaved = false;

  try {
    await mergeReviewsIntoFile(reviews);
    fileSaved = true;
  } catch (error) {
    console.error("Failed to persist reviews to file storage during upsert.", error);
  }

  const pool = getDbPool();

  if (!pool) {
    if (fileSaved) {
      return { processed: reviews.length };
    }

    throw new Error("Unable to upsert reviews because both database and file storage are unavailable.");
  }

  try {
    await upsertReviewsInDatabase(pool, reviews);

    return { processed: reviews.length };
  } catch (error) {
    console.error("Failed to upsert reviews to database. Keeping reviews in file storage.", error);

    if (fileSaved) {
      return { processed: reviews.length };
    }

    throw new Error("Unable to upsert reviews because both database and file storage are unavailable.");
  }
}

export async function migrateFileReviewsToDatabase() {
  const pool = getDbPool();

  if (!pool) {
    return { migrated: 0, skipped: 0, reason: "DATABASE_URL er ikke sat." };
  }

  await ensureDbSchema();

  const fileReviews = await readReviewsFile();
  let migrated = 0;
  let skipped = 0;

  for (const review of fileReviews) {
    const existing = await pool.query("SELECT id FROM reviews WHERE id = $1", [review.id]);

    if (existing.rowCount > 0) {
      skipped += 1;
      continue;
    }

    await pool.query(
      "INSERT INTO reviews (id, hotel_slug, author, email, rating, text, date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [review.id, review.hotelSlug, review.author, review.email, review.rating, review.text, review.date]
    );
    migrated += 1;
  }

  return { migrated, skipped, reason: "OK" };
}
