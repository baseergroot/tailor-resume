import { runResumeAnalysis } from "@/actions/agentRunner"
import { trackEvent } from "@/lib/analytics/track-event"

export const maxDuration = 300

export async function POST(request: Request) {
  let jobDescription = ""
  let generateCoverLetter = false
  let resumeText = ""
  let sessionId = ""

  try {
    const body = await request.json()
    jobDescription = typeof body.jobDescription === "string" ? body.jobDescription : ""
    generateCoverLetter = Boolean(body.generateCoverLetter)
    resumeText = typeof body.resumeText === "string" ? body.resumeText : ""
    sessionId = typeof body.sessionId === "string" ? body.sessionId : ""
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!jobDescription.trim()) {
    return Response.json({ error: "Job description is required" }, { status: 400 })
  }

  if (!resumeText.trim()) {
    return Response.json({ error: "Resume text is required for anonymous analysis" }, { status: 400 })
  }

  trackEvent({
    event: "jd_submitted",
    sessionId,
    path: "/dashboard",
    metadata: { generateCoverLetter, anonymous: true },
  })

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
        const output = await runResumeAnalysis(jobDescription, {
          generateCoverLetter,
          onEvent: (event) => send(event),
          context: { resumeText, sessionId },
        })
        send({ type: "result", output })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
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