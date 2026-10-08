# HireFit - Project Overview

## What is HireFit?

**HireFit** is a free AI-powered resume tailoring platform that helps job seekers optimize their resumes for specific job descriptions. It uses Google Gemini AI (via Vercel AI SDK) to analyze resumes against job descriptions and provide ATS-optimized tailored resumes, cover letters, and detailed analysis.

## Core Value Proposition

- **Problem:** 75% of resumes are rejected by ATS (Applicant Tracking Systems) before a human sees them
- **Solution:** HireFit tailors resumes to match job descriptions using preservation-first AI - never inventing skills, only optimizing existing experience
- **Unique:** First tailoring free, no signup required. Anonymous-first flow.

## Target Audience

- Software engineers, PMs, designers, marketers applying to mid-stage startups
- Job seekers getting ghosted by ATS filters
- Anyone applying to multiple roles who needs tailored resumes quickly

## Core Features (6 AI Tools)

| Tool | Purpose | Needs JD |
|------|---------|----------|
| **JD Analyzer** | Extract requirements, skills, keywords from job description | Yes |
| **Resume Analyzer** | Analyze resume structure, content, keyword density | No |
| **Gap Analyzer** | Find missing skills/keywords between resume and JD | Yes |
| **ATS Scorer** | Score resume against JD for ATS compatibility | Yes |
| **Resume Rewriter** | Rewrite bullets to match JD keywords (preservation-first) | Yes |
| **Cover Letter Generator** | Generate personalized cover letter from tailored resume | Yes |

## User Flow

### Anonymous (First Tailoring Free)
1. Land on `/` → Click "Tailor My Resume Free"
2. Upload resume (PDF/DOCX) → parsed client-side
3. Paste job description
4. Click "Analyze" → SSE stream shows tool progress
5. Results: ATS score, matched/missing keywords, tailored resume, cover letter
6. Download PDF
7. localStorage counter increments (1 free tailoring)

### Authenticated (After Free Tailoring)
1. Second attempt → Login modal (Google OAuth via Clerk)
2. On login → pending resume saved to MongoDB
3. Normal flow continues, resume saved to user account
4. Unlimited tailoring, history saved

## Key Differentiators

| Feature | HireFit | Typical Competitors |
|---------|---------|---------------------|
| First tailoring free | ✅ No signup | ❌ Usually paywall |
| Preservation-first AI | ✅ Never invents skills | ❌ Often hallucinates |
| Real streaming progress | ✅ SSE with ToolStepper | ❌ Static loading |
| Anonymous-first | ✅ localStorage only | ❌ Requires account |
| 6 tools in one | ✅ All-in-one | ❌ Separate tools |

## Business Model (Current)

- **Free tier:** Unlimited tailoring after login
- **No paid tiers yet** - MVP validation phase
- **Future:** Potential premium for bulk processing, API access, team features

## Success Metrics (Tracked)

- Landing CTA clicks → Auth started → Signup completed
- Resume uploaded → JD submitted → Analysis started
- Tailoring completed → PDF downloaded
- Conversion funnel in `/admin/analytics`

---

## 🎯 Current Status

**Production:** Live at `https://hirefit.live`  
**Status:** MVP launched, SEO audit fixes complete, ready for GSC indexing  
**Next Milestone:** Get tool pages indexed, measure conversion funnel