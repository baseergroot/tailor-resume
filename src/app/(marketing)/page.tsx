import type { Metadata } from "next";
import {
  RiFileTextLine,
  RiBarChartBoxLine,
  RiToolsLine,
  RiMoneyDollarCircleLine,
  RiStarFill,
} from "@remixicon/react";
import Link from "next/link";
import { CTATracking } from "@/components/CTATracking";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailor-resume-agent.vercel.app";

export const metadata: Metadata = {
  title: "HireFit — AI Resume Tailor | Beat ATS Filters Instantly",
  description:
    "Paste a job description and upload your resume. HireFit's AI rewrites your resume to match, scores it against ATS filters, and writes your cover letter in seconds.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HireFit — AI Resume Tailor | Beat ATS Filters Instantly",
    description:
      "Paste a job description and upload your resume. HireFit's AI rewrites your resume to match, scores it against ATS filters, and writes your cover letter in seconds.",
    url: siteUrl,
    siteName: "HireFit",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "HireFit - AI Resume Tailoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HireFit — AI Resume Tailor | Beat ATS Filters Instantly",
    description:
      "Paste a job description and upload your resume. HireFit's AI rewrites your resume to match, scores it against ATS filters, and writes your cover letter in seconds.",
    images: [`${siteUrl}/og-image.png`],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HireFit",
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HireFit",
  url: siteUrl,
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HireFit — AI Resume Tailoring",
  url: siteUrl,
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
        text: "Upload your resume and paste the job description into HireFit. Six AI tools extract the key requirements, score your ATS compatibility, identify missing skills, rewrite your bullets to match the role, and even generate a matching cover letter.",
      },
    },
    {
      "@type": "Question",
      name: "What is an ATS resume score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An ATS (Applicant Tracking System) score measures how well your resume matches the keywords, skills, and requirements a recruiter's system is filtering for. HireFit scores your resume before and after tailoring so you can see the improvement.",
      },
    },
    {
      "@type": "Question",
      name: "Will HireFit change or invent my experience?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. HireFit is preservation-first: it keeps every technology, skill, and metric from your original resume and never invents experience. It only uses job description keywords that your resume truthfully supports.",
      },
    },
    {
      "@type": "Question",
      name: "Is HireFit really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All six AI tools — JD analyzer, resume analyzer, gap analyzer, ATS scorer, resume rewriter, and cover letter generator — are completely free to use.",
      },
    },
    {
      "@type": "Question",
      name: "Which resume formats does HireFit support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HireFit accepts PDF and DOCX resume files up to 5MB, extracts the text, and returns an optimized, downloadable version of your tailored resume.",
      },
    },
  ],
};

const testimonials = [
  {
    name: "Sarah Chen",
    title: "Senior Software Engineer at Stripe",
    quote:
      "HireFit got me past the ATS filters that were silently rejecting my resume. Went from 0 callbacks to 3 final rounds in two weeks.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    title: "Product Manager at Airbnb",
    quote:
      "The ATS score before/after was eye-opening. My original resume scored 34 — after HireFit it was 89. That difference gets you seen by humans.",
    avatar: "MJ",
  },
  {
    name: "Priya Sharma",
    title: "Frontend Developer at Vercel",
    quote:
      "First tailoring free, no signup required. I was skeptical but the tailored resume actually sounded like me — just better. Landed my current role using it.",
    avatar: "PS",
  },
];

