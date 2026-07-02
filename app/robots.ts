// app/robots.ts — Next.js App Router convention file. Outputs /robots.txt.
//
// Strategy:
//   - Default: allow everything except admin / login / api / Next.js internals.
//   - Same disallow rules across each locale prefix so the sitemap-flat URL
//     space doesn't accidentally let crawlers index /admin under /zh-CN/.
//   - Sitemap: absolute URL pointing to Step 4's sitemap.xml.

import type { MetadataRoute } from "next";
import { locales } from "../i18n/config";
import { siteUrl } from "../lib/seo";

const DEFAULT_LOCALE = "en"; // localePrefix: "as-needed" hides "en" prefix

// Paths that should never be indexed, regardless of locale.
const DISALLOW_PATHS = [
  "/admin",
  "/admin/",
  "/login",
  "/login/",
  "/api",
  "/api/",
  "/_next",
  "/_next/",
];

function buildRules(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [];

  for (const locale of locales) {
    const userAgentRules: string[] = [];

    for (const p of DISALLOW_PATHS) {
      const fullPath = locale === DEFAULT_LOCALE ? p : `/${locale}${p}`;
      userAgentRules.push(fullPath);
    }

    rules.push({
      userAgent: "*",
      allow: locale === DEFAULT_LOCALE ? "/" : `/${locale}/`,
      disallow: userAgentRules,
    });
  }

  return {
    rules,
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}

export default function robots(): MetadataRoute.Robots {
  return buildRules();
}
