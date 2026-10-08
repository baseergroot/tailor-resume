# Tech Stack

## Core Framework

| Component | Technology | Version | Notes |
|-----------|------------|---------|-------|
| Framework | Next.js | 16.3.1 (App Router) | Turbopack, React Compiler |
| Language | TypeScript | 5.x | Strict mode |
| Runtime | Node.js | 20.x | LTS |

## AI / LLM

| Component | Technology | Model | Purpose |
|-----------|------------|-------|---------|
| LLM Provider | Google AI | Gemini 3.1 Flash Lite | Primary LLM for all tools |
| AI SDK | Vercel AI SDK | v7 (`ai` package) | Streaming, tool calling, structured output |
| Schema Validation | Zod | 3.x | Structured output validation |

## Authentication

| Component | Technology | Notes |
|-----------|------------|-------|
| Auth Provider | Clerk | v7+ (Next.js middleware migration) |
| Auth Method | Google OAuth + Email | No passwords |
| Session | Clerk JWT | HttpOnly cookies |

## Database

| Component | Technology | Notes |
|-----------|------------|-------|
| Database | MongoDB Atlas | Mongoose ODM |
| ORM | Mongoose | v9 |
| Connection | Singleton pattern | `src/lib/db.ts` |

## UI / Styling

| Component | Technology | Notes |
|-----------|------------|-------|
| CSS Framework | Tailwind CSS | v4 (CSS-first config) |
| Design System | Custom `mm-*` tokens | `globals.css` with CSS variables |
| Components | shadcn/ui (Radix) | Modified with `mm-*` classes |
| Icons | Remix Icons | `remixicon` package |
| Fonts | DM Sans (sans), Geist Mono (mono) | Google Fonts via `next/font` |

## Analytics & Monitoring

| Component | Technology | Notes |
|-----------|------------|-------|
| Analytics | Custom implementation | `src/lib/analytics/` |
| Events | 8 event types | Fire-and-forget, non-blocking |
| Admin Dashboard | `/admin/analytics` | Protected by email allowlist |

## PDF Generation

| Component | Technology | Notes |
|-----------|------------|-------|
| PDF Generation | `@react-pdf/renderer` | Server-side in API route |

## Deployment & Infrastructure

| Component | Technology | Notes |
|-----------|------------|-------|
| Hosting | Vercel | Production + Preview |
| DNS | Vercel Domains | `hirefit.live`, `www.hirefit.live` |
| CDN | Vercel Edge | Global |
| CI/CD | GitHub → Vercel | Auto-deploy on push to main |
| Cache | Vercel Edge Cache | `max-age=0, must-revalidate` |

## Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Package Manager | pnpm | 9.x |
| Linting | ESLint | Next.js config |
| Type Checking | TypeScript | 5.x, strict mode |
| Formatting | Prettier | Via ESLint |
| Git Hooks | None | Manual |
| Testing | None yet | Planned: Vitest + Playwright |

## AI Tools Architecture

```
User Input (JD + Resume)
       │
       ▼
┌─────────────────────────────────────┐
│  ToolLoopAgent (Vercel AI SDK)      │
│  - Model: Gemini 3.1 Flash Lite    │
│  - Tools: 6 available              │
│  - Structured Output (Zod)         │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Tool Pipeline (sequential)         │
│  1. JD Analyzer → JD Schema         │
│  2. Resume Analyzer → Resume Schema │
│  3. Gap Analyzer → Gap Schema       │
│  4. ATS Scorer → ATS Schema         │
│  5. Resume Rewriter → Resume Schema │
│  6. Cover Letter → Text             │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Structured Output (Zod)            │
│  - Resume Schema                    │
│  - ATS Score                        │
│  - Gap Analysis                     │
│  - Cover Letter (text)              │
└─────────────────────────────────────┘
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js 16 App Router | Server components, streaming, RSC |
| Vercel AI SDK | Built-in streaming, tool calling, Zod |
| Clerk for Auth | Best DX for Next.js, managed auth |
| MongoDB + Mongoose | Flexible schema for resume data |
| Tailwind v4 | CSS-first, faster builds, CSS variables |
| Custom Design Tokens | Consistent theming, dark mode ready |
| Proxy over Middleware | Next.js 16 convention, www redirect logic |
| Server Actions | Mutations, auth, data fetching |
| SSE for Streaming | Real-time tool progress (ToolStepper) |

---

## Version Pinning Strategy

```json
{
  "dependencies": {
    "next": "16.3.1",
    "react": "19.x",
    "react-dom": "19.x",
    "ai": "7.x",
    "@ai-sdk/google": "latest",
    "@clerk/nextjs": "7.x",
    "mongoose": "9.x",
    "zod": "3.x",
    "tailwindcss": "4.x",
    "@react-pdf/renderer": "latest"
  }
}
```

**Policy:** Pin major versions, allow minor/patch updates. Major upgrades require testing.