# Hirefit — AI Resume Tailoring & ATS Optimization

Free AI-powered resume tailoring platform. Upload your resume, paste a job description, and get an ATS-optimized tailored resume + cover letter in under a minute.

## What it does

1. **Upload resume** (PDF/DOCX, up to 5MB) — parsed and stored securely
2. **Paste job description** — AI extracts requirements, skills, keywords
3. **Get tailored resume** — AI rewrites your bullets to match the JD while preserving every fact from your original resume
4. **Download PDF** — Formatted, ATS-friendly, ready to apply
5. **Optional cover letter** — Generated from the tailored resume

**First tailoring is free without signup.** Second tailoring requires Google sign-in (resume is saved to your account).

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **AI** | Vercel AI SDK v7, Google Gemini 3.1 Flash Lite |
| **Auth** | Clerk (Google OAuth) |
| **Database** | MongoDB + Mongoose 9 |
| **PDF** | @react-pdf/renderer |
| **UI** | shadcn/ui (Tailwind CSS v4, custom `mm-*` design tokens) |
| **Analytics** | Custom MongoDB events (funnel, recent events, date filters) |

## Key Features

- **Preservation-first tailoring** — Never invents skills, metrics, or experience. Only uses JD keywords truthfully supported by your resume.
- **6 AI tools** — JD Analyzer, Resume Analyzer, Gap Analyzer, ATS Scorer, Resume Rewriter, Cover Letter Generator
- **Anonymous-first flow** — Try once without account, then sign in to continue
- **Real-time streaming** — Tool-by-tool progress via SSE + `ToolStepper`
- **Admin analytics** — `/admin/analytics` (email-gated) with funnel, conversion rates, recent events table

## Project Structure

```
src/
├── app/
│   ├── (app)/dashboard/           # Authenticated dashboard (client component)
│   ├── (marketing)/               # Landing page, tools pages, guides
│   ├── admin/analytics/           # Admin dashboard (server + client)
│   ├── api/
│   │   ├── resume/
│   │   │   ├── analyze/route.ts          # Authenticated SSE streaming
│   │   │   ├── analyze-anonymous/route.ts # Anonymous SSE streaming
│   │   │   ├── upload-anonymous/route.ts  # Anonymous resume parse
│   │   │   └── pdf/route.ts               # PDF generation
│   │   ├── tool/[slug]/route.ts          # Single-tool endpoints
│   │   ├── analytics/track/route.ts       # Client analytics ingestion
│   │   └── webhook/clerk/route.ts         # Clerk user sync
│   ├── (auth)/sign-in/            # Clerk sign-in
│   └── (auth)/sign-up/            # Clerk sign-up
├── actions/
│   ├── agentRunner.ts             # Main agent pipeline (auth + anonymous)
│   ├── singleToolRunner.ts        # Individual tool agents
│   ├── handleResumeUpload.ts      # Authenticated resume upload
│   └── savePendingResume.ts       # Save anonymous resume after login
├── components/
│   ├── ResumeAnalyzer.tsx         # Main analysis UI (anonymous + auth)
│   ├── DashboardContent.tsx       # Dashboard with anonymous/auth logic
│   ├── SingleToolRunner.tsx       # Embedded tool runner for marketing pages
│   ├── ToolStepper.tsx            # Live tool execution progress
│   ├── CTATracking.tsx            # Landing CTA analytics
│   └── ui/                        # shadcn/ui primitives (Button, Card, Badge, etc.)
├── lib/
│   ├── analytics/
│   │   ├── track-event.ts         # Server-side fire-and-forget analytics
│   │   ├── track-event-client.ts  # Client-side analytics via API
│   │   └── event-types.ts         # Event name enum
│   ├── anonymous-storage.ts       # localStorage helpers (count, pending resume)
│   ├── db.ts                      # MongoDB connection
│   └── utils.ts                   # cn() helper
├── models/
│   ├── User.ts                    # Clerk user + resume text
│   └── AnalyticsEvent.ts          # Analytics event schema
├── tools/
│   └── allTools.ts                # 6 AI tools with Zod schemas
├── schema/
│   ├── agentResponseSchema.ts     # Full pipeline output
│   ├── resumeSchema.ts            # Structured resume
│   ├── jobDescriptionSchema.ts    # Structured JD
│   ├── gapSchema.ts               # Gap analysis
│   └── atsScoreSchema.ts          # ATS scoring
└── data/
    └── tools.ts                   # Tool marketing data
```

## Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 10
- MongoDB Atlas cluster
- Clerk application (Google OAuth enabled)

### Environment Variables

Create `.env`:

```env
# AI
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/resume-tailor

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxx

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Install & Run

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

## Anonymous Flow (MVP Experiment)

1. User lands on `/dashboard` — no middleware redirect
2. Uploads resume → parsed → stored in `localStorage` (`novai_pending_resume`)
3. Pastes JD → clicks **Analyze** → calls `/api/resume/analyze-anonymous` with resume text
4. **First tailoring succeeds** → `novai_tailor_count` becomes `1`
5. **Second tailoring** → count ≥ 1 → shows login modal (no AI call)
6. User clicks **Continue with Google** → Clerk modal → on success:
   - `savePendingResume` server action saves resume to MongoDB
   - `novai_pending_resume` cleared
   - Page reloads → authenticated experience

## Analytics Events

| Event | When |
|-------|------|
| `landing_cta_clicked` | Hero/footer CTA clicked |
| `auth_started` | Sign-in page loaded / login modal opened |
| `signup_completed` | Clerk `user.created` webhook |
| `resume_uploaded` | Resume parsed + stored (auth or anonymous) |
| `jd_submitted` | JD submitted for analysis |
| `analysis_started` | SSE stream begins |
| `tailoring_completed` | AI pipeline finishes (includes `atsScore`) |
| `pdf_downloaded` | PDF generated successfully |

Anonymous events include `sessionId: "anonymous"` and `metadata: { anonymous: true }`.

Admin dashboard at `/admin/analytics` (hardcoded to `kiakaro69@gmail.com`).

## Commands

```bash
pnpm dev          # Development server
pnpm build        # Production build (typecheck + lint)
pnpm lint         # ESLint
pnpm exec tsc --noEmit  # TypeScript check
```

## License

MIT