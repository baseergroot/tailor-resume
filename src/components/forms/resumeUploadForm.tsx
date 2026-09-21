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

interface ResumeUploadFormProps {
  onUploadComplete?: (resumeText: string) => void
  isAnonymous?: boolean
}

const initialState: FormState = {
  success: false,
  message: "",
};

export default function ResumeUploadForm({ onUploadComplete, isAnonymous = false }: ResumeUploadFormProps) {
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
        <CardTitle>Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="resume">Resume File</FieldLabel>
            <Input id="resume" type="file" name="resume" required className="mm-input" disabled={isUploading} />
            <FieldDescription>Supports PDF and DOCX formats.</FieldDescription>
          </Field>

          <Button type="submit" className="mm-btn mm-btn-primary" disabled={isUploading}>
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