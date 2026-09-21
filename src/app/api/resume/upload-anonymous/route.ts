import pdfParser from "@/helper/parsePdf"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("resume") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024
    const ACCEPTED_TYPES = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Max file size is 5MB" }, { status: 400 })
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF or DOCX files are allowed" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const resumeText = await pdfParser(buffer)

    return NextResponse.json({ resumeText })
  } catch (error) {
    console.error("Anonymous resume upload failed:", error)
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 })
  }
}