import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRateLimitStatus, RATE_LIMIT_CONFIG } from "@/lib/ratelimit";

export async function GET() {
  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const status = await getRateLimitStatus(ip);

    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-RateLimit-Limit": String(status.limit),
        "X-RateLimit-Remaining": String(status.remaining),
        "X-RateLimit-Reset": String(status.reset),
      },
    });
  } catch (error) {
    console.error("GET /api/ratelimit error:", error);
    return NextResponse.json(
      { limit: RATE_LIMIT_CONFIG.maxRequests, remaining: RATE_LIMIT_CONFIG.maxRequests, reset: Date.now() + RATE_LIMIT_CONFIG.windowMs },
      { status: 500 }
    );
  }
}
