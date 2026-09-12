"use client"
import handelResumeUpload from "@/actions/handleResumeUpload"
import type {FormState} from "@/actions/handleResumeUpload"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useActionState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const initialState: FormState = {
  success: false,
  message: "",
};

const ResumeUploadForm = () => {
  const [state, formAction] = useActionState(handelResumeUpload, initialState)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="resume">Resume File</FieldLabel>
            <Input id="resume" type="file" name="resume" required className="mm-input" />
            <FieldDescription>Supports PDF and DOCX formats.</FieldDescription>
          </Field>

          <Button type="submit" className="mm-btn mm-btn-primary">
            Upload Resume
          </Button>

          {state.message && (
            <div className="mt-3">
              {state.success ? (
                <Badge variant="success">{state.message}</Badge>
              ) : (
                <Badge variant="destructive">{state.message}</Badge>
              )}
            </div>
          )}

          {state.errors?.resume && (
            <p className="text-sm text-mm-error">{state.errors.resume}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default ResumeUploadForm
