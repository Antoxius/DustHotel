import { NextResponse } from "next/server";
import { getReviewStorageStatus, syncFileReviewsToDatabase } from "@/lib/reviewsServer";

export const runtime = "nodejs";

function getConfiguredSyncToken() {
  return process.env.REVIEWS_SYNC_TOKEN || process.env.CRON_SECRET || "";
}

function isAuthorizedRequest(request) {
  const expectedToken = getConfiguredSyncToken();

  if (!expectedToken) {
    return {
      ok: false,
      status: 503,
      message: "Reviews sync token is not configured.",
    };
  }

  const authHeader = request.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const headerToken = request.headers.get("x-sync-token") || "";
  const providedToken = bearerToken || headerToken;

  if (!providedToken || providedToken !== expectedToken) {
    return {
      ok: false,
      status: 401,
      message: "Unauthorized.",
    };
  }

  return { ok: true };
}

export async function GET(request) {
  const auth = isAuthorizedRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });
  }

  const status = await getReviewStorageStatus();

  return NextResponse.json({
    ok: true,
    status,
    now: new Date().toISOString(),
  });
}

export async function POST(request) {
  const auth = isAuthorizedRequest(request);

  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });
  }

  const syncResult = await syncFileReviewsToDatabase();
  const status = await getReviewStorageStatus();

  return NextResponse.json(
    {
      ok: syncResult.ok,
      sync: syncResult,
      status,
      now: new Date().toISOString(),
    },
    { status: syncResult.ok ? 200 : 503 }
  );
}
