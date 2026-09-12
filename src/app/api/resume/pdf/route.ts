import { NextRequest } from "next/server"
import ResumeSchema from "@/schema/resumeSchema"
import { renderResumePdf } from "@/lib/resumePdf"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = ResumeSchema.safeParse(body?.resume)

    if (!parsed.success) {
      return Response.json({ error: "Invalid resume payload" }, { status: 400 })
    }

    const pdf = await renderResumePdf(parsed.data)

    return new Response(new Blob([pdf], { type: "application/pdf" }), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="tailored-resume.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF generation failed", error)
    return Response.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}