import { trackEvent } from "@/lib/analytics/track-event"
import { AnalyticsEventName, ANALYTICS_EVENTS } from "@/lib/analytics/event-types"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, sessionId, path, metadata } = body as {
      event: AnalyticsEventName
      sessionId?: string
      path?: string
      metadata?: Record<string, unknown>
    }

    if (!event || !ANALYTICS_EVENTS.includes(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 })
    }

    trackEvent({
      event,
      sessionId,
      path,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}