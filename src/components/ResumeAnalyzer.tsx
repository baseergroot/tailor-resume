"use client"

import { useState, useTransition } from "react"
import { resumeAgent } from "@/actions/mainAgent"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
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

type AnalysisResult = Awaited<ReturnType<typeof resumeAgent>>

type Resume = NonNullable<AnalysisResult["tailoredResume"]>

function formatResumeAsText(resume: Resume): string {
  const lines: string[] = []

  if (resume.summary) {
    lines.push(resume.summary, "")
  }

  if (resume.skills.length > 0) {
    lines.push("TECHNICAL SKILLS", resume.skills.join(" | "), "")
  }

  if (resume.experience.length > 0) {
    lines.push("EXPERIENCE")
    resume.experience.forEach((exp) => {
      lines.push(`${exp.role} at ${exp.company}`)
      if (exp.duration) lines.push(exp.duration)
      exp.responsibilities.forEach((r) => lines.push(`  - ${r}`))
      if (exp.technologies.length > 0) lines.push(`  Technologies: ${exp.technologies.join(", ")}`)
      lines.push("")
    })
  }

  if (resume.projects.length > 0) {
    lines.push("PROJECTS")
    resume.projects.forEach((proj) => {
      lines.push(proj.name)
      lines.push(`  ${proj.description}`)
      if (proj.technologies.length > 0) lines.push(`  Technologies: ${proj.technologies.join(", ")}`)
      lines.push("")
    })
  }

  if (resume.education.length > 0) {
    lines.push("EDUCATION")
    resume.education.forEach((edu) => {
      const parts = [edu.degree, edu.field].filter(Boolean).join(" in ")
      lines.push(`${edu.institution}${parts ? ` — ${parts}` : ""}`)
    })
  }

  return lines.join("\n")
}

function handleDownload(resume: Resume) {
  const text = formatResumeAsText(resume)
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "tailored-resume.txt"
  a.click()
  URL.revokeObjectURL(url)
}

function MatchBadge({ level }: { level: AnalysisResult["matchLevel"] }) {
  const variant = level === "strong" ? "default" : level === "partial" ? "secondary" : "destructive"
  const label = level.charAt(0).toUpperCase() + level.slice(1)
  return <Badge variant={variant}>{label} Match</Badge>
}

function ScoreRing({ score }: { score: number }) {
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
          <span className="text-[10px] text-muted-foreground">ATS</span>
        </div>
      </div>
    </div>
  )
}

function ResumePreview({ resume }: { resume: Resume }) {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl">Tailored Resume</CardTitle>
        <CardDescription>AI-optimized for this position</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {resume.summary && (
          <section>
            <SectionHeading>Summary</SectionHeading>
            <p className="text-sm leading-relaxed text-muted-foreground">{resume.summary}</p>
          </section>
        )}

        {resume.skills.length > 0 && (
          <section>
            <SectionHeading>Technical Skills</SectionHeading>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section className="space-y-4">
            <SectionHeading>Experience</SectionHeading>
            {resume.experience.map((exp, i) => (
              <div key={i} className="space-y-2">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h4 className="text-sm font-semibold">{exp.role}</h4>
                  {exp.duration && (
                    <span className="text-xs text-muted-foreground">{exp.duration}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{exp.company}</p>
                <ul className="space-y-1 pl-4">
                  {exp.responsibilities.map((r, j) => (
                    <li key={j} className="text-sm text-muted-foreground list-disc marker:text-border">
                      {r}
                    </li>
                  ))}
                </ul>
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-[10px]">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                {i < resume.experience.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </section>
        )}

        {resume.projects.length > 0 && (
          <section className="space-y-4">
            <SectionHeading>Projects</SectionHeading>
            {resume.projects.map((proj, i) => (
              <div key={i} className="space-y-1.5">
                <h4 className="text-sm font-semibold">{proj.name}</h4>
                <p className="text-sm text-muted-foreground">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-[10px]">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {resume.education.length > 0 && (
          <section className="space-y-2">
            <SectionHeading>Education</SectionHeading>
            {resume.education.map((edu, i) => {
              const parts = [edu.degree, edu.field].filter(Boolean).join(" in ")
              return (
                <div key={i}>
                  <p className="text-sm font-medium">{edu.institution}</p>
                  {parts && <p className="text-xs text-muted-foreground">{parts}</p>}
                </div>
              )
            })}
          </section>
        )}
      </CardContent>
    </Card>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      {children}
    </h3>
  )
}

export default function ResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return

    setError("")
    setResult(null)

    startTransition(async () => {
      try {
        const analysis = await resumeAgent(jobDescription)
        setResult(analysis)
      } catch (err) {
        console.error(err)
        const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
        if (/no output generated/i.test(message)) {
          setError(
            "The AI couldn't produce a result this time. The analysis runs several agent steps and occasionally exceeds its step limit. Please try again — if it keeps failing, try a shorter job description."
          )
        } else {
          setError(message)
        }
      }
    })
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
            disabled={isPending}
          />

          <Button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || isPending}
          >
            {isPending ? "Analyzing..." : "Analyze Resume"}
          </Button>

          {isPending && (
            <div className="space-y-3 pt-2">
              <Progress value={null}>
                <ProgressLabel>Analyzing your resume</ProgressLabel>
                <ProgressValue />
              </Progress>
              <p className="text-xs text-muted-foreground">
                Matching skills, evaluating ATS compatibility, and generating your tailored resume...
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
              <div className="flex items-start gap-6">
                <ScoreRing score={result.atsScore} />
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

              <Separator />

              <div>
                <SectionHeading>Summary</SectionHeading>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {result.summary}
                </p>
              </div>

              {result.missingRequirements.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <SectionHeading>Missing Requirements</SectionHeading>
                    <ul className="space-y-1.5">
                      {result.missingRequirements.map((req, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
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
              <ResumePreview resume={result.tailoredResume} />
              <div className="flex justify-end">
                <Button onClick={() => handleDownload(result.tailoredResume!)}>
                  Download Resume
                </Button>
              </div>
            </>
          )}

          {!result.tailoredResume && !result.fulfillsRequirements && (
            <Alert>
              <AlertDescription>
                Your resume doesn&apos;t currently meet the important requirements for this position.
                Consider adding relevant experience or skills before re-analyzing.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  )
}
