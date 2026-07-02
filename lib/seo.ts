// lib/seo.ts — SEO helpers shared across pages.
//
// Goals:
//   - Single source of truth for absolute site URL.
//   - Localized absolute URL builder (handles en's missing locale prefix).
//   - buildMetadata(): assemble Next.js Metadata with title / description /
//     canonical / Open Graph / Twitter in one place, avoiding copy-paste.
//
// Brand: Policy Vector. Site URL defaults to https://policy-vector.com (the
// production target). Override at runtime with NEXT_PUBLIC_SITE_URL.

import type { Metadata } from "next";
import type { Locale } from "../i18n/config";
import type { ProductVectorV24 } from "./product-vector-registry";
import { getByPath, isEmptyValue } from "./product-vector-formatters";

const DEFAULT_SITE_URL = "https://policy-vector.com";

/** Absolute base URL with no trailing slash. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

/**
 * Build an absolute URL for a path. Strips the locale prefix for `en` because
 * `localePrefix: "as-needed"` hides it. Other locales keep their prefix.
 *
 *   localizedUrl("en", "/product/foo")     -> https://policy-vector.com/product/foo
 *   localizedUrl("zh-CN", "/product/foo")  -> https://policy-vector.com/zh-CN/product/foo
 */
export function localizedUrl(locale: Locale, path: string): string {
  const base = siteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return `${base}${cleanPath}`;
  return `${base}/${locale}${cleanPath}`;
}

/** Map project locale -> OGP locale string (zh_CN etc.) used by Facebook/LinkedIn. */
export function ogLocale(locale: Locale): string {
  switch (locale) {
    case "zh-CN":
      return "zh_CN";
    case "zh-TW":
      return "zh_TW";
    case "en":
    default:
      return "en_US";
  }
}

/**
 * Build a Next.js Metadata object. Title is left as-is (the layout's
 * `title.template` appends " | Policy Vector" automatically), description,
 * canonical, Open Graph (locale + siteName) and Twitter Card are populated.
 *
 * Open Graph / Twitter titles include the suffix directly so social previews
 * show the full brand even though the document <title> is built by the layout.
 */
export interface BuildMetadataOptions {
  /** Absolute or relative path under the locale. Leading slash optional. */
  path: string;
  /** Locale for canonical / OG locale. */
  locale: Locale;
  /** Page title WITHOUT suffix. Layout appends " | Policy Vector" automatically. */
  title: string;
  /** Meta description. */
  description: string;
  /** Open Graph type. Defaults to "website". */
  ogType?: "website" | "article";
  /** Optional absolute image URL for OG / Twitter. */
  image?: string | null;
  /** Optional robots override (e.g. noindex for thin pages). */
  robots?: Metadata["robots"];
}

const TITLE_SUFFIX = " | Policy Vector";


export function buildMetadata(opts: BuildMetadataOptions): Metadata {
  const {
    path,
    locale,
    title,
    description,
    ogType = "website",
    image,
    robots,
  } = opts;

  const url = localizedUrl(locale, path);
  const fullTitle = `${title}${TITLE_SUFFIX}`;

  // Per-locale alternates — Next.js will add hreflang link tags.
  const languages: Record<string, string> = {
    en: localizedUrl("en", path),
    "zh-CN": localizedUrl("zh-CN", path),
    "zh-TW": localizedUrl("zh-TW", path),
  };

  const og: NonNullable<Metadata["openGraph"]> = {
    type: ogType,
    locale: ogLocale(locale),
    url,
    siteName: "Policy Vector",
    title: fullTitle,
    description,
  };
  if (image) og.images = [{ url: image }];

  return {
    // Use absolute so the parent layout's title.template (which exists for
    // pages that don't go through buildMetadata, e.g. /admin, /login) does
    // NOT append again. buildMetadata owns the full title string.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url, languages },
    openGraph: og,
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots,
  };
}

/* ------------------------------------------------------------------ *
 * Compare-page indexability
 *
 * Per SEO-GEO spec, a compare page is allowed to be indexed only when both
 * products satisfy:
 *   - company (base.company_slug is non-empty)
 *   - region (base.region is non-empty)
 *   - category (base.category is non-empty)
 *   - currencies (at least one entry)
 *   - premium_terms (at least one entry)
 *   AND at least 3 comparable fields are non-empty on each side.
 *
 * If any of the above is missing on either side, the page should be
 * `noindex` to avoid thin / broken pages being crawled and indexed.
 * ------------------------------------------------------------------ */

