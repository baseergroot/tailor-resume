import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume & ATS Guides",
  description:
    "Step-by-step guides on tailoring your resume to any job description, ATS optimization, and keyword matching for the modern job market.",
  alternates: {
    canonical: "/guides",
  },
};

const guides = [
  {
    href: "/guides/tailor-resume-to-job-description",
    title: "How to Tailor Your Resume to a Job Description",
    excerpt:
      "The 6-step process to adapt your resume for any job posting — identify keywords, rewrite bullets, fix ATS gaps, and keep every claim honest.",
  },
];

export default function GuidesIndex() {
  return (
    <main className="min-h-screen">
      <section className="px-4 pt-14 pb-12 max-w-3xl mx-auto">
        <span className="mm-badge mm-badge-new mb-6 text-xs">Hirefit Guides</span>
        <h1 className="mm-heading-lg text-mm-ink mb-4">
          Resume and ATS Guides
        </h1>
        <p className="text-base text-mm-steel leading-relaxed">
          Practical, honest guides on tailoring your resume, passing ATS
          screens, and matching job-description keywords.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-16 space-y-4">
        {guides.map((guide) => (
          <Link key={guide.href} href={guide.href} className="mm-tile block">
            <h2 className="text-base font-semibold text-mm-ink mb-1">
              {guide.title}
            </h2>
            <p className="text-sm text-mm-steel leading-relaxed">
              {guide.excerpt}
            </p>
            <span className="text-sm text-mm-primary mt-3 inline-block font-medium">
              Read guide →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}