import {
  RiFileTextLine,
  RiBarChartBoxLine,
  RiToolsLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import Link from "next/link";

export default async function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-14 pb-12 sm:pt-24 sm:pb-20 max-w-5xl mx-auto">
        <span className="mm-badge mm-badge-new mb-6 text-xs">AI-Powered</span>
        <h1 className="mm-hero-display text-mm-ink max-w-4xl mx-auto mb-6">
          Tailor Your Resume
        </h1>
        <p className="text-base sm:text-xl text-mm-steel max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Upload your resume, paste a job description, and let AI optimize it for
          maximum ATS compatibility and recruiter impact.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/dashboard" className="mm-btn mm-btn-primary px-8 py-3 text-base">
            Start Tailoring
          </Link>
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
            <h3 className="text-xl font-semibold mb-2">Resume Analysis</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Deep AI analysis of your resume content, structure, and keyword optimization.
            </p>
          </div>

          <div className="mm-card-blue">
            <RiBarChartBoxLine className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">ATS Scoring</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              See your before and after ATS score with detailed compatibility metrics.
            </p>
          </div>

          <div className="mm-card-purple">
            <RiToolsLine className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Smart Rewriting</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              AI-powered resume rewriting that preserves your voice while optimizing content.
            </p>
          </div>

          <div className="mm-card-magenta">
            <RiMoneyDollarCircleLine className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Cover Letters</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Generate tailored cover letters that complement your optimized resume.
            </p>
          </div>
        </div>
      </section>

      {/* AI Product Matrix */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-12 sm:pb-20">
        <h2 className="mm-heading-md text-mm-ink text-center mb-3">
          Full-Stack Resume Engine
        </h2>
        <p className="text-mm-steel text-center mb-8 sm:mb-10 mx-auto">
          Six AI-powered tools working together to transform your resume for any role.
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
              <h4 className="text-base font-semibold text-mm-ink mb-2">{tool.title}</h4>
              <p className="text-sm text-mm-steel leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

{/* CTA Strip */}
        <section className="mm-card-coral mx-4 sm:mx-8 mb-12 sm:mb-20 text-center py-10 sm:py-12 px-6">
        <h2 className="mm-heading-md mb-4">Ready to Optimize Your Resume?</h2>
        <p className="text-sm opacity-80 mb-6 mx-auto ">
          Get AI-powered analysis, ATS scoring, and a tailored resume in under a minute.
        </p>
        <Link href="/dashboard" className="mm-btn mm-btn-tertiary px-8 py-3 text-base">
          Start Now — It&apos;s Free
        </Link>
      </section>

      {/* Stats Strip */}
      <section className="border-t border-mm-hairline bg-mm-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "6", label: "AI Tools" },
            { value: "3x", label: "ATS Score Boost" },
            { value: "50+", label: "Job Categories" },
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
              <span className="text-lg font-semibold tracking-tight">TailorResume</span>
              <p className="text-sm text-mm-muted mt-2 leading-relaxed">
                AI-powered resume optimization for the modern job market.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-mm-muted hover:text-white transition-colors">Features</a></li>
                <li><Link href="/dashboard" className="text-sm text-mm-muted hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Tools</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-mm-muted">JD Analyzer</span></li>
                <li><span className="text-sm text-mm-muted">ATS Scorer</span></li>
                <li><span className="text-sm text-mm-muted">Resume Rewriter</span></li>
                <li><span className="text-sm text-mm-muted">Cover Letter Gen</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Built With</h4>
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
              &copy; {new Date().getFullYear()} TailorResume. AI Resume Optimization Platform.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
