"use client"

import { useState } from "react"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import AgentResponseSchema from "@/schema/agentResponseSchema"
import ToolStepper, { toolLabel, type ToolStep } from "@/components/ToolStepper"

type AnalysisResult = z.infer<typeof AgentResponseSchema>

type Resume = NonNullable<AnalysisResult["tailoredResume"]>

async function handleDownload(resume: Resume) {
  const response = await fetch("/api/resume/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate PDF")
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "tailored-resume.pdf"
  a.click()
  URL.revokeObjectURL(url)
}

function handleDownloadCoverLetter(text: string) {
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "cover-letter.txt"
  a.click()
  URL.revokeObjectURL(url)
}

function formatError(message: string) {
  if (/no output generated/i.test(message)) {
    return "The AI couldn't produce a result this time. The analysis runs several agent steps and occasionally exceeds its step limit. Please try again — if it keeps failing, try a shorter job description."
  }
  return message
}

function MatchBadge({ level }: { level: AnalysisResult["matchLevel"] }) {
  const variant = level === "strong" ? "default" : level === "partial" ? "secondary" : "destructive"
  const label = level.charAt(0).toUpperCase() + level.slice(1)
  return <Badge variant={variant}>{label} Match</Badge>
}

function ScoreRing({ score, label }: { score: number; label?: string }) {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  const color = score >= 75
    ? "text-green-600 dark:text-green-400"
    : score >= 50
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400"

  const strokeColor = score >= 75
    ? "stroke-green-600 dark:stroke-green-400"
    : score >= 50
      ? "stroke-amber-600 dark:stroke-amber-400"
      : "stroke-red-600 dark:stroke-red-400"

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative size-24">
        <svg className="size-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-700", strokeColor)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold tabular-nums", color)}>
            {score}
          </span>
          <span className="text-[10px] text-muted-foreground">{label ?? "ATS"}</span>
        </div>
      </div>
    </div>
  )
}

