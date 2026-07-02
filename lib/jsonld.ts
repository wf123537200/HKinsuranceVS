// lib/jsonld.ts — Schema.org JSON-LD builders for Policy Vector pages.
//
// Goals:
//   - One source of truth for site-level JSON-LD (WebSite, Organization).
//   - Per-page helpers for product/company/compare structured data.
//   - All absolute URLs go through localizedUrl() so they honour the
//     project's localePrefix: "as-needed" convention.
//
// Usage: import the builder for the page type, pass it through the
// <JsonLd /> component (or render via dangerouslySetInnerHTML inline),
// which calls JSON.stringify so user-controllable strings cannot break
// the <script> tag.

import type { Locale } from "../i18n/config";
import { localizedUrl, siteUrl } from "./seo";

/* ------------------------------------------------------------------ *
 * Site-level entities
 * ------------------------------------------------------------------ */

export interface WebSiteJsonLdOptions {
  locale: Locale;
  /** Localized site description (display). */
  description: string;
}

export function buildWebSiteJsonLd(opts: WebSiteJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Policy Vector",
    alternateName: "PolicyVector",
    url: localizedUrl(opts.locale, "/"),
    description: opts.description,
    inLanguage: ["en", "zh-CN", "zh-TW"],
    publisher: { "@type": "Organization", name: "Policy Vector", url: siteUrl() },
  };
}

export interface OrganizationJsonLdOptions {
  locale: Locale;
  /** Localized org description. */
  description: string;
}

export function buildPublisherOrganizationJsonLd(opts: OrganizationJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Policy Vector",
    url: siteUrl(),
    logo: `${siteUrl()}/logos/policy-vector-logo.png`,
    description: opts.description,
  };
}

/* ------------------------------------------------------------------ *
 * Company / Insurance Organization
 * ------------------------------------------------------------------ */

export interface CompanyOrgJsonLdInput {
  /** Localized display name. */
  displayName: string;
  /** Optional English/original name. */
  name?: string | null;
  /** Locale-relative path: "/company/{slug}". */
  path: string;
  region: string; // "Hong Kong" | "Mainland China"
  country?: string | null;
  website?: string | null;
  foundedYear?: number | null;
  headquarters?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  regulator?: string | null;
  amBestRating?: string | null;
  moodysRating?: string | null;
  spRating?: string | null;
  fitchRating?: string | null;
}

export function buildCompanyOrganizationJsonLd(
  opts: CompanyOrgJsonLdInput & { locale: Locale }
) {
  const { locale, ...c } = opts;
  const url = localizedUrl(locale, c.path);
  const org: Record<string, unknown> = {
    "@type": "Organization",
    name: c.displayName,
    alternateName: c.name || undefined,
    url,
    address: c.headquarters ? { "@type": "PostalAddress", addressLocality: c.headquarters, addressCountry: c.country || undefined } : undefined,
    foundingDate: c.foundedYear ? String(c.foundedYear) : undefined,
    description: c.description || undefined,
    logo: c.logoUrl || undefined,
    areaServed: c.region || undefined,
  };
  // Only include website if http(s)
  if (c.website && /^https?:\/\//.test(c.website)) org.sameAs = [c.website];
  // Ratings aggregate — Google suggests we use aggregateRating for products,
  // and a manual review-style entry for company credit ratings is acceptable
  // but not standard. We'll just attach the regulator for context.
  if (c.regulator) org.parentOrganization = undefined; // keep minimal
  return { "@context": "https://schema.org", ...org };
}

/* ------------------------------------------------------------------ *
 * ItemList — for /companies and /products listing pages
 * ------------------------------------------------------------------ */

export interface ItemListEntry {
  /** Display name (already localized). */
  name: string;
  /** Locale-relative path (e.g. "/company/aia-hk"). */
  path: string;
  /** Optional absolute image URL. */
  image?: string | null;
  /** Optional short description. */
  description?: string | null;
}

export interface ItemListJsonLdOptions {
  locale: Locale;
  name: string;
  description?: string;
  items: ItemListEntry[];
}

export function buildItemListJsonLd(opts: ItemListJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    description: opts.description,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      url: localizedUrl(opts.locale, it.path),
      ...(it.image ? { image: it.image } : {}),
      ...(it.description ? { description: it.description } : {}),
    })),
  };
}

/* ------------------------------------------------------------------ *
 * FinancialProduct — for product detail pages
 *
 * Schema.org has FinancialProduct as the supertype. We set
 *   category: "Insurance"      (per schema.org allowed values)
 *   feesAndCommissionsSpecification: brief policy notes
 * LoanOrCredit / BankAccount / InvestmentFund are not applicable here.
 * ------------------------------------------------------------------ */

