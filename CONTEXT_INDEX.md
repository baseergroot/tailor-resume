# HireFit Project Context Index

**Project:** HireFit - AI Resume Tailoring & ATS Optimization Platform  
**Last Updated:** October 6, 2026  
**Repository:** `github.com/baseergroot/tailor-resume`  
**Production URL:** `https://hirefit.live`  
**Preview Deployment:** `tailor-resume-agent-b4dxfqoaq-baseer-afridis-projects.vercel.app`

---

## 📁 Context Files

| File | Description |
|------|-------------|
| [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md) | High-level project description, tech stack, features |
| [`TECH_STACK.md`](TECH_STACK.md) | Detailed technology choices, versions, rationale |
| [`SEO_AUDIT_FIXES.md`](SEO_AUDIT_FIXES.md) | Complete log of SEO audit issues and fixes applied |
| [`TECHNICAL_FIXES.md`](TECHNICAL_FIXES.md) | Technical fixes: redirects, sitemap, robots, middleware |
| [`CODE_STRUCTURE.md`](CODE_STRUCTURE.md) | Codebase organization, key files, patterns |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Vercel deployment, domains, DNS, CI/CD |
| [`ANALYTICS_SETUP.md`](ANALYTICS_SETUP.md) | Analytics events, tracking, admin dashboard |
| [`API_REFERENCE.md`](API_REFERENCE.md) | API routes, server actions, webhooks |
| [`UI_COMPONENTS.md`](UI_COMPONENTS.md) | Design system, component library, styling |
| [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) | MongoDB models, schemas, indexes |
| [`ENV_CONFIG.md`](ENV_CONFIG.md) | Environment variables, secrets, configuration |
| [`TODO_NEXT_STEPS.md`](TODO_NEXT_STEPS.md) | Pending tasks, future improvements |

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Type checking
pnpm exec tsc --noEmit

# Linting
pnpm lint

# Production build
pnpm build

# Deploy to Vercel
vercel --prod
```

---

## 🔑 Key URLs

| Environment | URL |
|-------------|-----|
| Production | https://hirefit.live |
| Preview | tailor-resume-agent-b4dxfqoaq-baseer-afridis-projects.vercel.app |
| Vercel Dashboard | https://vercel.com/baseer-afridis-projects/tailor-resume-agent |
| GSC | https://search.google.com/search-console?resource_id=sc-domain%3Ahirefit.live |
| Clerk Dashboard | https://dashboard.clerk.com/apps/app_2r... |

---

## ⚠️ Critical Context for New Session

1. **Sitemap redirect loop was fixed** - moved www→non-www redirect from `next.config.ts` to `src/proxy.ts` with exclusions for `/sitemap*` and `/robots.txt`
2. **Middleware → Proxy migration** - Next.js 16 uses `proxy.ts` instead of `middleware.ts` (removed deprecated `createRouteMatcher`)
3. **Brand is "HireFit"** (capital F) - standardized across all files
4. **Sitemap accessible at** `https://hirefit.live/sitemap.xml` (200 OK, XML)
5. **Redirects:** `www.hirefit.live` → `hirefit.live` (307), sitemap excluded
6. **Robots.txt** blocks `/clerk/` and `clerk.hirefit.live` subdomain
7. **Analytics** - custom implementation in `src/lib/analytics/`, admin at `/admin/analytics`
7. **Clerk auth** - middleware simplified, auth checks in server actions/layouts
8. **AI Tools** - 6 tools: JD Analyzer, Resume Analyzer, Gap Analyzer, ATS Scorer, Resume Rewriter, Cover Letter Generator
9. **Anonymous flow** - first tailoring free (localStorage count), then login required

---

## 📝 Last Session Summary

**Completed SEO Audit Fixes:**
- H1: "Tailor Your Resume to Any Job Description in 30 Seconds"
- Brand: "HireFit" (capital F) everywhere
- Social images: both OG and Twitter use `/og.png`
- Answer-first paragraph below H1
- FAQ/JSON-LD sync verified
- Footer: About, Contact, Privacy, Terms, Legal links added
- Claims disclaimer added (* with footnote)
- Internal links from landing page to tool pages
- Sitemap with static BUILD_DATE
- Middleware → Proxy migration (Next.js 16)
- Clerk auth layout noindex meta
- All builds pass: `pnpm build`, `tsc`, `lint`

**Pending GSC Action:** Resubmit sitemap at `https://hirefit.live/sitemap.xml` in GSC