function KeywordChips({
  matched,
  missing,
}: {
  matched?: string[]
  missing?: string[]
}) {
  if ((!matched || matched.length === 0) && (!missing || missing.length === 0)) {
    return null
  }

  return (
    <div className="space-y-2">
      {matched && matched.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Found:</span>
          {matched.map((keyword) => (
            <Badge
              key={keyword}
              variant="outline"
              className="border-green-500/40 text-green-700 dark:text-green-400"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      )}
      {missing && missing.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Missing:</span>
          {missing.map((keyword) => (
            <Badge
              key={keyword}
              variant="outline"
              className="border-destructive/40 text-destructive"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function RevealingUnderlineTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b-2 border-zinc-900 pb-1 text-xs font-bold uppercase tracking-wider text-zinc-900">
      {children}
    </h3>
  )
}

function ResumePreview({ resume }: { resume: Resume }) {
  const skills = resume.skills.join(" | ")
  const responsibilities = (text: string) => text.trim()

  return (
    <div className="mx-auto w-full max-w-3xl rounded-lg border border-mm-hairline bg-white p-6 text-zinc-800 shadow-sm sm:p-8">
      {resume.personalInfo?.name && (
        <header className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            {resume.personalInfo.name}
          </h2>
          {resume.personalInfo.headline && (
            <p className="mt-1 text-sm text-zinc-600">{resume.personalInfo.headline}</p>
          )}
          {(() => {
            const contactParts = [
              resume.personalInfo?.email,
              resume.personalInfo?.phone,
              resume.personalInfo?.location,
              resume.personalInfo?.linkedin,
              resume.personalInfo?.website,
            ].filter(Boolean)
            return contactParts.length > 0 ? (
              <p className="mt-1.5 text-sm text-zinc-500">{contactParts.join(" | ")}</p>
            ) : null
          })()}
        </header>
      )}

      {resume.summary && (
        <section className="mb-5">
          <RevealingUnderlineTitle>Summary</RevealingUnderlineTitle>
          <p className="mt-3 text-sm leading-relaxed">{resume.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-5">
          <RevealingUnderlineTitle>Technical Skills</RevealingUnderlineTitle>
          <p className="mt-3 text-sm leading-relaxed">{skills}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-5">
          <RevealingUnderlineTitle>Experience</RevealingUnderlineTitle>
          <div className="mt-3 space-y-5">
            {resume.experience.map((exp, i) => (
              <div key={i}>
                <p className="text-[15px] font-semibold leading-snug">{exp.role}</p>
                {exp.company && (
                  <p className="text-sm text-zinc-600">
                    {exp.company}
                    {exp.duration ? ` - ${exp.duration}` : ""}
                  </p>
                )}
                {exp.responsibilities.filter(responsibilities).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.responsibilities.filter(responsibilities).map((r, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-relaxed">
                        <span className="shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {exp.technologies.length > 0 && (
                  <p className="mt-1.5 text-sm text-zinc-600">
                    Technologies: {exp.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-5">
          <RevealingUnderlineTitle>Projects</RevealingUnderlineTitle>
          <div className="mt-3 space-y-4">
            {resume.projects.map((proj, i) => (
              <div key={i}>
                <p className="text-[15px] font-semibold leading-snug">{proj.name}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-zinc-700">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <p className="mt-1.5 text-sm text-zinc-600">
                    Technologies: {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-5">
          <RevealingUnderlineTitle>Education</RevealingUnderlineTitle>
          <div className="mt-3 space-y-3">
            {resume.education.map((edu, i) => {
              const field =
                edu.field &&
                !edu.degree?.toLocaleLowerCase().includes(edu.field.toLocaleLowerCase())
                  ? edu.field
                  : undefined
              const parts = [edu.degree, field].filter(Boolean).join(" in ")
              return (
                <div key={i}>
                  <p className="text-sm font-semibold">{edu.institution}</p>
                  {parts && <p className="text-sm text-zinc-700">{parts}</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-mm-muted mb-2">
      {children}
    </h3>
  )
}

export default function ResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<ToolStep[]>([])
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false)

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || isRunning) return

    setError("")
    setResult(null)
    setSteps([])
    setIsRunning(true)

    let stepId = 0

    const applyEvent = (event: {
      type: string
      [key: string]: unknown
    }) => {
      if (event.type === "start") {
        setSteps((prev) => [
          ...prev,
          {
            id: ++stepId,
            toolCallId: event.toolCallId as string,
            toolName: event.toolName as string,
            label: toolLabel(event.toolName as string),
            status: "running",
            executionCount: event.executionCount as number,
          },
        ])
      } else if (event.type === "end") {
        const { toolCallId, status, durationMs } = event
        setSteps((prev) =>
          prev.map((s) =>
            s.toolCallId === toolCallId
              ? {
                  ...s,
                  status: status === "ok" ? "done" : "error",
                  durationMs: durationMs as number,
                }
              : s
          )
        )
      } else if (event.type === "result") {
        setResult(event.output as AnalysisResult)
      } else if (event.type === "error") {
        setError(formatError(event.message as string))
      }
    }

    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, generateCoverLetter }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Failed to start analysis")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const chunks = buffer.split("\n\n")
        buffer = chunks.pop() ?? ""
        for (const chunk of chunks) {
          const line = chunk.trim().startsWith("data:")
            ? chunk.trim().slice(5).trim()
            : ""
          if (!line) continue
          try {
            applyEvent(JSON.parse(line) as Parameters<typeof applyEvent>[0])
          } catch (parseErr) {
            console.error("Failed to parse SSE event", parseErr)
          }
        }
      }
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(formatError(message))
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Resume</CardTitle>
          <CardDescription>
            Paste a job description to see how well your resume matches and get a tailored version.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            disabled={isRunning}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={handleAnalyze}
              disabled={!jobDescription.trim() || isRunning}
              className="mm-btn mm-btn-primary"
            >
              {isRunning ? "Analyzing…" : "Analyze Resume"}
            </Button>

            <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-mm-steel">
              <input
                type="checkbox"
                checked={generateCoverLetter}
                onChange={(e) => setGenerateCoverLetter(e.target.checked)}
                disabled={isRunning}
                className="size-4 accent-mm-primary"
              />
              Also generate a cover letter
            </label>
          </div>

          {isRunning && (
            <div className="space-y-3 pt-2">
              <ToolStepper steps={steps} />
              <p className="text-xs text-mm-steel">
                Each step in the pipeline is a separate AI call — this usually takes a couple of minutes.
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
<CardContent className="space-y-5">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <ScoreRing score={result.tailoredAtsScore ?? result.atsScore} label="ATS" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Match Level:</span>
                    <MatchBadge level={result.matchLevel} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Requirements Met:</span>
                    {result.fulfillsRequirements ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </div>
                </div>
              </div>

              <KeywordChips
                matched={result.atsMatchedKeywords}
                missing={result.atsMissingKeywords}
              />

              {!result.fulfillsRequirements && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Your resume doesn&apos;t demonstrate the must-have requirements for this
                    role, so we didn&apos;t generate a tailored resume. The specific gaps are
                    listed below — review them and decide for yourself whether to apply.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div>
                <SectionHeading>Summary</SectionHeading>
                <p className="text-sm leading-relaxed text-mm-steel">
                  {result.summary}
                </p>
              </div>

              {result.missingRequirements.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <SectionHeading>
                      {result.fulfillsRequirements ? "Gaps to Strengthen" : "Missing Requirements"}
                    </SectionHeading>
                    <ul className="space-y-1.5">
                      {result.missingRequirements.map((req, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-mm-steel"
                        >
                          <span
                            className={cn(
                              "mt-1.5 size-1.5 shrink-0 rounded-full",
                              result.fulfillsRequirements ? "bg-amber-500" : "bg-mm-error"
                            )}
                          />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {result.tailoredResume && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-mm-ink">Resume Review</h2>
                <p className="text-sm text-mm-steel">
                  Your tailored resume, formatted like the downloadable PDF.
                </p>
              </div>
              <ResumePreview resume={result.tailoredResume} />
              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    try {
                      await handleDownload(result.tailoredResume!)
                    } catch (err) {
                      console.error(err)
                      setError(err instanceof Error ? err.message : "Failed to generate PDF. Please try again.")
                    }
                  }}
                >
                  Download Resume
                </Button>
              </div>
            </>
          )}

          {result.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
                <CardDescription>Tailored to this job description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-mm-steel">
                  {result.coverLetter}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadCoverLetter(result.coverLetter!)}
                  >
                    Download Cover Letter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
