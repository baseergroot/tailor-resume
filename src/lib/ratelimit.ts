// lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "20 m"), // 20 messages per 20 minutes per identifier
  analytics: true,
});

export const RATE_LIMIT_CONFIG = {
  maxRequests: 20,
  windowMs: 20 * 60 * 1000,
};

export async function checkRateLimit(identifier: string) {
  try {
    const res = await ratelimit.limit(identifier);
    return res;
  } catch (error) {
    console.error("Rate limit check error:", error);
    return {
      success: true,
      limit: RATE_LIMIT_CONFIG.maxRequests,
      remaining: RATE_LIMIT_CONFIG.maxRequests,
      reset: Date.now() + RATE_LIMIT_CONFIG.windowMs,
    };
  }
}

export async function getRateLimitStatus(identifier: string) {
  try {
    const res = await ratelimit.getRemaining(identifier);
    return res;
  } catch (error) {
    console.error("Rate limit status error:", error);
    return {
      limit: RATE_LIMIT_CONFIG.maxRequests,
      remaining: RATE_LIMIT_CONFIG.maxRequests,
      reset: Date.now() + RATE_LIMIT_CONFIG.windowMs,
    };
  }
}