"use server"
import pdfParser from "@/helper/parsePdf"
import connectDB from "@/lib/db"
import { User } from "@/models/user"
import { z } from "zod"

export type FormState = {
  success: boolean
  message: string
  errors?: {
    resume?: string[]
  }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
];

const resumeUploadSchema = z.object({
  resume: z
    .instanceof(File, { message: "Please select a file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB."
    })
    .refine((file) => ACCEPTED_RESUME_TYPES.includes(file.type), {
      message: "Only PDF or DOCX files are allowed."
    })
});

export default async function handelResumeUpload(prevState: FormState, formData: FormData): Promise<FormState> {

  console.log("Resume upload triggered")

  const validatedResumeFile = resumeUploadSchema.safeParse({
    resume: formData.get("resume")
  })

  console.log({ validatedResumeFile: validatedResumeFile.data?.resume })

  if (!validatedResumeFile.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedResumeFile.error.flatten().fieldErrors,
    }
  }

  const bytes = await validatedResumeFile.data.resume.arrayBuffer()
  const buffer = Buffer.from(bytes);

  const resumeText = await pdfParser(buffer)

  console.log({ resumeText })

  await connectDB()
  const user = await User.findByIdAndUpdate("6a943e00e48d6112e9120932", { resume: { resumeText } })
  console.log({ user })

  return {
    success: true,
    message: "Resume uploaded successfully"
  }
}
