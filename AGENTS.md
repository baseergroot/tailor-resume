<!-- BEGIN:nextjs-agent-rules -->

use pnpm

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project memory

Read `PROJECT_CONTEXT.md` (repo root) for the full picture — it describes the app, the resume-analysis pipeline, file map, routes, and design tokens. This file holds only always-on rules.

# Always-on rules

- Use `pnpm`, never npm/yarn.
- This is an AI resume-tailoring SaaS (Next.js 16, AI SDK `ai` v7, @ai-sdk/google `gemini-3.1-flash-lite`, MongoDB/Mongoose, Clerk, @react-pdf/renderer).
- The resume pipeline runs in `src/actions/agentRunner.ts` (shared by the `mainAgent.ts` server action and the SSE route `src/app/api/resume/analyze/route.ts`).
- Agent invariants (do NOT regress): when must-have requirements are missing, the agent must NOT call `resumeRewriter` and `tailoredResume` stays empty; `matchLevel` is independent of `fulfillsRequirements`; never list must-have gaps together with `fulfillsRequirements: true`.
- `resumeRewriter` is preservation-first: keep every technology/skill from the original resume, keep all metrics, never invent skills/experiences, only use JD keywords truthfully supported by the resume.
- Use the `mm-*` design-token system in components (e.g. `text-mm-steel`, `bg-mm-surface`, `mm-btn mm-btn-primary`, `mm-card`) instead of raw Tailwind palette colors.
- Don't add code comments unless asked.
- Run `pnpm exec tsc --noEmit` and lint changed files after edits.
