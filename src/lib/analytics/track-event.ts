import { AnalyticsEventName, AnalyticsEventData } from "./event-types"
import connectDB from "@/lib/db"
import { AnalyticsEvent } from "@/models/AnalyticsEvent"

type TrackEventInput = Omit<AnalyticsEventData, "createdAt">

export function trackEvent(input: TrackEventInput): void {
  void (async () => {
    try {
      await connectDB()
      await AnalyticsEvent.create({
        ...input,
        createdAt: new Date(),
      })
    } catch (error) {
      console.error("Analytics tracking failed:", error)
    }
  })()
}

export function trackEventSync(
  event: AnalyticsEventName,
  options: {
    clerkUserId?: string
    sessionId?: string
    path?: string
    metadata?: Record<string, unknown>
  } = {}
): void {
  trackEvent({ event, ...options })
}