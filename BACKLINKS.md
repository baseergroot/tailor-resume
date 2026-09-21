# Hirefit Backlinks — Playbook

Goal: build domain authority for `hirefit.live` so the pages in `KEYWORDS.md` can actually rank.

Reality check: a brand-new domain needs authority before any keyword moves. One good editorial
link beats 50 directory links. Realistic target: **5–10 quality links in the next 3 months**,
then compounding starts.

## Tier 1 — Do first (highest leverage)

### 1. ProductHunt launch
One of the few single events that can hand a resume tool dozens of referring domains in a week.

- [ ] Prep a launch page: logo, tagline, demo GIF, 3 bullets ("preservation-first AI tailoring", "ATS score before & after", "100% free, no invented experience")
- [ ] Link assets: `/dashboard`, `/tools/ats-scoring`, `/guides/tailor-resume-to-job-description`
- [ ] Get 3–5 friends/upvoters for the first hour (launch momentum determines visibility)
- [ ] Choose a launch day: Tuesday–Thursday, and a topic niche for Maker Hunt

### 2. AI tool directories (free, evergreen, accept new tools constantly)
Submit the same short blurb + `/tools/ats-scoring` link to each:

- [ ] AlternativeTo
- [ ] There's An AI For That
- [ ] Futurepedia
- [ ] TopAI.tools
- [ ] AllThingsAI
- [ ] Toolify
- [ ] AI Tool Hunt / AI Directory Hub / similar aggregators

### 3. "Best AI resume tools" roundups (most winnable link type)
These get rewritten every few months. Find the ranking roundups that don't list you and email
the author with: the tool, a direct link to the best page, one honest differentiator.

- [ ] Google: `"best AI resume tools"`, `"AI resume rewriter" roundup`, `"resume tailor" alternatives`
- [ ] Add each candidate (domain + contact) to the tracker in `BACKLINKS-TRACKER.md` (or this file — see template below)
- [ ] Email 5–10 authors using the outreach template

## Tier 2 — Content-driven (durable)

### 4. Publish data, get cited
Journalists and career bloggers link to data. Build one cheap-but-real data asset: e.g. "We
analyzed 500 job descriptions against 500 applicant resumes and found only 12% covered the
posting's top 3 must-have keywords" — (this analysis is exactly what `/dashboard` already runs).
- [ ] Draft the write-up in a blog-style page under `/guides/` or `/data/`
- [ ] Pitch it in HARO replies and roundup emails as an excerpt

### 5. HARO / Connectively / Featured
Sign up for journalist queries on "resume", "ATS", "job search", "cover letter". One good reply
= a Forbes/TheMuse-grade link. Low hit-rate, huge payoff.
- [ ] Create profiles on connectively.us (HARO successor), featured.com
- [ ] Set up daily email digest; reply to the 3–5 most relevant queries each day with a 100-word quote + link

### 6. Guest posts on career blogs
Mid-size career/resume blogs accept "how to tailor a resume" pitches. Author-bio backlink +
in-body link to the published guide.
- [ ] Compile 10 blogs that accept guest posts (Medium publications in careers/tech + independent career blogs)
- [ ] Pitch using the guest-post template below

## Tier 3 — Community (free, careful)

### 7. Reddit
- [ ] r/resumes, r/jobs, r/GetEmployed, r/careerguidance
- [ ] Answer tailoring questions genuinely; link the guide only when it IS the answer. ≤10% self-promo or the account gets flagged.

### 8. Quora
- [ ] Answer "How do I tailor my resume to a job description?" and similar with the guide.

### 9. Reciprocal swaps
Small exchanges with complementary (non-competing) free tools. Weak but harmless.

## What NOT to do
- ✗ Fiverr link packages / PBNs / forum spam / paid "dofollow" comments — will get penalized faster than they help
- ✗ Buying links in bulk from directories that sell placements

## 2-week sprint
1. ProductHunt prep + launch
2. Submit to 5 AI directories
3. Email 10 roundup authors using the new guide as the pitch link
4. Start HARO/Covered daily replies (10 min/day)
5. Check GSC daily for new impressions; log them in KEYWORDS.md

## Outreach templates

### Roundup email (short, personal, asset-first)

Subject: Quick add for your [Title] roundup

Hi [First name],

You rounded up [title of their listicle] and I noticed [competitor] is in it but we're not.

I run Hirefit — an AI resume tailor that's preservation-first: it rebuilds your resume for a
job description but never adds a skill or company that isn't in your original resume. It also
scores your ATS match before and after rewriting.

Here's the exact tool page: https://hirefit.live/tools/resume-rewriter

We're fully free, so your readers can try it in under a minute. Happy to update if you add us —
no strings.

[Your name]

### Guest post pitch

Subject: Guest post: "How to Tailor a Resume to Any Job: 2026 Walkthrough"

Hi [First name],

I write on practical, no-BS job-application topics. I'd love to contribute a step-by-step guide
to tailoring a resume to a job description — the 6-step process, what ATS filters actually
check, and the mistakes that get applications auto-rejected.

I've published a companion version already at https://hirefit.live/guides/tailor-resume-to-job-description
so you can see the quality and depth. It's original, non-promotional, and I'm happy to write it
fresh for your audience with your house style.

[Your name]

### Directory submission blurb (paste everywhere)

Hirefit — Free AI Resume Tailoring & ATS Score. Upload your resume, paste any job description,
and get an ATS compatibility score, missing-keyword list, and a rewritten resume that keeps
every real skill and metric. No invented experience, no signup wall: https://hirefit.live

## Automation status (what's already handled / what's manual)

| Task | Automated? | How |
|------|-----------|-----|
| Roundup ecosystem research | 🛠 Can draft | I can generate the query list + a CSV of candidates to work through |
| Outreach emails / PH copy / directory blurbs / guest pitches | ✅ Drafted | Templates above — only sending + personalization are manual (or see below) |
| Directory form submissions | ⚠️ Semi | Playwright could fill simple no-CAPTCHA forms, but most have CAPTCHA / ToS friction; recommend manual |
| HARO/Covered daily replies | 🛠 Can draft | I can pre-draft responses for the recurring resume/ATS topics |
| Keyword position monitoring | 🛠 Can build | GSC Search Analytics API script (weekly position/impression log) — ask to build |
| Actual link acquisition | ✗ | Requires a human identity to email/POST — no legit automation bypasses this |

## Tracker (copy this block per target)

| # | Site/Directory | URL | Contact | Outreach sent | Link live (URL) |
|---|----------------|-----|---------|---------------|-----------------|
| 1 | | | | ☐ | |