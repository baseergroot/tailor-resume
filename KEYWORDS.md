# Keyword Tracking

Keywords Hirefit (`hirefit.live`) is optimized for. Update ranks as you check them. Confidence column: how likely the site can realistically rank for it today (content exists + indexed).

Legend for tracking columns:
- **Rank**: position in Google SERP (fill in after checking). "NR" = not ranking.
- **Status**: 🎯 ranking, 🕳 no visibility, 🏗 no page/weak page, ➕ = new opportunity (not yet targeted)

> ### SERP audit — 2026-09-16 (live checks)
> Results so far: hirefit.live does NOT appear on page 1 (or top ~8 organic results) for any term
> below. Page 1 is owned almost entirely by established resume brands (Kickresume, Enhancv, Zety,
> resumetailor.ai, MatchResume, Indeed) + many newer purpose-built free tools (MatchCV, Plushly,
> ResumeAtlas, ResumeAI, atspass, ATS Verification…). The site was indexed only recently; indexing
> is weeks ahead of ranking. Treat Status ✅/🎯 as "ranks" and 🕳 as "no visibility" until you see
> your own SERPs — and only after monitoring for 4–8 weeks.

## Core (money keywords)

| # | Keyword | Search intent | Target page | H1 / title cues | Confidence | Rank | Status |
|---|---------|--------------|-------------|------------------|-----------|------|--------|
| 1 | resume tailoring | Transactional | `/` | "Tailor Your Resume to Any Job" | High | NR | 🕳 |
| 2 | AI resume tailoring | Transactional | `/` | title "AI Resume Tailoring & ATS Optimization" | Highest | NR | 🕳 |
| 3 | tailor resume for job description | Transactional | `/` | FAQ "How do I tailor my resume to a job description?" | High | NR | 🕳 |
| 4 | resume optimization | Transactional | `/` | "resume optimization" in feature copy | Medium | NR | 🕳 |
| 5 | ATS resume optimization | Transactional | `/`, `/tools/ats-scoring` | meta title | High | NR | 🕳 |
| 6 | tailor resume with AI | Transactional | `/` | hero copy | Medium | NR | 🕳 |
| 7 | free AI resume tool | Transactional | `/` | "…six AI tools…free to use" | High | NR | 🕳 |

## Tool pages (pSEO — each `/tools/*` targets its own term)

| # | Keyword | Search intent | Target page | H1 / title cues | Confidence | Rank | Status |
|---|---------|--------------|-------------|------------------|-----------|------|--------|
| 8 | ATS score | Informational | `/tools/ats-scoring` | "Free ATS Resume Scoring" / meta "ATS Scoring" | Highest | | |
| 9 | check resume ATS compatibility | Informational | `/tools/ats-scoring` | meta title | High | | |
| 10 | resume analyzer | Informational | `/tools/resume-analyzer` | "Free AI Resume Analysis" | Highest | | |
| 11 | free AI resume review | Informational | `/tools/resume-analyzer` | meta title | High | | |
| 12 | job description analyzer | Informational | `/tools/jd-analyzer` | "Analyze Any Job Description" | High | | |
| 13 | extract keywords from job description | Informational | `/tools/jd-analyzer` | meta title, how-it-works | Medium | | |
| 14 | resume gap analysis | Informational | `/tools/gap-analyzer` | "Identify Your Resume Gaps" | Medium | | |
| 15 | find missing skills on resume | Informational | `/tools/gap-analyzer` | meta title | Medium | | |
| 16 | AI resume rewriter | Transactional | `/tools/resume-rewriter` | "AI Resume Rewriting…" / meta title | Highest | | |
| 17 | rewrite resume for any job | Transactional | `/tools/resume-rewriter` | meta title | Medium | | |
| 18 | AI cover letter generator | Transactional | `/tools/cover-letter-generator` | "Free AI Cover Letter Generator" | Highest | | |

## Support / long-tail (nested in FAQ + copy)

| # | Keyword | Search intent | Target page | Cue | Confidence | Rank | Status |
|---|---------|--------------|-------------|-----|-----------|------|--------|
| 19 | what is an ATS resume score | Informational (FAQ) | `/` | FAQPage JSON-LD | High | | |
| 20 | will AI invent my experience | Informational (FAQ) | `/`, `/tools/resume-rewriter` | FAQ "Will the rewriter invent skills…?" | Medium | | |
| 21 | is AI resume rewriting free | Informational (FAQ) | `/`, `/tools/resume-analyzer` | FAQ "Is the resume analysis really free?" | Medium | | |
| 22 | what resume formats are supported pdf docx | Informational (FAQ) | `/` | FAQ "Which resume formats…?" | Low | | |
| 23 | ats score before and after | Informational | `/tools/ats-scoring` | "before-and-after score" | Medium | | |

## Nearby opportunities (not yet targeted — test after core terms)

| # | Keyword | Search intent | Gap | Confidence | Status |
|---|---------|--------------|-----|-----------|--------|
| 24 | how to beat ATS | Informational | No dedicated content | Medium | ➕ |
| 25 | resume keyword matching | Informational | Only covered inside tool copy | Medium | ➕ |
| 26 | ats-friendly resume tips | Informational | No listicle page | High | ➕ |
| 27 | keywords to include in resume | Informational | No listicle page | High | ➕ |
| 28 | cover letter for specific job | Transactional | Only the generator tool | Medium | ➕ |

---

## Realistic short-term targets (publish content, then chase these)

The core terms above are 3–6+ month campaigns against DR 60–90 domains. These lower-competition
terms are where a new domain can actually win in the next few weeks — but note even "free ATS
checker" is crowded with purpose-built tools, so you need a real content page plus backlinks, not
just a tool page.

| # | Keyword | Why winnable | What to publish on |
|---|---------|--------------|--------------------|
| A | how to tailor a resume to a job description (guide) | Page-1 is blog guides, not tools — a good guide can compete | new blog page `/guides/tailor-resume-to-job-description` |
| B | ats-friendly resume tips | List-style, no product dominance on page 1 | new blog listicle `/guides/ats-friendly-resume-tips` |
| C | keywords to include in a resume | Informational listicle demand | new blog listicle `/guides/resume-keywords` |
| D | what is a good ats resume score | FAQ intent, low competition | existing `/tools/ats-scoring` FAQ |
| E | resume keyword matching | Informational, weak page-1 signal | `/tools/jd-analyzer` + guide |

## How to test a keyword

1. Search `site:hirefit.live <keyword>` first to confirm a page exists.
2. Open an incognito window and search the keyword on Google (no personalization).
3. Fill in the **Rank** and **Status** columns above.
4. Expect Google to take days–weeks to move positions; rank checks daily for the first week, then weekly.

## Ranking signals present (from project memory)

- Indexed: `site:hirefit.live` returns pages — confirmed working.
- `/` static with `Cache-Control: s-maxage=31536000`; sitemap at `/sitemap.xml`; robots.txt present.
- JSON-LD: Organization, WebSite, SoftwareApplication + FAQPage on `/`, FAQPage on each `/tools/*`.
- `public/llms.txt` + `public/pricing.md` for AI/answer-engine surfaces.
- GA4 (`G-FJRJRDMKL3`) live for measuring landing traffic from each keyword.