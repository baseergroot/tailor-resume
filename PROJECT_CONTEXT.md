# Project Context — TailorResume

Read this before working on this repo so you don't have to re-explore the whole codebase. It is a living document — update it when the system changes.

## What is this?

An AI resume-analysis + job-tailoring SaaS. Users upload a resume, paste a job description, and get:
- a structured analysis (match level, ATS keyword coverage, gaps),
- an ATS-tailored resume (rewritten, downloadable as PDF),
- optionally a tailored cover letter,
- real-time progress showing which AI tool is running.

## Stack

- **Next.js 16.3.1** (App Router) + React 19 + TypeScript + Tailwind v4 — NOTE: this is a Next.js version with breaking changes vs. older Next. Read `node_modules/next/dist/docs/` before writing Next code. `use pnpm` always.
- **AI SDK `ai` v7 + @ai-sdk/google** — agents use `google("gemini-3.1-flash-lite")`. `ToolLoopAgent` (AI SDK) drives the analysis.
- **MongoDB + Mongoose 9** — `User.resume.resumeText` stores the uploaded resume text.
- **Clerk** auth (`@clerk/nextjs/server` `auth()`); **Upstash** rate limiting (`@upstash/ratelimit` + `@upstash/redis`).
- **@react-pdf/renderer** for server-side ATS-safe PDF generation; **zod** for all schemas; **unpdf** for resume parsing.

## Where things live

| Concern | File |
|---|---|
| Agent runner (analysis pipeline) | `src/actions/agentRunner.ts` |
| Server action wrapper | `src/actions/mainAgent.ts` |
| The 6 agent tools | `src/tools/allTools.ts` |
| Deterministic ATS keyword coverage | `src/helper/atsScore.ts` |
| Zod schemas (agent output, resume, ats, gap, jd) | `src/schema/` |
| Resume → PDF rendering | `src/lib/resumePdf.tsx` |
| Main client component (analysis UI + stepper) | `src/components/ResumeAnalyzer.tsx` |
| Tool-progress stepper (n8n-style) | `src/components/ToolStepper.tsx` |
| Resume upload form | `src/components/forms/resumeUploadForm.tsx` |
| Chat UI + chat agent code (separate feature) | `src/components/chat-view.tsx`, `src/app/api/chat/*` |

## The resume-analysis pipeline

`POST /api/resume/analyze` (SSE) → `runResumeAnalysis()` in `agentRunner.ts` → `ToolLoopAgent` with gemini-3.1-flash-lite.

Agent tools (in execution order the agent is told to follow):
1. `jobDescriptionAnalyser` — extract structured JD (required/preferred skills, ATS keywords, responsibilities).
2. `resumeAnalyser` — extract structured resume (`ResumeSchema`) from `User.resume.resumeText`.
3. `gapAnalyser` — compare resume vs JD.
4. `atsScorer` — ATS-style evaluation of the saved resume.
5. `resumeRewriter` — ONLY called when `fulfillsRequirements === true` (preservation-first prompt; must not invent skills, must keep all original tech/metrics).
6. `coverLetterGenerator` — only invoked when the user toggles "also generate a cover letter".

Post-processing (deterministic, in `runResumeAnalysis`): extract JD keywords once, compute keyword coverage % over the original resume (→ `atsScore`) and, if present, over the tailored resume (→ `tailoredAtsScore`, `atsMatchedKeywords`, `atsMissingKeywords`).

Streaming events (SSE `data:` JSON lines, `\n\n`-framed):
- `{ type: "start", toolName, executionCount }`
- `{ type: "end", toolName, status: "ok"|"error", error?, durationMs }`
- `{ type: "result", output }` — final `AgentResponseSchema`
- `{ type: "error", message }`

The client (`ResumeAnalyzer.tsx`) reads the stream and drives `ToolStepper`.

## Agent agent behavior invariants (from repo decisions — do not regress)

- **Block when must-have requirements are missing**: `fulfillsRequirements=false` → agent does NOT call `resumeRewriter`, `tailoredResume` stays empty, missing list must be the must-have gaps; UI shows a "don't apply, focus on fitting roles" alert and no PDF download.
- **Consistency contract**: Matched Level is independent of `fulfillsRequirements`; never produce both "Yes" (requirements met) AND must-have gap lists.
- **Keyword-preservation**: the rewriter keeps every technology/skill already in the original resume; conciseness applies to wording, not keyword coverage (this was a bug: tailored ATS score dropped below original when techs were trimmed).
- **No fabricated content**: never add a technology/skill/metric that isn't in the original resume.

## Pages / routes

- `/` — marketing landing page.
- `/dashboard` — auth-gated; shows upload form (hidden when `User.resume` exists) + `ResumeAnalyzer`.
- `/chat/[chatId]` and `/[chatId]` — chat feature (separate from resume pipeline).
- `/api/resume/analyze` — POST (SSE analysis; the one the client uses).
- `/api/resume/pdf` — POST; validates `ResumeSchema`, returns `application/pdf` blob.
- `/api/chat/*`, `/api/webhook/clerk`, `/api/create-user`, `/api/env`, `/api/models`, `/api/ratelimit` — chat/clerk/env infrastructure (auth + rate-limit aware).

## Conventions / gotchas

- **Design tokens**: components use an `mm-*` token system (`bg-mm-canvas`, `text-mm-steel`, `text-mm-ink`, `text-mm-muted`, `border-mm-hairline`, `bg-mm-surface`, `mm-btn mm-btn-primary`, `mm-card`, `mm-badge-*`, colors: `mm-success-*`, `mm-error`, `mm-primary`, `mm-blue-*`). Match these instead of raw Tailwind palette classes.
- Components import `cn` from `@/lib/utils` (shadcn `cn` package is also a dependency; both work).
- **Do NOT add comments to code** unless asked.
- **Auth**: services re-auth inside tools/routes via `auth()` + `User.findOne({ clerkUserId: userId })`; `connectDB()` before Mongo access.
- **Do NOT touch `src/app/api/chat/route.ts`** and the chat scheduling-tool TODOs unless explicitly asked — they are a separate feature with their own in-flight work (`bookAppointmentTool`, `checkAvailableSlotsTool` are a TODO, currently commented out).
- Don't install new deps for small things; `shadcn` is available for UI primitives. `@remixicon/react` for icons.
- Existing eslint/typecheck: repo currently passes `pnpm exec tsc --noEmit` and `pnpm exec eslint`. Run both after changes.

## Commands

```bash
pnpm dev                     # dev server
pnpm exec tsc --noEmit       # typecheck
pnpm exec eslint <file...>   # lint specific files
pnpm build                   # production build (needs env vars / DB)
```

## Known open threads (as of the repo's current iteration)

- Stepper + cover-letter toggle shipped; everything else is ongoing iteration.
- The chat/booking feature (`bookAppointmentTool`, `checkAvailableSlotsTool`) is a stub/TODO.