const REQUIRED_BASE_PATHS: Array<keyof ProductVectorV24["base"]> = [
  "company_slug",
  "region",
  "category",
];

const REQUIRED_PROFILE_PATHS = [
  "compare_profile.currencies",
  "compare_profile.premium_terms",
];

/**
 * Fields counted toward the "≥ 3 comparable fields" rule. We pick fields that
 * are commonly populated on real products and useful to a comparison reader.
 */
const COMPARABLE_FIELDS: ReadonlyArray<string> = [
  "base.policy_term",
  "compare_profile.policy_term",
  "compare_profile.entry_age_summary",
  "compare_profile.covered_illness_total",
  "compare_profile.major_illness_count",
  "compare_profile.early_stage_illness_count",
  "compare_profile.bonus_types",
  "compare_profile.highest_illustrated_irr",
  "compare_profile.highest_total_payout_percent",
  "compare_profile.icu_benefit_summary",
  "compare_profile.has_multiple_claims",
  "compare_profile.has_cancer_multiple_claims",
  "modules.life_protection_module.has_death_benefit",
];

export interface CompareIndexability {
  indexable: boolean;
  /** Per-side missing required keys (lowercase field path). */
  missingLeft: string[];
  missingRight: string[];
  /** Comparable field counts per side. */
  comparableLeft: number;
  comparableRight: number;
}

function isVectorBaseEmpty(
  v: ProductVectorV24 | null | undefined
): boolean {
  return !v || !v.base;
}

export function compareIndexable(
  vectorA: ProductVectorV24 | null | undefined,
  vectorB: ProductVectorV24 | null | undefined
): CompareIndexability {
  const missingLeft: string[] = [];
  const missingRight: string[] = [];

  if (isVectorBaseEmpty(vectorA)) missingLeft.push("base");
  else {
    for (const k of REQUIRED_BASE_PATHS) {
      if (!vectorA!.base[k]) missingLeft.push(`base.${k}`);
    }
  }
  if (isVectorBaseEmpty(vectorB)) missingRight.push("base");
  else {
    for (const k of REQUIRED_BASE_PATHS) {
      if (!vectorB!.base[k]) missingRight.push(`base.${k}`);
    }
  }

  for (const p of REQUIRED_PROFILE_PATHS) {
    const va = getByPath(vectorA, p);
    const vb = getByPath(vectorB, p);
    if (isEmptyValue(va)) missingLeft.push(p);
    if (isEmptyValue(vb)) missingRight.push(p);
  }

  const countComparable = (v: ProductVectorV24 | null | undefined): number => {
    if (!v) return 0;
    let n = 0;
    for (const f of COMPARABLE_FIELDS) {
      const val = getByPath(v, f);
      if (!isEmptyValue(val)) n++;
    }
    return n;
  };
  const comparableLeft = countComparable(vectorA);
  const comparableRight = countComparable(vectorB);

  const hasEnough = comparableLeft >= 3 && comparableRight >= 3;
  const indexable =
    missingLeft.length === 0 && missingRight.length === 0 && hasEnough;

  return { indexable, missingLeft, missingRight, comparableLeft, comparableRight };
}

/* ------------------------------------------------------------------ *
 * BreadcrumbList JSON-LD
 *
 * Build a Schema.org BreadcrumbList payload for embedding in pages.
 * Each item is { name, path } where path is relative to the locale prefix
 * (e.g. "/products", "/company/foo"). The helper uses localizedUrl() to
 * produce absolute URLs in the CURRENT locale only (per Google's spec,
 * BreadcrumbList items are not localized; hreflang is declared elsewhere).
 *
 * The first item should normally be the home page (position 1).
 * ------------------------------------------------------------------ */
export interface BreadcrumbItem {
  /** Display name (already localized by caller). */
  name: string;
  /** Locale-relative path, e.g. "/products", "/company/aia-hk". */
  path: string;
}

export interface BreadcrumbJsonLdOptions {
  /** Current locale used to build absolute URLs. */
  locale: Locale;
  /** Ordered list of breadcrumb items (first item = home, last = current page). */
  items: BreadcrumbItem[];
}

export function buildBreadcrumbJsonLd(opts: BreadcrumbJsonLdOptions) {
  const { locale, items } = opts;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}

