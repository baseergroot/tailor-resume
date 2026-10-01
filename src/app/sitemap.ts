import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { promises as fs } from "fs";
import path from "path";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hirefit.live";

async function getLastModified(filePath: string): Promise<Date> {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: await getLastModified(path.join(process.cwd(), "src/app/(marketing)/page.tsx")),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const tool of tools) {
    const toolPath = path.join(process.cwd(), `src/app/(marketing)/tools/${tool.slug}/page.tsx`);
    entries.push({
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified: await getLastModified(toolPath),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  const guidesIndexPath = path.join(process.cwd(), "src/app/(marketing)/guides/page.tsx");
  entries.push({
    url: `${siteUrl}/guides`,
    lastModified: await getLastModified(guidesIndexPath),
    changeFrequency: "monthly",
    priority: 0.7,
  });

  const guidePath = path.join(process.cwd(), "src/app/(marketing)/guides/tailor-resume-to-job-description/page.tsx");
  entries.push({
    url: `${siteUrl}/guides/tailor-resume-to-job-description`,
    lastModified: await getLastModified(guidePath),
    changeFrequency: "monthly",
    priority: 0.9,
  });

  return entries;
}