export interface FinancialProductJsonLdInput {
  /** Localized display name. */
  name: string;
  /** Optional English name. */
  alternateName?: string | null;
  /** Locale-relative path. */
  path: string;
  category: "critical_illness" | "savings" | string;
  region: string;
  currencies: string[];
  description?: string | null;
  /** Issuer display name + URL (relative). */
  brandName: string;
  brandPath: string;
}

export interface FinancialProductJsonLdOptions extends FinancialProductJsonLdInput {
  locale: Locale;
}

export function buildFinancialProductJsonLd(opts: FinancialProductJsonLdOptions) {
  const { locale, ...p } = opts;
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: p.name,
    alternateName: p.alternateName || undefined,
    url: localizedUrl(locale, p.path),
    description: p.description || undefined,
    category: "Insurance",
    provider: {
      "@type": "Organization",
      name: p.brandName,
      url: localizedUrl(locale, p.brandPath),
    },
    areaServed: p.region || undefined,
    feesAndCommissionsSpecification: p.currencies.length
      ? `Supported currencies: ${p.currencies.join(", ")}`
      : undefined,
  };
}

/* ------------------------------------------------------------------ *
 * Compare pair — for /compare/[slug] pages
 *
 * We emit two FinancialProduct blocks plus an ItemList that wraps them
 * so search engines understand the page is a side-by-side comparison.
 * ------------------------------------------------------------------ */

export interface ComparePairJsonLdOptions {
  locale: Locale;
  /** Left side. */
  a: {
    name: string;
    path: string;
    brandName: string;
    brandPath: string;
    category: string;
    region: string;
  };
  /** Right side. */
  b: {
    name: string;
    path: string;
    brandName: string;
    brandPath: string;
    category: string;
    region: string;
  };
  /** Slug of the compare page (locale-relative). */
  comparePath: string;
}

export function buildComparePairJsonLd(opts: ComparePairJsonLdOptions) {
  const { locale, a, b, comparePath } = opts;
  const mk = (p: typeof a) => ({
    "@type": "FinancialProduct",
    name: p.name,
    url: localizedUrl(locale, p.path),
    category: "Insurance",
    provider: {
      "@type": "Organization",
      name: p.brandName,
      url: localizedUrl(locale, p.brandPath),
    },
    areaServed: p.region || undefined,
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      mk(a),
      mk(b),
      {
        "@type": "WebPage",
        "@id": localizedUrl(locale, comparePath),
        name: `${a.name} vs ${b.name}`,
        url: localizedUrl(locale, comparePath),
        mainEntity: { "@type": "ItemList", itemListElement: [
          { "@type": "ListItem", position: 1, name: a.name, url: localizedUrl(locale, a.path) },
          { "@type": "ListItem", position: 2, name: b.name, url: localizedUrl(locale, b.path) },
        ]},
      },
    ],
  };
}

/* ------------------------------------------------------------------ *
 * FAQPage — for product + compare pages (GEO/AEO)
 *
 * Per schema.org FAQPage docs, the `mainEntity` array holds Question
 * objects with `name` (the question) and `acceptedAnswer.text` (the
 * answer string). Strings are JSON-stringified by the <JsonLd /> wrapper,
 * so user-controllable substrings cannot break out.
 * ------------------------------------------------------------------ */

export interface FaqEntry {
  question: string;
  answer: string;
}

export function buildFaqPageJsonLd(faqs: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/* ------------------------------------------------------------------ *
 * DefinedTermSet — for glossary pages
 *
 * Each glossary entry becomes a DefinedTerm node. The set is emitted
 * inside @graph alongside a DefinedTermSet anchor so Google understands
 * the relationship.
 * ------------------------------------------------------------------ */

export interface DefinedTermInput {
  /** Locale-relative path: "/glossary/{slug}". */
  path: string;
  /** Term name (already localized). */
  name: string;
  /** Short definition (already localized). */
  description: string;
}

export interface DefinedTermSetJsonLdOptions {
  locale: Locale;
  /** Display name for the term set. */
  setName: string;
  /** Display description for the term set. */
  setDescription: string;
  terms: DefinedTermInput[];
}

export function buildDefinedTermSetJsonLd(opts: DefinedTermSetJsonLdOptions) {
  const { locale, setName, setDescription, terms } = opts;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        name: setName,
        description: setDescription,
        url: localizedUrl(locale, "/glossary"),
      },
      ...terms.map((t) => ({
        "@type": "DefinedTerm",
        name: t.name,
        description: t.description,
        url: localizedUrl(locale, t.path),
        inDefinedTermSet: localizedUrl(locale, "/glossary"),
      })),
    ],
  };
}
