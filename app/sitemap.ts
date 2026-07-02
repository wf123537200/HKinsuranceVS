// app/sitemap.ts — Next.js App Router convention file. Outputs /sitemap.xml.
//
// Strategy:
//   - One entry per (page, locale) combination, plus hreflang alternates.
//   - Only URLs that should be indexed are emitted:
//       * home, /companies, /products, /calculator, /glossary (static hubs)
//       * /company/[slug] (10 companies)
//       * /products/critical-illness, /products/savings (category lists)
//       * /product/[slug] for the 45 products that have a ProductVector v2.11
//       * /compare/[a]-vs-[b] where compareIndexable() returns indexable=true
//   - Explicitly excluded (per Step 3 robots rules):
//       /admin, /login, /search, /rankings, /compare, /compare/critical-illness,
//       /compare/savings, /sitemap (HTML), and any URL with noindex metadata.

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales, type Locale } from "../i18n/config";
import { compareIndexable, localizedUrl } from "../lib/seo";
import { getAllProductVectors } from "../lib/product-vector-registry";
import type { ProductVectorV24 } from "../lib/product-vector-registry";
import { getSiteProductSlugs } from "../lib/selected-products";
import { loadProductVector } from "../lib/vectors/saveProductVector";

const DEFAULT_LOCALE: Locale = "en"; // localePrefix: "as-needed" hides "en"

function loc(locale: Locale, path: string): string {
  return localizedUrl(locale, path);
}

function alternates(path: string) {
  return {
    languages: {
      en: loc("en", path),
      "zh-CN": loc("zh-CN", path),
      "zh-TW": loc("zh-TW", path),
    },
  };
}

function entryForLocale(
  locale: Locale,
  path: string,
  opts: {
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    lastModified?: Date;
  }
): MetadataRoute.Sitemap[number] {
  return {
    url: loc(locale, path),
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: alternates(path),
  };
}

/** Build entries for all locales for a given path. */
function forAllLocales(
  path: string,
  opts: {
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    lastModified?: Date;
  }
): MetadataRoute.Sitemap[number][] {
  return locales.map((locale) =>
    entryForLocale(locale, path, opts)
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap[number][] = [];
  const now = new Date();

  // ----- Static hubs -----
  for (const p of ["/", "/companies", "/products", "/calculator", "/glossary"]) {
    entries.push(...forAllLocales(p, {
      priority: p === "/" ? 1.0 : 0.7,
      changeFrequency: p === "/" ? "daily" : "weekly",
      lastModified: now,
    }));
  }

  // Category product lists (priority higher than static hubs)
  for (const p of ["/products/critical-illness", "/products/savings"]) {
    entries.push(...forAllLocales(p, {
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: now,
    }));
  }

  // ----- Companies -----
  const companies = await prisma.company.findMany({
    where: { products: { some: {} } },
    select: { slug: true, updatedAt: true },
  });
  for (const c of companies) {
    entries.push(...forAllLocales(`/company/${c.slug}`, {
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: c.updatedAt ?? now,
    }));
  }

  // ----- Products -----
  // Only emit URLs for products that have a ProductVector v2.11. This
  // mirrors Step 3's policy: thin / data-less products are noindex.
  const siteSlugs = await getSiteProductSlugs();
  const allVectors = await getAllProductVectors();
  const vectorBySlug = new Map<string, ProductVectorV24>(
    allVectors.map((v) => [v.base.slug, v])
  );
  // Also consult Prisma updatedAt so the timestamp is fresh.
  const dbProducts = await prisma.product.findMany({
    where: { slug: { in: siteSlugs } },
    select: { slug: true, updatedAt: true, company: { select: { slug: true } } },
  });
  for (const p of dbProducts) {
    if (!vectorBySlug.has(p.slug)) continue; // skip thin products
    entries.push(...forAllLocales(`/product/${p.slug}`, {
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: p.updatedAt ?? now,
    }));
  }

  // ----- Compare detail pages -----
  // Only emit URLs whose compareIndexable() returns true.
  const comparisons = await prisma.comparison.findMany({
    select: {
      slug: true,
      updatedAt: true,
      productA: { select: { slug: true, company: { select: { slug: true } } } },
      productB: { select: { slug: true, company: { select: { slug: true } } } },
    },
  });

  // Pre-load vectors for all referenced (company, slug) pairs.
  const pairKeys = new Set<string>();
  for (const c of comparisons) {
    pairKeys.add(`${c.productA.company?.slug || ""}::${c.productA.slug}`);
    pairKeys.add(`${c.productB.company?.slug || ""}::${c.productB.slug}`);
  }
  const vectorCache = new Map<string, ProductVectorV24 | null>();
  for (const key of pairKeys) {
    const [companySlug, slug] = key.split("::");
    if (!companySlug || !slug) continue;
    const v = (await loadProductVector(companySlug, slug)) as
      | ProductVectorV24
      | null;
    vectorCache.set(key, v);
  }

  for (const c of comparisons) {
    const keyA = `${c.productA.company?.slug || ""}::${c.productA.slug}`;
    const keyB = `${c.productB.company?.slug || ""}::${c.productB.slug}`;
    const va = vectorCache.get(keyA) || null;
    const vb = vectorCache.get(keyB) || null;
    if (!compareIndexable(va, vb).indexable) continue; // skip thin compares
    entries.push(...forAllLocales(`/compare/${c.slug}`, {
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: c.updatedAt ?? now,
    }));
  }

  // ----- Excluded intentionally -----
  // /admin, /login, /search, /rankings, /compare (hub), /compare/critical-illness,
  // /compare/savings, /sitemap (HTML): all are noindex / disallow. Not emitted.

  void DEFAULT_LOCALE; // reserved for future per-locale logic
  return entries;
}

// Allow static-generation friendly cache to be reused; force dynamic so
// DB and vector reads always reflect the current state.
export const dynamic = "force-dynamic";
export const revalidate = 3600; // re-build hourly
