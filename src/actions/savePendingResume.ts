"use server"

import { auth } from "@clerk/nextjs/server"
import connectDB from "@/lib/db"
import { User } from "@/models/user"
import { trackEvent } from "@/lib/analytics/track-event"

export async function savePendingResume(resumeText: string): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Unauthorized" }
  }

  if (!resumeText || !resumeText.trim()) {
    return { success: false, error: "No resume text provided" }
  }

  try {
    await connectDB()

    await User.findOneAndUpdate(
      { clerkUserId: userId },
      { resume: { resumeText } },
      { upsert: true, new: true }
    )

    trackEvent({
      event: "resume_uploaded",
      clerkUserId: userId,
      path: "/dashboard",
      metadata: { recovered: true },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to save pending resume:", error)
    return { success: false, error: "Failed to save resume" }
  }
}