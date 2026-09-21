import { AnalyticsEventName } from "./event-types"

type TrackEventInput = {
  event: AnalyticsEventName
  clerkUserId?: string
  sessionId?: string
  path?: string
  metadata?: Record<string, unknown>
}

export function trackEventClient(input: TrackEventInput): void {
  if (typeof window === "undefined") return

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