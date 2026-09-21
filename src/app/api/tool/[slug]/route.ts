import { runSingleTool, SINGLE_TOOL_SLUGS, type SingleToolSlug } from "@/actions/singleToolRunner"
import { trackEvent } from "@/lib/analytics/track-event"
import { auth } from "@clerk/nextjs/server"

export const maxDuration = 300

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  if (!(SINGLE_TOOL_SLUGS as readonly string[]).includes(slug)) {
    return Response.json({ error: "Unknown tool" }, { status: 404 })
  }

  let jobDescription = ""

  try {
    const body = await request.json()
    jobDescription = typeof body.jobDescription === "string" ? body.jobDescription : ""
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (slug !== "resume-analyzer" && !jobDescription.trim()) {
    return Response.json({ error: "Job description is required" }, { status: 400 })
  }

  const { userId } = await auth()
  if (userId) {
    trackEvent({
      event: "jd_submitted",
      clerkUserId: userId,
      path: `/tools/${slug}`,
      metadata: { tool: slug },
    })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
        } catch {
          // stream already closed
        }
      }

      try {
        const output = await runSingleTool(slug as SingleToolSlug, jobDescription, {
          onEvent: (event) => send(event),
        })
        send({ type: "result", output })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        send({ type: "error", message })
      } finally {
        try {
          controller.close()
        } catch {
          // already closed
        }
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}