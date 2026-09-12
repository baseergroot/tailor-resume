import { runResumeAnalysis } from "@/actions/agentRunner"

export async function POST(request: Request) {
  let jobDescription = ""
  let generateCoverLetter = false

  try {
    const body = await request.json()
    jobDescription = typeof body.jobDescription === "string" ? body.jobDescription : ""
    generateCoverLetter = Boolean(body.generateCoverLetter)
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!jobDescription.trim()) {
    return Response.json({ error: "Job description is required" }, { status: 400 })
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
        const output = await runResumeAnalysis(jobDescription, {
          generateCoverLetter,
          onEvent: (event) => send(event),
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