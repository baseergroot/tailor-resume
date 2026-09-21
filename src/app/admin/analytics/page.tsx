import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db"
import { AnalyticsEvent } from "@/models/AnalyticsEvent"
import { AnalyticsEventName } from "@/lib/analytics/event-types"
import AdminAnalyticsClient from "./AdminAnalyticsClient"

const ADMIN_EMAIL = "kiakaro69@gmail.com"

async function getAnalyticsData(dateRange: string) {
  await connectDB()

  const now = new Date()
  let startDate: Date

  switch (dateRange) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case "3d":
      startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      break
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  const matchStage = { createdAt: { $gte: startDate } }

  const [totalEvents, eventsByType, recentEvents] = await Promise.all([
    AnalyticsEvent.countDocuments(matchStage),
    AnalyticsEvent.aggregate([
      { $match: matchStage },
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    AnalyticsEvent.find(matchStage)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
  ])

  const counts: Record<AnalyticsEventName, number> = {
    landing_cta_clicked: 0,
    auth_started: 0,
    signup_completed: 0,
    resume_uploaded: 0,
    jd_submitted: 0,
    tailoring_completed: 0,
    pdf_downloaded: 0,
  }

  for (const item of eventsByType) {
    if (item._id in counts) {
      counts[item._id as AnalyticsEventName] = item.count
    }
  }

  return { totalEvents, counts, recentEvents }
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ dateRange?: string }>
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  await connectDB()
  const { User } = await import("@/models/user")
  const user = await User.findOne({ clerkUserId: userId }).lean()

  if (!user?.email || user.email !== ADMIN_EMAIL) {
    redirect("/dashboard")
  }

  const { dateRange = "7d" } = await searchParams
  const { totalEvents, counts, recentEvents } = await getAnalyticsData(dateRange)

  return <AdminAnalyticsClient totalEvents={totalEvents} counts={counts} recentEvents={recentEvents} dateRange={dateRange} />
}