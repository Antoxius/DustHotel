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

export async function getAllReviews() {
  const pool = getDbPool();

  if (!pool) {
    return readReviewsFile();
  }

  await ensureDbSchema();
  const result = await pool.query("SELECT * FROM reviews ORDER BY date DESC");
  return result.rows.map(mapReviewRow);
}

export async function getReviewsByHotelSlug(hotelSlug) {
  const pool = getDbPool();

  if (!pool) {
    const reviews = await readReviewsFile();
    return reviews.filter((review) => review.hotelSlug === hotelSlug);
  }

  await ensureDbSchema();
  const result = await pool.query("SELECT * FROM reviews WHERE hotel_slug = $1 ORDER BY date DESC", [hotelSlug]);
  return result.rows.map(mapReviewRow);
}

export async function addReview(review) {
  const pool = getDbPool();

  if (!pool) {
    const reviews = await readReviewsFile();
    const next = [review, ...reviews];
    await writeReviewsFile(next);
    return review;
  }

  await ensureDbSchema();
  await pool.query(
    "INSERT INTO reviews (id, hotel_slug, author, email, rating, text, date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [review.id, review.hotelSlug, review.author, review.email, review.rating, review.text, review.date]
  );

  return review;
}

export async function upsertReviews(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { processed: 0 };
  }

  const pool = getDbPool();

  if (!pool) {
    const existing = await readReviewsFile();
    const byId = new Map(existing.map((item) => [item.id, item]));

    for (const review of reviews) {
      byId.set(review.id, review);
    }

    const merged = [...byId.values()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    await writeReviewsFile(merged);
    return { processed: reviews.length };
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

  return { processed: reviews.length };
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
