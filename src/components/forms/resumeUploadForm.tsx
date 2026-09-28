"use client"
import handelResumeUpload from "@/actions/handleResumeUpload"
import type { FormState } from "@/actions/handleResumeUpload"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@clerk/nextjs"
import { trackEventClient } from "@/lib/analytics/track-event-client"
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

interface ResumeUploadFormProps {
  onUploadComplete?: (resumeText: string) => void
  isAnonymous?: boolean
  setCurrentStep?: (step: number) => void
}

const initialState: FormState = {
  success: false,
  message: "",
};

export default function ResumeUploadForm({
  onUploadComplete,
  isAnonymous = false,
  setCurrentStep,
}: ResumeUploadFormProps) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [state, formAction] = useActionState(handelResumeUpload, initialState)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get("resume") as File

    if (!file) {
      setError("Please select a file.")
      return
    }

    setIsUploading(true)
    setError("")
    setSuccess(false)

    try {
      if (isAnonymous || !isSignedIn) {
        const apiFormData = new FormData()
        apiFormData.append("resume", file)

        const response = await fetch("/api/resume/upload-anonymous", {
          method: "POST",
          body: apiFormData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload resume")
        }

        if (data.resumeText && onUploadComplete) {
          onUploadComplete(data.resumeText)
        }

        trackEventClient({
          event: "resume_uploaded",
          sessionId: "anonymous",
          path: "/dashboard",
          metadata: { anonymous: true },
        })

        setSuccess(true)
        setCurrentStep?.(2)
      } else {
        await formAction(formData)
        if (state.success) {
          router.refresh()
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again."
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Upload Your Resume</CardTitle>
        <p className="text-sm text-mm-steel">PDF or DOCX, up to 5MB</p>
      </CardHeader>
      <CardContent>
        {/* ATS Info Box */}
        <div className="mb-4 mm-card bg-mm-surface/50 border-mm-coral/30 p-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="w-5 h-5 text-mm-coral mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-mm-ink mb-1">What is ATS?</h4>
              <p className="text-sm text-mm-steel">
                ATS (Applicant Tracking System) is software that filters resumes before humans see them.
                <strong className="text-mm-ink">75% of resumes are rejected by ATS</strong> for missing keywords.
                HireFit optimizes your resume with the exact keywords from the job description so you get seen.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="resume">Resume File</FieldLabel>
            <Input id="resume" type="file" name="resume" required className="mm-input" disabled={isUploading} />
            <FieldDescription>Supports PDF and DOCX formats.</FieldDescription>
          </Field>

          <Button type="submit" className="mm-btn mm-btn-primary w-full" disabled={isUploading}>
            {isUploading ? "Uploading…" : "Upload Resume"}
          </Button>

          {error && (
            <div className="mt-3">
              <Badge variant="destructive">{error}</Badge>
            </div>
          )}

          {success && (
            <div className="mt-3">
              <Badge variant="success">Resume uploaded successfully</Badge>
            </div>
          )}

          {state.message && !isAnonymous && isSignedIn && (
            <div className="mt-3">
              {state.success ? (
                <Badge variant="success">{state.message}</Badge>
              ) : (
                <Badge variant="destructive">{state.message}</Badge>
              )}
            </div>
          )}

          {state.errors?.resume && !isAnonymous && isSignedIn && (
            <p className="text-sm text-mm-error">{state.errors.resume}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}