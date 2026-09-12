import { cn } from "@/lib/utils"

export type ToolStepStatus = "pending" | "running" | "done" | "error"

export type ToolStep = {
  id: number
  toolCallId: string
  toolName: string
  label: string
  status: ToolStepStatus
  executionCount: number
  durationMs?: number
}

const TOOL_LABELS: Record<string, string> = {
  jobDescriptionAnalyser: "Job Description Analysis",
  resumeAnalyser: "Resume Analysis",
  gapAnalyser: "Gap Analysis",
  atsScorer: "ATS Scoring",
  resumeRewriter: "Resume Rewriter",
  coverLetterGenerator: "Cover Letter Generator",
}

export function toolLabel(toolName: string): string {
  return TOOL_LABELS[toolName] ?? toolName
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  const seconds = ms / 1000
  if (seconds < 60) return `${Math.round(seconds * 10) / 10}s`
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.round(seconds % 60)
  return `${minutes}m ${remainder}s`
}

function StatusIcon({ status }: { status: ToolStepStatus }) {
  if (status === "running") {
    return (
      <span className="size-3.5 rounded-full border-2 border-mm-hairline border-t-mm-ink animate-spin" />
    )
  }
  if (status === "done") {
    return <span className="text-mm-success-text">✓</span>
  }
  if (status === "error") {
    return <span className="text-mm-error">✗</span>
  }
  return <span className="size-3.5 rounded-full border-2 border-mm-hairline bg-mm-muted/20" />
}

export default function ToolStepper({ steps }: { steps: ToolStep[] }) {
  if (steps.length === 0) return null

  return (
    <div className="rounded-xl border border-mm-hairline bg-mm-surface p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-mm-muted">
        Analysis pipeline
      </p>
      <ol className="space-y-0">
        {steps.map((step) => (
          <li key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-6 items-center justify-center">
                <StatusIcon status={step.status} />
              </div>
              {step.id < steps.length && <div className="w-px flex-1 bg-mm-hairline" />}
            </div>
            <div className="min-w-0 flex-1 pb-5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    step.status === "done" || step.status === "running"
                      ? "text-mm-ink"
                      : step.status === "error"
                        ? "text-mm-error"
                        : "text-mm-muted"
                  )}
                >
                  {step.label}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-mm-muted">
                  {step.status === "running"
                    ? "running…"
                    : step.status === "done"
                      ? step.durationMs != null
                        ? formatDuration(step.durationMs)
                        : "done"
                      : step.status === "error"
                        ? "failed"
                        : "waiting"}
                </span>
              </div>
              <span className="text-xs text-mm-muted">run #{step.executionCount}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}