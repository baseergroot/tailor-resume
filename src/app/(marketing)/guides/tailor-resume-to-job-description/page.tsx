import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailor-resume-agent.vercel.app";

export const metadata: Metadata = {
  title: "How to Tailor Your Resume to a Job Description (Step-by-Step)",
  description:
    "A step-by-step guide to tailoring your resume for any job description: identify keywords, rewrite bullets, fix ATS gaps, and keep every claim honest.",
  alternates: {
    canonical: "/guides/tailor-resume-to-job-description",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    {
      "@type": "ListItem",
      position: 2,
      name: "Guides",
      item: `${siteUrl}/guides`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Tailor Your Resume",
      item: `${siteUrl}/guides/tailor-resume-to-job-description`,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does it mean to tailor a resume to a job description?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tailoring means adjusting your real resume content so its language, keyword coverage, and ordering match a specific job posting. You rewrite bullets, reorder sections, and surface the skills the employer explicitly asked for — without inventing anything you have not actually done.",
      },
    },
    {
      "@type": "Question",
      name: "What is an ATS resume score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An ATS score measures how well your resume matches the keywords and requirements an applicant tracking system filters for. A higher score means your resume is more likely to be seen by a human. Hirefit scores your resume before and after tailoring so you can see the difference.",
      },
    },
    {
      "@type": "Question",
      name: "How long does tailoring a resume take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Manually, tailoring takes 30–60 minutes per application. With an AI tool like Hirefit, the same process takes under a minute: upload your resume, paste the job description, and the AI extracts the requirements and rewrites your bullets for you.",
      },
    },
    {
      "@type": "Question",
      name: "Will tailoring change the facts on my resume?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Tailoring changes emphasis, wording, and order — not the underlying facts. A good tailoring tool (or a careful manual pass) keeps every technology, metric, and real achievement from your original resume. Never invent skills or experience you cannot support in an interview.",
      },
    },
    {
      "@type": "Question",
      name: "How many keywords should I include from the job description?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Target 8–12 core keywords that appear in the job posting and that your resume honestly supports. Place them naturally across your summary, skills section, and experience bullets. Do not stuff every phrase in — ATS filters penalize keyword stuffing the same way human readers do.",
      },
    },
  ],
};

const howSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to tailor a resume to a job description",
  description:
    "A step-by-step process to adapt your resume for a specific job posting while keeping every claim truthful.",
  step: [
    {
      "@type": "HowToStep",
      name: "Read the job description for core requirements",
      text: "Highlight repeated tools, certifications, years of experience, and outcomes. Separate must-haves from nice-to-haves. These are the keywords your resume must reflect.",
    },
    {
      "@type": "HowToStep",
      name: "Score your current resume against the posting",
      text: "Before making changes, run your resume through an ATS checker to see your baseline score and which keywords are already covered versus missing.",
    },
    {
      "@type": "HowToStep",
      name: "Rewrite your professional summary",
      text: "Lead with the role title and the 2–3 most relevant achievements. Cut generic buzzwords like results-driven or team player.",
    },
    {
      "@type": "HowToStep",
      name: "Rewrite your experience bullets",
      text: "Use the employer's exact language where your real work supports it. Put the most relevant bullets first under each role.",
    },
    {
      "@type": "HowToStep",
      name: "Update your skills section",
      text: "Add the must-have hard skills from the posting that you genuinely have. Remove vague or irrelevant soft skills.",
    },
    {
      "@type": "HowToStep",
      name: "Run a final ATS check",
      text: "Re-score your tailored resume against the job description. Fix any remaining gaps before sending.",
    },
  ],
};

