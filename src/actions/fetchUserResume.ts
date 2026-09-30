"use server"

import { auth } from "@clerk/nextjs/server"
import connectDB from "@/lib/db"
import { User } from "@/models/user"

export async function fetchUserResume(): Promise<{ resumeText: string | null; error?: string }> {
  const { userId } = await auth()

  if (!userId) {
    return { resumeText: null, error: "Unauthorized" }
  }

  try {
    await connectDB()
    const user = await User.findOne({ clerkUserId: userId }).lean()
    return { resumeText: user?.resume?.resumeText ?? null }
  } catch (error) {
    console.error("Failed to fetch user resume:", error)
    return { resumeText: null, error: "Failed to fetch resume" }
  }
}