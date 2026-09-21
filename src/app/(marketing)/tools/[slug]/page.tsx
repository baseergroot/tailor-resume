import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tools, reverseTools, type Tool } from "@/data/tools";
import SingleToolRunner from "@/components/SingleToolRunner";
import type { SingleToolSlug } from "@/actions/singleToolRunner";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailor-resume-agent.vercel.app";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
  };
}

function faqSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

function breadcrumbSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.name,
        item: `${siteUrl}/tools/${tool.slug}`,
      },
    ],
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(tool)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(tool)) }}
      />

      {/* Hero / Answer-first */}
      <section className="px-4 pt-14 pb-10 max-w-3xl mx-auto text-center">
        <span className="mm-badge mm-badge-new mb-6 text-xs">Hirefit AI Tool</span>
        <h1 className="mm-heading-lg text-mm-ink mb-5">{tool.h1}</h1>
        <p className="text-base sm:text-lg text-mm-steel leading-relaxed">
          {tool.definition}
        </p>
        <a
          href="#run-tool"
          className="mm-btn mm-btn-primary px-8 py-3 text-base mt-8 inline-block"
        >
          Try It Free
        </a>
      </section>

      {/* Live tool */}
      <section className="px-4 sm:px-8 max-w-3xl mx-auto">
        <SingleToolRunner
          slug={tool.slug as SingleToolSlug}
          needsJobDescription={tool.needsJobDescription}
        />
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-10">
        <h2 className="mm-heading-md text-mm-ink mb-6">
          How the {tool.name} works
        </h2>
        <ol className="space-y-4">
          {tool.howItWorks.map((step, i) => (
            <li key={i} className="mm-tile flex gap-4 items-start">
              <span className="w-7 h-7 shrink-0 rounded-full bg-mm-surface border border-mm-hairline text-mm-steel text-sm font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-mm-steel leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-10">
        <h2 className="mm-heading-md text-mm-ink mb-6">What you get</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tool.features.map((feature, i) => (
            <li key={i} className="mm-tile">
              <p className="text-sm text-mm-steel leading-relaxed">{feature}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-12">
        <h2 className="mm-heading-md text-mm-ink mb-6">{tool.name} FAQ</h2>
        <div className="space-y-4">
          {tool.faqs.map((faq) => (
            <details key={faq.q} className="mm-tile">
              <summary className="text-base font-semibold text-mm-ink cursor-pointer">
                {faq.q}
              </summary>
              <p className="text-sm text-mm-steel mt-2 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related tools + guide (internal linking) */}
      <section className="border-t border-mm-hairline bg-mm-surface py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <h2 className="mm-heading-sm text-mm-ink text-center mb-6">
            More from Hirefit
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {reverseTools().map((related) => (
              <Link
                key={related.slug}
                href={`/tools/${related.slug}`}
                className="mm-btn mm-btn-secondary text-sm px-4 py-2"
              >
                {related.name}
              </Link>
            ))}
            <Link
              href="/guides/tailor-resume-to-job-description"
              className="mm-btn mm-btn-secondary text-sm px-4 py-2"
            >
              Tailoring Guide
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}