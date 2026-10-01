import { AnalyticsEventName } from "./event-types"

type TrackEventInput = {
  event: AnalyticsEventName
  clerkUserId?: string
  sessionId?: string
  path?: string
  metadata?: Record<string, unknown>
}

// Simple in-memory rate limiter: prevent same event from firing more than once per 500ms
const lastFired = new Map<string, number>()

export function trackEventClient(input: TrackEventInput): void {
  if (typeof window === "undefined") return

  const key = `${input.event}:${input.sessionId ?? "default"}:${input.path ?? ""}`
  const now = Date.now()
  const last = lastFired.get(key) ?? 0

  if (now - last < 500) {
    return // rate limited
  }

  lastFired.set(key, now)

  void (async () => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        keepalive: true,
      })
    } catch (error) {
      console.error("Analytics tracking failed:", error)
    }
  })()
}