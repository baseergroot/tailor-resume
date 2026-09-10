"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { resumeAgent } from "@/actions/mainAgent"


export default function AgentCallBtn() {
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<Awaited<ReturnType<typeof resumeAgent>> | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return

    setError("")
    // setResult("")

    startTransition(async () => {
      try {
        const result = await resumeAgent(jobDescription)

        setResult(result)
      } catch (error) {
        console.error(error)
      }
    })
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Analyze Your Resume</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={12}
          disabled={isPending}
        />

        <Button
          onClick={handleAnalyze}
          disabled={!jobDescription.trim() || isPending}
        >
          {isPending ? "Analyzing..." : "Analyze Resume"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div>
            <p>Match: {result.matchLevel}</p>
            <p>ATS Score: {result.atsScore}/100</p>
            <p>{result.summary}</p>

            {result.missingRequirements.length > 0 && (
              <ul>
                {result.missingRequirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            )}

            {result.tailoredResume && (
              <p>Resume was tailored.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}