export default function TailorResumeGuide() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howSchema) }}
      />

      {/* Breadcrumb (visible) */}
      <nav className="max-w-3xl mx-auto px-4 sm:px-8 pt-14 text-sm text-mm-steel">
        <Link href="/" className="hover:text-mm-ink transition-colors">
          Hirefit
        </Link>
        <span className="mx-2">/</span>
        <span className="text-mm-ink font-medium">Resume Tailoring Guide</span>
      </nav>

      {/* Hero — answer-first */}
      <section className="px-4 pt-6 pb-12 max-w-3xl mx-auto text-center">
        <h1 className="mm-heading-lg text-mm-ink mb-6">
          How to Tailor Your Resume to a Job Description
        </h1>
        <p className="text-base sm:text-lg text-mm-steel leading-relaxed max-w-2xl mx-auto">
          Tailoring your resume means rewriting its content so it speaks the same
          language as the job posting — emphasizing the skills, keywords, and
          outcomes the employer is actually filtering for, while keeping every
          claim on your resume honest and verifiable.
        </p>
      </section>

      {/* Why it matters */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-12">
        <h2 className="mm-heading-md text-mm-ink mb-4">
          Why tailoring your resume matters
        </h2>
        <p className="text-sm text-mm-steel leading-relaxed mb-4">
          Before a human reads your application, software does. Most companies
          use an applicant tracking system (ATS) that scans your resume for
          required keywords, skills, and qualifications. A generic resume sent
          to 50 jobs almost always loses to a tailored one sent to 10. The math
          is simple: your resume passes the filter, or it gets quietly buried.
        </p>
        <p className="text-sm text-mm-steel leading-relaxed">
          The good news is that tailoring is not rewriting your career from
          scratch. It is changing emphasis, wording, and order — keeping every
          real skill and metric while putting the most relevant evidence where a
          tired recruiter sees it in six seconds.
        </p>
      </section>

      {/* Step-by-step */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-12">
        <h2 className="mm-heading-md text-mm-ink mb-8">
          6 steps to tailor your resume
        </h2>
        <div className="space-y-8">
          <Step
            n={1}
            title="Read the job description like a recruiter"
            paragraphs={[
              "Do not start by editing your resume. Start by marking what the job is really asking for. Circle the repeated tools, platforms, licenses, years of experience, and outcomes the employer mentions. These are the only things worth rearranging your resume around.",
              "Separate must-haves from nice-to-haves. A must-have is something explicitly labeled required or something the posting mentions multiple times. Nice-to-haves are preferences, not filters.",
            ]}
          />
          <Step
            n={2}
            title="Score your current resume against the posting"
            paragraphs={[
              "Before changing anything, run your resume through an ATS scorer so you have a baseline. This tells you which keywords are already covered and which ones are missing. Without this step, you are guessing.",
            ]}
          />
          <Step
            n={3}
            title="Rewrite your professional summary"
            paragraphs={[
              "The top third of your resume does the most work. Lead with the target role title and your 2–3 strongest matching achievements. Cut generic filler words like results-driven, detail-oriented, or team player — they tell a hiring manager nothing.",
              "A strong summary for a data analyst role might read: Product Data Analyst with 4 years in B2B SaaS, specializing in activation reporting, funnel analysis, and dashboard automation across product and growth teams. That is specific. A recruiter knows exactly who you are in three seconds.",
            ]}
          />
          <Step
            n={4}
            title="Rewrite your experience bullets"
            paragraphs={[
              "Go to each role and ask: which of this job description requirements did I actually work on? Rewrite those bullets using the employer's exact language where your real work supports it. If the job says stakeholder communication and you presented to clients, use that phrase.",
              "Put the most relevant bullets first under each role. The first two bullets of your most recent job are what most recruiters actually read. Make them count.",
            ]}
          />
          <Step
            n={5}
            title="Update your skills section"
            paragraphs={[
              "Your skills section should not be a life inventory. It is a match signal. Add the specific hard skills and tools the job requires — Python, SQL, Salesforce, Google Analytics — that you genuinely have used. Remove vague items like Microsoft Office or problem-solving.",
              "Soft skills can stay only if they are tied to this role. Stakeholder management is stronger than communication because it points to actual work.",
            ]}
          />
          <Step
            n={6}
            title="Run a final ATS check before sending"
            paragraphs={[
              "After tailoring, re-score your resume against the same job description. Your score should improve. If key keywords are still missing, go back to step 4 and add them where your experience honestly supports them. This loop takes five minutes and saves you from being filtered out silently.",
            ]}
          />
        </div>
      </section>

      {/* Common mistakes */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-12">
        <h2 className="mm-heading-md text-mm-ink mb-4">
          Common tailoring mistakes to avoid
        </h2>
        <ul className="space-y-4">
          <Mistake
            title="Keyword stuffing"
            text="Cramming every phrase from the job description into your resume without context. ATS systems flag this the same way human readers do — it looks robotic and unconvincing."
          />
          <Mistake
            title="Inventing experience you do not have"
            text="Adding a skill, tool, or project that is not in your real background. You may pass the ATS screen, but you will be caught in the interview. Never add something you cannot support in conversation."
          />
          <Mistake
            title="Using a generic resume for every application"
            text="A resume that works for a marketing manager role will not work for a growth lead role, even if the skills overlap. Every application needs a version that speaks the employer's language."
          />
          <Mistake
            title="Ignoring the formatting"
            text="A resume with tables, columns, images, or custom fonts may look great visually but can break ATS parsing entirely. Use a single-column layout with standard headings (Work Experience, Education, Skills) every time."
          />
        </ul>
      </section>

      {/* Template CTA */}
      <section className="mm-card-coral mx-4 sm:mx-8 mb-12 text-center py-10 px-6">
        <h2 className="mm-heading-md mb-3">
          Tailor your resume with AI in under a minute
        </h2>
        <p className="text-sm mb-6 mx-auto ">
          Hirefit scores your resume against any job description, identifies
          missing keywords, and rewrites your bullets — preserving every real
          skill and metric. No invented experience. Free to use.
        </p>
        <Link
          href="/dashboard"
          className="mm-btn mm-btn-tertiary px-8 py-3 text-base"
        >
          Start Tailoring Free
        </Link>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-12">
        <h2 className="mm-heading-md text-mm-ink mb-6">
          Tailoring resume FAQs
        </h2>
        <div className="space-y-4">
          {faqSchema.mainEntity.map((faq) => (
            <details key={faq.name} className="mm-tile">
              <summary className="text-base font-semibold text-mm-ink cursor-pointer">
                {faq.name}
              </summary>
              <p className="text-sm text-mm-steel mt-2 leading-relaxed">
                {faq.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Related tools */}
      <section className="border-t border-mm-hairline bg-mm-surface py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="mm-heading-sm text-mm-ink mb-6">
            Hirefit tools that help you tailor
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/tools/ats-scoring"
              className="mm-btn mm-btn-secondary text-sm px-4 py-2"
            >
              ATS Scorer
            </Link>
            <Link
              href="/tools/jd-analyzer"
              className="mm-btn mm-btn-secondary text-sm px-4 py-2"
            >
              JD Analyzer
            </Link>
            <Link
              href="/tools/gap-analyzer"
              className="mm-btn mm-btn-secondary text-sm px-4 py-2"
            >
              Gap Analyzer
            </Link>
            <Link
              href="/tools/resume-rewriter"
              className="mm-btn mm-btn-secondary text-sm px-4 py-2"
            >
              Resume Rewriter
            </Link>
            <Link
              href="/dashboard"
              className="mm-btn mm-btn-primary text-sm px-4 py-2"
            >
              Try Hirefit Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Small helpers ── */

function Step({
  n,
  title,
  paragraphs,
}: {
  n: number;
  title: string;
  paragraphs: string[];
}) {
  return (
    <div className="flex gap-4">
      <span className="w-8 h-8 shrink-0 rounded-full bg-mm-surface border border-mm-hairline text-mm-steel text-sm font-semibold flex items-center justify-center mt-0.5">
        {n}
      </span>
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-mm-ink">{title}</h3>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-mm-steel leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

function Mistake({ title, text }: { title: string; text: string }) {
  return (
    <li className="mm-tile">
      <h3 className="text-base font-semibold text-mm-ink mb-1">{title}</h3>
      <p className="text-sm text-mm-steel leading-relaxed">{text}</p>
    </li>
  );
}
