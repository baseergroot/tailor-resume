import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hirefit.live";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tools/", "/guides/"],
        disallow: ["/dashboard", "/sign-in", "/sign-up", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}