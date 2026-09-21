"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnalyticsEventName, ANALYTICS_EVENTS } from "@/lib/analytics/event-types"

interface AdminAnalyticsClientProps {
  totalEvents: number
  counts: Record<AnalyticsEventName, number>
  recentEvents: Array<{
    event: string
    clerkUserId?: string
    sessionId?: string
    path?: string
    metadata?: Record<string, unknown>
    createdAt: string | Date
  }>
  dateRange: string
}

const FUNNEL_STEPS: Array<{ key: AnalyticsEventName; label: string }> = [
  { key: "landing_cta_clicked", label: "Landing CTA" },
  { key: "auth_started", label: "Auth Started" },
  { key: "signup_completed", label: "Signup Completed" },
  { key: "resume_uploaded", label: "Resume Uploaded" },
  { key: "jd_submitted", label: "JD Submitted" },
  { key: "tailoring_completed", label: "Tailoring Completed" },
  { key: "pdf_downloaded", label: "PDF Downloaded" },
]

const OVERVIEW_CARDS = [
  { key: "landing_cta_clicked", label: "Total Visitors" },
  { key: "auth_started", label: "Auth Starts" },
  { key: "signup_completed", label: "Signups" },
  { key: "resume_uploaded", label: "Resumes Uploaded" },
  { key: "jd_submitted", label: "JDs Submitted" },
  { key: "tailoring_completed", label: "Tailorings Completed" },
  { key: "pdf_downloaded", label: "PDFs Downloaded" },
]

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return String(num)
}

function calculateConversion(from: number, to: number): string {
  if (from === 0) return "—"
  return `${((to / from) * 100).toFixed(1)}%`
}

function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getEventBadgeVariant(event: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    landing_cta_clicked: "default",
    auth_started: "secondary",
    signup_completed: "default",
    resume_uploaded: "secondary",
    jd_submitted: "outline",
    tailoring_completed: "default",
    pdf_downloaded: "secondary",
  }
  return variants[event] || "outline"
}

export default function AdminAnalyticsClient({
  totalEvents,
  counts,
  recentEvents,
  dateRange,
}: AdminAnalyticsClientProps) {
  const [filterEvent, setFilterEvent] = useState<string>("all")

  const filteredEvents = filterEvent === "all"
    ? recentEvents
    : recentEvents.filter((e) => e.event === filterEvent)

  const handleDateRangeChange = (v: string) => {
    window.location.search = `?dateRange=${v}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header with date filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mm-heading-lg text-mm-ink">Analytics Dashboard</h1>
          <p className="text-sm text-mm-steel">Product analytics for Hirefit</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => handleDateRangeChange(e.target.value)}
          className="mm-input w-[180px] bg-mm-surface border-mm-hairline"
        >
          <option value="today">Today</option>
          <option value="3d">Last 3 days</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {OVERVIEW_CARDS.map(({ key, label }) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mm-steel">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mm-heading-lg text-mm-ink">{formatNumber(counts[key as AnalyticsEventName])}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-mm-steel border-b border-mm-hairline">
                  <th className="text-left py-2 px-3">Stage</th>
                  <th className="text-right py-2 px-3">Count</th>
                  <th className="text-right py-2 px-3">Conversion</th>
                </tr>
              </thead>
              <tbody>
{FUNNEL_STEPS.map((step, index) => {
const count = counts[step.key as AnalyticsEventName]
                  const prevCount = index === 0 ? totalEvents : counts[FUNNEL_STEPS[index - 1].key as AnalyticsEventName]
                  const conversion = index === 0 ? "—" : calculateConversion(prevCount, count)

                  return (
                    <tr key={step.key} className="border-b border-mm-hairline/50">
                      <td className="py-2 px-3 font-medium text-mm-ink">{step.label}</td>
                      <td className="py-2 px-3 text-right mm-heading-md text-mm-ink">{formatNumber(count)}</td>
                      <td className="py-2 px-3 text-right">
                        <Badge variant={index === 0 ? "secondary" : "outline"}>{conversion}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Visual funnel */}
          <div className="space-y-2">
{FUNNEL_STEPS.map((step) => {
              const count = counts[step.key]
              const maxCount = Math.max(...FUNNEL_STEPS.map((s) => counts[s.key as AnalyticsEventName]), 1)
              const width = (count / maxCount) * 100

              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-mm-steel text-right font-medium">{step.label}</div>
                  <div className="flex-1 h-8 bg-mm-surface rounded relative overflow-hidden">
                    <div
                      className="h-full bg-mm-primary transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-3 text-sm font-medium text-white">
                      {formatNumber(count)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Recent Events</CardTitle>
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="mm-input w-[200px] bg-mm-surface border-mm-hairline"
          >
            <option value="all">All Events</option>
            {ANALYTICS_EVENTS.map((event) => (
              <option key={event} value={event}>
                {event.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-mm-steel border-b border-mm-hairline">
                  <th className="text-left py-2 px-3">Event</th>
                  <th className="text-left py-2 px-3">Date/Time</th>
                  <th className="text-left py-2 px-3">User ID</th>
                  <th className="text-left py-2 px-3">Path</th>
                  <th className="text-left py-2 px-3">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-mm-steel py-8">
                      No events found
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event, index) => (
                    <tr key={index} className="border-b border-mm-hairline/50">
                      <td className="py-2 px-3">
                        <Badge variant={getEventBadgeVariant(event.event)}>
                          {event.event.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-sm text-mm-steel">{formatDate(event.createdAt)}</td>
                      <td className="py-2 px-3 text-sm font-mono text-mm-muted">
                        {event.clerkUserId ? event.clerkUserId.slice(0, 20) + "…" : event.sessionId ? "Anonymous" : "—"}
                      </td>
                      <td className="py-2 px-3 text-sm text-mm-steel truncate max-w-[200px]">
                        {event.path || "—"}
                      </td>
                      <td className="py-2 px-3 text-sm text-mm-steel font-mono max-w-[300px] truncate">
                        {event.metadata ? JSON.stringify(event.metadata) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}