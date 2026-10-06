import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Free AI Resume Tools — ATS Scorer, JD Analyzer, Gap Finder & More",
  description:
    "Six free AI tools to optimize your resume for any job: ATS scoring, job description analysis, gap detection, resume rewriting, and cover letter generation.",
  alternates: {
    canonical: "/tools",
  },
};

const toolIcons: Record<string, string> = {
  "ats-scoring": "📊",
  "resume-analyzer": "🔍",
  "jd-analyzer": "📋",
  "gap-analyzer": "🔗",
  "resume-rewriter": "✍️",
  "cover-letter-generator": "📝",
};

export default function ToolsIndex() {
  return (
    <main className="min-h-screen">
      <section className="px-4 pt-14 pb-12 max-w-3xl mx-auto">
        <span className="mm-badge mm-badge-new mb-6 text-xs">HireFit AI Tools</span>
        <h1 className="mm-heading-lg text-mm-ink mb-4">
          Free AI Resume Tools
        </h1>
        <p className="text-base text-mm-steel leading-relaxed">
          Pick a tool or run the full pipeline from the dashboard. All tools are
          free, no signup required for the first analysis.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 space-y-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="mm-tile block group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0" aria-hidden="true">
                {toolIcons[tool.slug] || "🛠️"}
              </span>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-mm-ink mb-1 group-hover:text-mm-primary transition-colors">
                  {tool.name}
                </h2>
                <p className="text-sm text-mm-steel leading-relaxed mb-2">
                  {tool.definition}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.features.slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs bg-mm-surface border border-mm-hairline px-2 py-0.5 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-mm-primary font-medium shrink-0 self-start mt-1">
                Try it free →
              </span>
            </div>
          </Link>
        ))}
      </section>

<section className="mm-card-coral mx-4 sm:mx-8 mb-12 text-center py-10 px-6">
        <h2 className="mm-heading-md mb-3">Want the Full Pipeline?</h2>
        <p className="text-sm mb-6 mx-auto">
          Upload once, get all six analyses: JD breakdown, ATS score, gaps,
          rewritten resume, and cover letter.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/tools/ats-scoring"
            className="mm-btn mm-btn-tertiary px-8 py-3 text-base"
          >
            Start Full Analysis Free
          </Link>
          <Link
            href="/guides"
            className="mm-btn mm-btn-secondary px-8 py-3 text-base"
          >
            View All Guides
          </Link>
        </div>
      </section>
    </main>
  );
}