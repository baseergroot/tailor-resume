"use server"

import { auth } from "@clerk/nextjs/server"
import connectDB from "@/lib/db"
import { AnalyticsEvent } from "@/models/AnalyticsEvent"

const ADMIN_EMAIL = "kiakaro69@gmail.com"

export async function resetAnalytics(): Promise<{ success: boolean; error?: string; deletedCount?: number }> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Unauthorized" }
  }

  await connectDB()
  const { User } = await import("@/models/user")
  const user = await User.findOne({ clerkUserId: userId }).lean()

  if (!user?.email || user.email !== ADMIN_EMAIL) {
    return { success: false, error: "Forbidden" }
  }

  try {
    const result = await AnalyticsEvent.deleteMany({})
    return { success: true, deletedCount: result.deletedCount }
  } catch (error) {
    console.error("Failed to reset analytics:", error)
    return { success: false, error: "Failed to reset analytics" }
  }
}