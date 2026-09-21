export type AnalyticsEventName =
  | "landing_cta_clicked"
  | "auth_started"
  | "signup_completed"
  | "resume_uploaded"
  | "jd_submitted"
  | "analysis_started"
  | "tailoring_completed"
  | "pdf_downloaded"

export const ANALYTICS_EVENTS: AnalyticsEventName[] = [
  "landing_cta_clicked",
  "auth_started",
  "signup_completed",
  "resume_uploaded",
  "jd_submitted",
  "tailoring_completed",
  "pdf_downloaded",
] as const

export interface AnalyticsEventData {
  event: AnalyticsEventName
  clerkUserId?: string
  sessionId?: string
  path?: string
  metadata?: Record<string, unknown>
  createdAt: Date
}