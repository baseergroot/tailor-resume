"use client"

import { useState } from "react"
import { ClerkProvider, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ToolStepper, { toolLabel, type ToolStep } from "@/components/ToolStepper"
import type {
  SingleToolSlug,
  SingleToolResult,
} from "@/actions/singleToolRunner"

type RunnerProps = {
  slug: SingleToolSlug
  needsJobDescription: boolean
}

type KeywordListProps = { title: string; items: string[]; tone?: "ok" | "warn" }

function KeywordList({ title, items, tone }: KeywordListProps) {
  if (!items.length) return null
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-mm-ink">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant={tone === "warn" ? "destructive" : "secondary"}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-mm-ink">{title}</h4>
      {children}
    </div>
  )
}

function AtsResultView({ result }: { result: SingleToolResult }) {
  const score = Number(result.score ?? 0)
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl font-bold text-mm-ink">{score}</div>
        <p className="text-sm text-mm-steel mt-1">ATS compatibility score</p>
      </div>
      <KeywordList title="Matched keywords" items={(result.matched_keywords ?? []) as string[]} />
      <KeywordList
        title="Missing keywords"
        items={(result.missing_keywords ?? []) as string[]}
        tone="warn"
      />
      <Section title="Strengths">
        <ul className="space-y-1">
          {((result.strengths ?? []) as string[]).map((s, i) => (
            <li key={i} className="text-sm text-mm-steel leading-relaxed list-disc ml-5">
              {s}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Weaknesses">
        <ul className="space-y-1">
          {((result.weaknesses ?? []) as string[]).map((s, i) => (
            <li key={i} className="text-sm text-mm-steel leading-relaxed list-disc ml-5">
              {s}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Recommendations">
        <ul className="space-y-1">
          {((result.recommendations ?? []) as string[]).map((s, i) => (
            <li key={i} className="text-sm text-mm-steel leading-relaxed list-disc ml-5">
              {s}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function JdResultView({ result }: { result: SingleToolResult }) {
  return (
    <div className="space-y-6">
      <Section title="Role and company">
        <p className="text-sm text-mm-steel">
          {String(result.role_title ?? "")}
          {result.company_name ? ` at ${String(result.company_name)}` : ""}
        </p>
        <p className="text-sm text-mm-steel">
          Experience required: <span className="text-mm-ink font-medium">{String(result.experience_required ?? "")}</span>
          {" · "}Tone: <span className="text-mm-ink font-medium capitalize">{String(result.tone ?? "")}</span>
          {" · "}Work mode: <span className="text-mm-ink font-medium capitalize">{String(result.remote_or_onsite ?? "")}</span>
          {" · "}Degree required: <span className="text-mm-ink font-medium">{result.degree_required ? "Yes" : "No"}</span>
        </p>
      </Section>
      <KeywordList title="Required skills" items={(result.required_skills ?? []) as string[]} />
      <KeywordList
        title="Preferred skills"
        items={(result.preferred_skills ?? []) as string[]}
      />
      <KeywordList title="ATS keywords" items={(result.ats_keywords ?? []) as string[]} />
      <Section title="Responsibilities">
        <ul className="space-y-1">
          {((result.responsibilities ?? []) as string[]).map((r, i) => (
            <li key={i} className="text-sm text-mm-steel leading-relaxed list-disc ml-5">
              {r}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function GapResultView({ result }: { result: SingleToolResult }) {
  return (
    <div className="space-y-6">
      <KeywordList title="Matched skills" items={(result.matched_skills ?? []) as string[]} />
      <KeywordList
        title="Missing required skills"
        items={(result.missing_required_skills ?? []) as string[]}
        tone="warn"
      />
      <KeywordList
        title="Missing preferred skills"
        items={(result.missing_preferred_skills ?? []) as string[]}
        tone="warn"
      />
      <KeywordList title="Matched keywords" items={(result.matched_keywords ?? []) as string[]} />
      <KeywordList
        title="Missing keywords"
        items={(result.missing_keywords ?? []) as string[]}
        tone="warn"
      />
      <Section title="Experience gaps">
        <ul className="space-y-1">
          {((result.experience_gaps ?? []) as string[]).map((g, i) => (
            <li key={i} className="text-sm text-mm-steel leading-relaxed list-disc ml-5">
              {g}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

type ResumeResult = {
  summary?: string
  skills?: string[]
  experience?: {
    company: string
    role: string
    duration?: string
    responsibilities: string[]
    technologies: string[]
  }[]
  education?: { institution: string; degree?: string; field?: string }[]
  projects?: { name: string; description: string; technologies: string[] }[]
}

function ResumeResultView({ result }: { result: SingleToolResult }) {
  const resume = result as ResumeResult
  return (
    <div className="space-y-6">
      {resume.summary && (
        <Section title="Summary">
          <p className="text-sm text-mm-steel leading-relaxed">{resume.summary}</p>
        </Section>
      )}
      {resume.skills && resume.skills.length > 0 && (
        <KeywordList title="Skills" items={resume.skills} />
      )}
      {resume.experience && resume.experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-3">
            {resume.experience.map((exp, i) => (
              <div key={i} className="rounded-lg border border-mm-hairline bg-mm-surface p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-mm-ink">
                    {exp.role}
                    <span className="text-mm-steel font-normal"> at {exp.company}</span>
                  </p>
                  {exp.duration && (
                    <span className="text-xs text-mm-muted">{exp.duration}</span>
                  )}
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.responsibilities.map((r, j) => (
                    <li key={j} className="text-sm text-mm-steel leading-relaxed list-disc ml-5">
                      {r}
                    </li>
                  ))}
                </ul>
                {exp.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
      {resume.education && resume.education.length > 0 && (
        <Section title="Education">
          <ul className="space-y-1">
            {resume.education.map((edu, i) => (
              <li key={i} className="text-sm text-mm-steel leading-relaxed list-disc ml-5">
                {[edu.degree, edu.field, edu.institution].filter(Boolean).join(" — ")}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {resume.projects && resume.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3">
            {resume.projects.map((project, i) => (
              <div key={i} className="rounded-lg border border-mm-hairline bg-mm-surface p-4">
                <p className="text-sm font-semibold text-mm-ink">{project.name}</p>
                <p className="text-sm text-mm-steel mt-1 leading-relaxed">
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function CoverLetterView({ result }: { result: SingleToolResult }) {
  const text = result.letter ?? ""
  return (
    <div className="space-y-4">
      <pre className="whitespace-pre-wrap rounded-lg border border-mm-hairline bg-mm-surface p-4 text-sm leading-relaxed text-mm-ink">
        {text}
      </pre>
      <Button
        variant="secondary"
        onClick={() => {
          const blob = new Blob([text], { type: "text/plain" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "cover-letter.txt"
          a.click()
          URL.revokeObjectURL(url)
        }}
      >
        Download .txt
      </Button>
    </div>
  )
}

function ResultView({ slug, result }: { slug: SingleToolSlug; result: SingleToolResult }) {
  if (slug === "ats-scoring") return <AtsResultView result={result} />
  if (slug === "jd-analyzer") return <JdResultView result={result} />
  if (slug === "gap-analyzer") return <GapResultView result={result} />
  if (slug === "cover-letter-generator") return <CoverLetterView result={result} />
  return <ResumeResultView result={result} />
}

function ToolBody({ slug, needsJobDescription }: RunnerProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<SingleToolResult | null>(null)
  const [error, setError] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<ToolStep[]>([])

  if (!isLoaded) {
    return (
      <Card className="my-8">
        <CardContent className="py-8 text-center text-sm text-mm-steel">
          Loading…
        </CardContent>
      </Card>
    )
  }

  if (!isSignedIn) {
    return (
      <Card className="my-8" id="run-tool">
        <CardHeader>
          <CardTitle className="text-lg">Use this tool free</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-mm-steel leading-relaxed">
            Sign in to run this tool with your saved resume.
          </p>
          <div className="flex flex-wrap gap-3">
            <SignInButton mode="modal">
              <Button className="mm-btn mm-btn-primary">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="mm-btn mm-btn-secondary">Create Account</Button>
            </SignUpButton>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleRun = async () => {
    if (isRunning) return
    if (needsJobDescription && !jobDescription.trim()) return

    setError("")
    setResult(null)
    setSteps([])
    setIsRunning(true)

    try {
      const response = await fetch(`/api/tool/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      })

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null)
        setError((body as { error?: string })?.error ?? "Something went wrong. Please try again.")
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      const handleEvent = (data: {
        type?: string
        toolCallId?: string
        toolName?: string
        executionCount?: number
        status?: "ok" | "error"
        error?: string
        durationMs?: number
        output?: SingleToolResult
        message?: string
      }) => {
        if (data.type === "start" && data.toolCallId) {
          setSteps((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              toolCallId: data.toolCallId!,
              toolName: data.toolName ?? "tool",
              label: toolLabel(data.toolName ?? "tool"),
              status: "running",
              executionCount: data.executionCount ?? 1,
            },
          ])
        } else if (data.type === "end" && data.toolCallId) {
          setSteps((prev) =>
            prev.map((step) =>
              step.toolCallId === data.toolCallId
                ? {
                    ...step,
                    status: data.status === "error" ? "error" : "done",
                    durationMs: data.durationMs,
                  }
                : step,
            ),
          )
        } else if (data.type === "result" && data.output) {
          setResult(data.output)
        } else if (data.type === "error") {
          setError(formatToolError(data.message ?? ""))
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const chunks = buffer.split("\n\n")
        buffer = chunks.pop() ?? ""
        for (const chunk of chunks) {
          const line = chunk.split("\n").find((l) => l.startsWith("data:"))
          if (!line) continue
          try {
            handleEvent(JSON.parse(line.slice(5).trim()))
          } catch {
            // skip malformed frame
          }
        }
      }
    } catch {
      setError("Couldn't reach our servers. Check your connection and try again.")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card className="my-8" id="run-tool">
      <CardHeader>
        <CardTitle className="text-lg">
          {needsJobDescription
            ? "Paste a job description to get started"
            : "Run the analysis on your saved resume"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {needsJobDescription && (
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description here…"
            rows={6}
          />
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="mm-btn mm-btn-primary"
            onClick={handleRun}
            disabled={isRunning || (needsJobDescription && !jobDescription.trim())}
          >
            {isRunning ? "Running…" : "Run Tool"}
          </Button>
          <Link
            href="/dashboard"
            className="text-sm text-mm-primary hover:underline font-medium"
          >
            Upload a different resume
          </Link>
        </div>

        {isRunning && (
          <div className="space-y-3">
            <ToolStepper steps={steps} />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && !isRunning && (
          <div className="pt-2">
            <ResultView slug={slug} result={result} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatToolError(message: string) {
  if (/sign in/i.test(message)) {
    return "Please sign in to use this tool."
  }
  if (/upload your resume/i.test(message)) {
    return "You haven't uploaded a resume yet. Upload one from the dashboard, then come back to run this tool."
  }
  if (/no output generated/i.test(message)) {
    return "Something went wrong on our end. Please try again in a minute."
  }
  return message
}

export default function SingleToolRunner(props: RunnerProps) {
  return (
    <ClerkProvider>
      <ToolBody {...props} />
    </ClerkProvider>
  )
}