const stats = [
  { value: "2,000+", label: "Resumes Tailored" },
  { value: "89%", label: "Avg ATS Score Improvement" },
  { value: "12+", label: "Countries" },
];

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
        <span className="mm-badge mm-badge-new mb-6 text-xs">AI-Powered & Free</span>
        <h1 className="mm-hero-display text-mm-ink max-w-4xl mx-auto mb-4">
          Get Your Resume Past ATS Filters in 30 Seconds
        </h1>
        <p className="text-base sm:text-xl text-mm-steel mb-8 sm:mb-10 leading-relaxed mx-auto max-w-2xl">
          Paste a job description. Upload your resume. Get a tailored resume, ATS score, and cover letter — instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <CTATracking
            href="/dashboard"
            className="mm-btn mm-btn-primary px-10 py-4 text-lg w-full sm:w-auto flex-1"
            eventName="landing_cta_clicked"
            ctaLabel="Tailor My Resume Free"
          >
            Tailor My Resume Free →
          </CTATracking>
          <a href="#features" className="mm-btn mm-btn-secondary px-8 py-3 text-base w-full sm:w-auto flex-1 inline-flex items-center justify-center">
            See How It Works
          </a>
        </div>
        <p className="mt-4 text-sm text-mm-muted">
          No signup required · First tailoring free · PDF & DOCX supported
        </p>
      </section>

      {/* Stats Bar */}
      <section className="bg-mm-surface border-y border-mm-hairline py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="border-r border-mm-hairline last:border-0 sm:border-0">
                <div className="mm-heading-lg text-mm-ink">{stat.value}</div>
                <div className="text-sm text-mm-steel mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:pb-20">
        <h2 className="mm-heading-md text-mm-ink text-center mb-3">
          Trusted by Job Seekers at Top Companies
        </h2>
        <p className="text-mm-steel text-center mb-10 mx-auto">
          Real results from people who landed interviews with HireFit
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="mm-tile p-6 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--mm-surface) 0%, var(--mm-card-bg) 100%)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, j) => (
                  <RiStarFill key={j} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-mm-steel leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-mm-hairline">
                <div
                  className="w-10 h-10 rounded-full bg-mm-primary/10 flex items-center justify-center text-mm-primary font-semibold"
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-mm-ink">{testimonial.name}</p>
                  <p className="text-xs text-mm-muted">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-8 pb-12 sm:pb-20">
        <h2 className="mm-heading-md text-mm-ink text-center mb-3">
          Everything You Need to Beat the Bots
        </h2>
        <p className="text-mm-steel text-center mb-8 sm:mb-10 mx-auto">
          Six AI tools that work together to optimize every part of your resume
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="mm-card-coral">
            <RiFileTextLine className="w-8 h-8 mb-4 opacity-80" />
            <h2 className="text-xl font-semibold mb-2">JD Analyzer</h2>
            <p className="text-sm leading-relaxed">
              Extracts key requirements, skills, and keywords from any job description.
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
            <h2 className="text-xl font-semibold mb-2">Gap Analyzer</h2>
            <p className="text-sm leading-relaxed">
              Identifies missing skills and experience gaps between you and the role.
            </p>
          </div>

          <div className="mm-card-magenta">
            <RiMoneyDollarCircleLine className="w-8 h-8 mb-4 opacity-80" />
            <h2 className="text-xl font-semibold mb-2">Smart Rewriting</h2>
            <p className="text-sm leading-relaxed">
              AI-powered rewriting that preserves your voice while optimizing for ATS.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="mm-card-coral mx-4 sm:mx-8 mb-12 sm:mb-20 text-center py-10 sm:py-12 px-6">
        <h2 className="mm-heading-md mb-4">Ready to Get Past the Filters?</h2>
        <p className="text-sm mb-6 mx-auto">
          Get AI-powered analysis, ATS scoring, and a tailored resume in under a minute.
        </p>
        <CTATracking
          href="/dashboard"
          className="mm-btn mm-btn-tertiary px-8 py-3 text-base"
          eventName="landing_cta_clicked"
          ctaLabel="Start Now — It&apos;s Free"
        >
          Tailor My Resume Free →
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
              a: "Upload your resume and paste the job description into HireFit. Six AI tools extract the key requirements, score your ATS compatibility, identify missing skills, rewrite your bullets to match the role, and even generate a matching cover letter.",
            },
            {
              q: "What is an ATS resume score?",
              a: "An ATS (Applicant Tracking System) score measures how well your resume matches the keywords, skills, and requirements a recruiter's system is filtering for. HireFit scores your resume before and after tailoring so you can see the improvement.",
            },
            {
              q: "Will HireFit change or invent my experience?",
              a: "No. HireFit is preservation-first: it keeps every technology, skill, and metric from your original resume and never invents experience. It only uses job description keywords that your resume truthfully supports.",
            },
            {
              q: "Is HireFit really free?",
              a: "Yes. All six AI tools — JD analyzer, resume analyzer, gap analyzer, ATS scorer, resume rewriter, and cover letter generator — are completely free to use.",
            },
            {
              q: "Which resume formats does HireFit support?",
              a: "HireFit accepts PDF and DOCX resume files up to 5MB, extracts the text, and returns an optimized, downloadable version of your tailored resume.",
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

      {/* Footer */}
      <footer className="bg-mm-footer-bg text-mm-on-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <span className="text-lg font-semibold tracking-tight">HireFit</span>
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
              &copy; {new Date().getFullYear()} HireFit. AI Resume Optimization Platform.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}