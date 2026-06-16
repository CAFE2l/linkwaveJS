import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return null;
  }

  if (bucket.count >= 120) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  bucket.count += 1;
  return null;
}

export async function middleware(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
