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

const initialState: FormState = {
  success: false,
  message: "",
};

const ResumeUploadForm = () => {
  const [state, formAction, isPending] = useActionState(handelResumeUpload, initialState)
  return (
    <form action={formAction}>

      <Field>
        <FieldLabel htmlFor="resume">Upload Resume</FieldLabel>
        <Input id="resume" type="file" name="resume" required />
        <FieldDescription>Select a resume to upload.</FieldDescription>
        <Button type="submit">Upload Resume</Button>
      </Field>

      <p>response: {state.success ? "true" : "false"}</p>
      <p>message: {state.message}</p>
      <p>error: {state.errors?.resume}</p>

    </form>
  )
}

export default ResumeUploadForm