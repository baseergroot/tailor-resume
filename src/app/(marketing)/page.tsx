import type { Metadata } from "next";
import {
  RiFileTextLine,
  RiBarChartBoxLine,
  RiToolsLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import Link from "next/link";
import { CTATracking } from "@/components/CTATracking";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailor-resume-agent.vercel.app";

export const metadata: Metadata = {
  title: "AI Resume Tailoring & ATS Optimization",
  description:
    "Tailor your resume to any job description for free. Hirefit's six AI tools analyze, ATS-score, and rewrite your resume, and generate a matching cover letter in under a minute.",
  alternates: {
    canonical: "/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hirefit",
  url: `${siteUrl}`,
  logo: `${siteUrl}/icon.svg`,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hirefit",
  url: `${siteUrl}`,
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hirefit — AI Resume Tailoring",
  url: `${siteUrl}`,
  applicationCategory: "WebApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free AI-powered resume tailoring tool that optimizes your resume for any job description with ATS scoring and cover letter generation.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I tailor my resume to a job description?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your resume and paste the job description into Hirefit. Six AI tools extract the key requirements, score your ATS compatibility, identify missing skills, rewrite your bullets to match the role, and even generate a matching cover letter.",
      },
    },
    {
      "@type": "Question",
      name: "What is an ATS resume score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An ATS (Applicant Tracking System) score measures how well your resume matches the keywords, skills, and requirements a recruiter's system is filtering for. Hirefit scores your resume before and after tailoring so you can see the improvement.",
      },
    },
    {
      "@type": "Question",
      name: "Will Hirefit change or invent my experience?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Hirefit is preservation-first: it keeps every technology, skill, and metric from your original resume and never invents experience. It only uses job description keywords that your resume truthfully supports.",
      },
    },
    {
      "@type": "Question",
      name: "Is Hirefit really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All six AI tools — JD analyzer, resume analyzer, gap analyzer, ATS scorer, resume rewriter, and cover letter generator — are completely free to use.",
      },
    },
    {
      "@type": "Question",
      name: "Which resume formats does Hirefit support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hirefit accepts PDF and DOCX resume files up to 5MB, extracts the text, and returns an optimized, downloadable version of your tailored resume.",
      },
    },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-14 pb-12 sm:pt-24 sm:pb-20 max-w-5xl mx-auto">
        <span className="mm-badge mm-badge-new mb-6 text-xs">AI-Powered</span>
        <h1 className="mm-hero-display text-mm-ink max-w-4xl mx-auto mb-6">
          Tailor Your Resume to Any Job
        </h1>
        <p className="text-base sm:text-xl text-mm-steel mb-8 sm:mb-10 leading-relaxed mx-auto">
          Upload your resume, paste a job description, and let Hirefit&apos;s AI
          optimize it for maximum ATS compatibility and recruiter impact.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <CTATracking
            href="/dashboard"
            className="mm-btn mm-btn-primary px-8 py-3 text-base"
            eventName="landing_cta_clicked"
            ctaLabel="Start Tailoring Free"
          >
            Start Tailoring Free
          </CTATracking>
          <a href="#features" className="mm-btn mm-btn-secondary px-8 py-3 text-base">
            Learn More
          </a>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-8 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="mm-card-coral">
            <RiFileTextLine className="w-8 h-8 mb-4 opacity-80" />
            <h2 className="text-xl font-semibold mb-2">Resume Analysis</h2>
            <p className="text-sm leading-relaxed">
              Deep AI analysis of your resume content, structure, and keyword optimization.
            </p>
          </div>

          <div className="mm-card-blue">
            <RiBarChartBoxLine className="w-8 h-8 mb-4 opacity-80" />
            <h2 className="text-xl font-semibold mb-2">ATS Scoring</h2>
            <p className="text-sm leading-relaxed">
              See your before and after ATS score with detailed compatibility metrics.
            </p>
          </div>

          <div className="mm-card-purple">
            <RiToolsLine className="w-8 h-8 mb-4 opacity-80" />
            <h2 className="text-xl font-semibold mb-2">Smart Rewriting</h2>
            <p className="text-sm leading-relaxed">
              AI-powered resume rewriting that preserves your voice while optimizing content.
            </p>
          </div>

          <div className="mm-card-magenta">
            <RiMoneyDollarCircleLine className="w-8 h-8 mb-4 opacity-80" />
            <h2 className="text-xl font-semibold mb-2">Cover Letters</h2>
            <p className="text-sm leading-relaxed">
              Generate tailored cover letters that complement your optimized resume.
            </p>
          </div>
        </div>
      </section>

      {/* AI Product Matrix */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-12 sm:pb-20">
        <h2 className="mm-heading-md text-mm-ink text-center mb-3">
          Six AI Resume Tools, One Result
        </h2>
        <p className="text-mm-steel text-center mb-8 sm:mb-10 mx-auto">
          A full resume-boosting engine that transforms your resume for any role.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "JD Analyzer", desc: "Extracts key requirements, skills, and keywords from any job description." },
            { title: "Resume Analyzer", desc: "Evaluates your resume structure, content quality, and keyword density." },
            { title: "Gap Analyzer", desc: "Identifies missing skills and experience gaps between you and the role." },
            { title: "ATS Scorer", desc: "Scores your resume against applicant tracking system algorithms." },
            { title: "Resume Rewriter", desc: "Optimizes bullet points, language, and impact statements." },
            { title: "Cover Letter Gen", desc: "Creates a personalized cover letter aligned with the job requirements." },
          ].map((tool, i) => (
            <div key={i} className="mm-tile">
              <h3 className="text-base font-semibold text-mm-ink mb-2">{tool.title}</h3>
              <p className="text-sm text-mm-steel leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="mm-card-coral mx-4 sm:mx-8 mb-12 sm:mb-20 text-center py-10 sm:py-12 px-6">
        <h2 className="mm-heading-md mb-4">Ready to Optimize Your Resume?</h2>
        <p className="text-sm mb-6 mx-auto">
          Get AI-powered analysis, ATS scoring, and a tailored resume in under a minute.
        </p>
        <CTATracking
          href="/dashboard"
          className="mm-btn mm-btn-tertiary px-8 py-3 text-base"
          eventName="landing_cta_clicked"
          ctaLabel="Start Now — It&apos;s Free"
        >
          Start Now — It&apos;s Free
        </CTATracking>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-12 sm:pb-20">
        <h2 className="mm-heading-md text-mm-ink text-center mb-3">
          Resume Tailoring FAQs
        </h2>
        <div className="space-y-4 mt-8">
          {[
            {
              q: "How do I tailor my resume to a job description?",
              a: "Upload your resume and paste the job description into Hirefit. Six AI tools extract the key requirements, score your ATS compatibility, identify missing skills, rewrite your bullets to match the role, and even generate a matching cover letter.",
            },
            {
              q: "What is an ATS resume score?",
              a: "An ATS (Applicant Tracking System) score measures how well your resume matches the keywords, skills, and requirements a recruiter's system is filtering for. Hirefit scores your resume before and after tailoring so you can see the improvement.",
            },
            {
              q: "Will Hirefit change or invent my experience?",
              a: "No. Hirefit is preservation-first: it keeps every technology, skill, and metric from your original resume and never invents experience. It only uses job description keywords that your resume truthfully supports.",
            },
            {
              q: "Is Hirefit really free?",
              a: "Yes. All six AI tools — JD analyzer, resume analyzer, gap analyzer, ATS scorer, resume rewriter, and cover letter generator — are completely free to use.",
            },
            {
              q: "Which resume formats does Hirefit support?",
              a: "Hirefit accepts PDF and DOCX resume files up to 5MB, extracts the text, and returns an optimized, downloadable version of your tailored resume.",
            },
          ].map((faq) => (
            <details key={faq.q} className="mm-tile">
              <summary className="text-base font-semibold text-mm-ink cursor-pointer">
                {faq.q}
              </summary>
              <p className="text-sm text-mm-steel mt-2 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-t border-mm-hairline bg-mm-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "6", label: "AI Tools" },
            { value: "<60s", label: "Tailored Result" },
            { value: "ATS", label: "Score Before & After" },
            { value: "100%", label: "Free to Use" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="mm-heading-lg text-mm-ink">{stat.value}</div>
              <div className="text-sm text-mm-steel mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-mm-footer-bg text-mm-on-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <span className="text-lg font-semibold tracking-tight">Hirefit</span>
              <p className="text-sm text-mm-muted mt-2 leading-relaxed">
                AI-powered resume tailoring and ATS optimization for the modern job market.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-mm-muted hover:text-white transition-colors">Features</a></li>
                <li><Link href="/dashboard" className="text-sm text-mm-muted hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/tools/jd-analyzer" className="text-sm text-mm-muted hover:text-white transition-colors">JD Analyzer</Link></li>
                <li><Link href="/tools/ats-scoring" className="text-sm text-mm-muted hover:text-white transition-colors">ATS Scorer</Link></li>
                <li><Link href="/tools/resume-rewriter" className="text-sm text-mm-muted hover:text-white transition-colors">Resume Rewriter</Link></li>
                <li><Link href="/tools/cover-letter-generator" className="text-sm text-mm-muted hover:text-white transition-colors">Cover Letter Gen</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Guides</h3>
              <ul className="space-y-2">
                <li><Link href="/guides/tailor-resume-to-job-description" className="text-sm text-mm-muted hover:text-white transition-colors">How to Tailor a Resume to a Job Description</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Built With</h3>
              <ul className="space-y-2">
                <li><span className="text-sm text-mm-muted">Next.js 16</span></li>
                <li><span className="text-sm text-mm-muted">Google Gemini AI</span></li>
                <li><span className="text-sm text-mm-muted">Vercel AI SDK</span></li>
                <li><span className="text-sm text-mm-muted">MongoDB</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-mm-muted">
              &copy; {new Date().getFullYear()} Hirefit. AI Resume Optimization Platform.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}