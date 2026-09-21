import { Document, Model, Schema, model, models } from "mongoose"
import { AnalyticsEventName } from "@/lib/analytics/event-types"

export interface IAnalyticsEvent {
  event: AnalyticsEventName
  clerkUserId?: string
  sessionId?: string
  path?: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

export interface IAnalyticsEventDocument extends IAnalyticsEvent, Document {}

const AnalyticsEventSchema: Schema<IAnalyticsEventDocument> = new Schema(
  {
    event: {
      type: String,
      required: true,
      enum: [
        "landing_cta_clicked",
        "auth_started",
        "signup_completed",
        "resume_uploaded",
        "jd_submitted",
        "analysis_started",
        "tailoring_completed",
        "pdf_downloaded",
      ],
      index: true,
    },
    clerkUserId: {
      type: String,
      index: true,
    },
    sessionId: {
      type: String,
    },
    path: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

AnalyticsEventSchema.index({ event: 1, createdAt: -1 })
AnalyticsEventSchema.index({ clerkUserId: 1, createdAt: -1 })

export const AnalyticsEvent: Model<IAnalyticsEventDocument> =
  models.AnalyticsEvent || model<IAnalyticsEventDocument>("AnalyticsEvent", AnalyticsEventSchema)