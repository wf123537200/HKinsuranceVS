// pdf-catalog.ts
//
// Catalog source of truth for the public site.
//
// Two catalog views are exposed here:
//
//   1. getLocalPdfCatalog() — legacy filesystem-scanning catalog.
//      Reads public/pdfs/ directly and infers company boundaries from
//      filename prefix. Useful for local dev and data-extraction runs
//      where we want to verify what's on disk. NOT safe in production
//      because public/pdfs/ is gitignored and won't exist on the
//      server.
//
//   2. getProductCatalog() — runtime catalog. Reads from prisma
//      (companies, products, comparisons) and merges in vector
//      metadata (category, region, displayName) from
//      data/vectors/. The returned pdfPath is a stable relative path
//      used as an identifier only — the actual PDF bytes are NOT
//      shipped to the server; the existing /api/pdf-url route issues
//      R2-signed URLs on click.
//
// Production code paths (homepage hero stat block, companies index)
// MUST use getProductCatalog(). getLocalPdfCatalog is preserved only
// for compatibility with any tool/script that wants to know what's on
// disk.
//
// DB still owns runtime-only data: users, sessions, discussions,
// user-saved comparisons, and PDF download authorization. None of
// that flows through this module.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { getAllProductVectors } from "@/lib/product-vector-registry";

// Each company canonical slug can be matched by one or more filename
// prefixes. Prudential has two (`pru-` and `prudential-`); Ping An has
// two (`pingan-` and `ping-an-`).
const COMPANY_PREFIXES: Record<string, string[]> = {
  "aia-hk": ["aia-"],
  "axa-hk": ["axa-"],
  "cpic-life": ["cpic-"],
  "fwd-hk": ["fwd-"],
  "manulife-hk": ["manulife-"],
  "new-china-life": ["new-china-"],
  "ping-an": ["pingan-", "ping-an-"],
  "prudential-hk": ["pru-", "prudential-"],
  "taikang-life": ["taikang-"],
};

export type PdfCompany = {
  slug: string;
  /** Filename prefix this company owns, e.g. "aia-". */
  prefix: string;
  /** Products in this company, sorted by display name. */
  productCount: number;
  /** "Hong Kong" | "Mainland China" | etc. */
  region: string;
};

export type PdfProduct = {
  /** slug of the company (not the company object) */
  companySlug: string;
  /** slug of the product — also the basename without `.pdf`, minus company prefix */
  slug: string;
  /** full relative path under public/, with leading `/`. */
  pdfPath: string;
  /** "critical_illness" | "savings" | undefined if vector is missing */
  category?: "critical_illness" | "savings";
  /** vector "base.region" or undefined. */
  region?: string;
  /** localized display name, if vector is present */
  displayName?: string;
};

export type PdfCatalog = {
  totalPdfs: number;
  companies: PdfCompany[];
  products: PdfProduct[];
};

// ---------- filesystem read ----------

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

async function vectorForProduct(companySlug: string, productSlug: string): Promise<{
  category?: PdfProduct["category"];
  region?: string;
  displayName?: string;
} | null> {
  // Try every company prefix in order (e.g. prudential-hk has both `pru-`
  // and `prudential-` because filenames are not consistent in the wild).
  // The vector filename is `<prefix><productSlug>.vector.json`.
  const prefixes = COMPANY_PREFIXES[companySlug] ?? [""];
  const vectorsDir = path.join(process.cwd(), "data", "vectors", companySlug);
  for (const prefix of prefixes) {
    const filename = `${prefix}${productSlug}.vector.json`;
    try {
      const buf = await fs.readFile(path.join(vectorsDir, filename), "utf8");
      const json = JSON.parse(buf);
      const base = json?.base;
      if (!base) continue;
      return {
        category: base.category === "savings" || base.category === "critical_illness"
          ? base.category
          : undefined,
        region: typeof base.region === "string" ? base.region : undefined,
        displayName: typeof base.product_name === "string" ? base.product_name : undefined,
      };
    } catch {
      // try next prefix
    }
  }
  return null;
}

// Try every company prefix in order. Returns the slug if matched, else null.
function matchCompany(filename: string): { companySlug: string; productSlug: string } | null {
  for (const [slug, prefixes] of Object.entries(COMPANY_PREFIXES)) {
    for (const prefix of prefixes) {
      if (filename.startsWith(prefix) && filename.toLowerCase().endsWith(".pdf")) {
        const productSlug = filename.slice(prefix.length, -".pdf".length).toLowerCase();
        return { companySlug: slug, productSlug };
      }
    }
  }
  return null;
}

export async function getPdfCatalog(): Promise<PdfCatalog> {
  const pdfsDir = path.join(process.cwd(), "public", "pdfs");
  const files = (await readDirSafe(pdfsDir))
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  const products: PdfProduct[] = [];
  const companyBySlug = new Map<string, PdfCompany>();
  // count of products per company, computed as we go
  const productCountBySlug = new Map<string, number>();

  for (const filename of files) {
    const match = matchCompany(filename);
    if (!match) continue; // skip orphan PDFs

    // stable region default: HK for hk-named slugs, China for the rest
    const defaultRegion = match.companySlug === "aia-hk" || match.companySlug === "axa-hk" ||
      match.companySlug === "fwd-hk" || match.companySlug === "manulife-hk" ||
      match.companySlug === "prudential-hk" ? "Hong Kong" : "Mainland China";

    const vec = await vectorForProduct(match.companySlug, match.productSlug);

    products.push({
      companySlug: match.companySlug,
      slug: match.productSlug,
      pdfPath: `/pdfs/${filename}`,
      category: vec?.category,
      region: vec?.region ?? defaultRegion,
      displayName: vec?.displayName,
    });

    productCountBySlug.set(
      match.companySlug,
      (productCountBySlug.get(match.companySlug) ?? 0) + 1
    );
  }

  for (const slug of Object.keys(COMPANY_PREFIXES)) {
    const productCount = productCountBySlug.get(slug) ?? 0;
    // Use the first prefix for the (rarely-shown) prefix field.
    const prefix = COMPANY_PREFIXES[slug][0];
    companyBySlug.set(slug, {
      slug,
      prefix,
      productCount,
      region: slug.endsWith("-hk") || slug === "aia-hk" || slug === "axa-hk" ||
        slug === "fwd-hk" || slug === "manulife-hk" || slug === "prudential-hk"
        ? "Hong Kong"
        : "Mainland China",
    });
  }

  return {
    totalPdfs: products.length,
    companies: Array.from(companyBySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug, "en")),
    products,
  };
}

// Back-compat alias. Old code paths that imported getPdfCatalog
// continue to compile; they now get the local filesystem-scanning
// catalog. New code paths should call getProductCatalog instead.
export { getPdfCatalog as getLocalPdfCatalog };

// ---------- runtime product catalog ----------
// This is what production actually depends on. It does NOT read
// public/pdfs/ -- PDFs on disk are a local-dev / data-extraction
// artifact only. In production the public/pdfs/ directory does not
// exist (it's gitignored), so a filesystem-scanning catalog returns
// zero products and the home page hero stat reads "0 / 0 / 0". To
// prevent that, this catalog reads from prisma (companies, products)
// and merges in vector metadata (category, region, display name)
// from data/vectors/. The catalog's own productCatalogStats
// helper derives the comparison-pair count from ci/sv counts so we
// don't need a separate prisma.comparison.count() round trip.
//
// `pdfPath` is preserved on each product so existing UI that links to
// `/pdfs/<slug>.pdf` still has a stable relative URL. The actual PDF
// bytes are NOT shipped to the server; the existing /api/pdf-url
// route generates a signed R2 URL on click. The relative path is a
// stable identifier only.


export type RuntimeCompany = {
  slug: string;
  prefix: string;
  productCount: number;
  region: string;
};

export type RuntimeProduct = {
  companySlug: string;
  slug: string;
  pdfPath: string;
  category?: "critical_illness" | "savings";
  region?: string;
  displayName?: string;
  isPublished: boolean;
};

export type RuntimeCatalog = {
  totalPdfs: number;
  companies: RuntimeCompany[];
  products: RuntimeProduct[];
};

export type RuntimeCatalogStats = {
  companies: number;
  products: number;
  comparisons: number;
};

function derivePrefix(slug: string): string {
  return COMPANY_PREFIXES[slug]?.[0] ?? "";
}

function deriveRegion(slug: string): string {
  return slug.endsWith("-hk") || slug === "aia-hk" || slug === "axa-hk" ||
    slug === "fwd-hk" || slug === "manulife-hk" || slug === "prudential-hk"
    ? "Hong Kong"
    : "Mainland China";
}

export async function getProductCatalog(): Promise<RuntimeCatalog> {
  // Vectors are the single source of truth for the public catalog.
  // We do NOT take a Prisma `isPublished` filter here — operators
  // occasionally unpublish vector-backed products (out_of_scope,
  // mismatch, etc.) and that drift must not pop a product out of the
  // public catalog. The catalog count always equals the number of
  // vector files on disk. Prisma is kept in sync by
  // scripts/sync-vectors-to-db.cjs so detail pages, /api/pdf-url,
  // and discussion threads can still join back by id.
  const vectors = await getAllProductVectors();
  const companySlugs = Array.from(new Set(vectors.map((v) => v.base.company_slug)));
  const companies = await prisma.company.findMany({
    where: { slug: { in: companySlugs } },
    orderBy: { slug: "asc" },
    select: { slug: true },
  });

  // Index vectors by company slug, deriving runtime products from each
  // vector's `base.*`. Category comes from the vector exclusively;
  // the prisma category column is irrelevant to this catalog.
  const productsByCompany = new Map<string, RuntimeProduct[]>();
  for (const v of vectors) {
    const base = v.base;
    const companySlug = base.company_slug;
    const slug = base.slug;
    const category =
      base.category === "savings" || base.category === "critical_illness"
        ? base.category
        : undefined;
    const runtime: RuntimeProduct = {
      companySlug,
      slug,
      pdfPath: `/pdfs/${slug}.pdf`,
      category,
      region: typeof base.region === "string" ? base.region : undefined,
      displayName: typeof base.product_name === "string" ? base.product_name : undefined,
      isPublished: true,
    };
    const list = productsByCompany.get(companySlug) ?? [];
    list.push(runtime);
    productsByCompany.set(companySlug, list);
  }

  const runtimeCompanies: RuntimeCompany[] = companies
    .map((c) => {
      const products = productsByCompany.get(c.slug) ?? [];
      return {
        slug: c.slug,
        prefix: derivePrefix(c.slug),
        productCount: products.length,
        region: deriveRegion(c.slug),
      };
    })
    .filter((c) => c.productCount > 0)
    .sort((a, b) => a.slug.localeCompare(b.slug, "en"));

  const products = runtimeCompanies.flatMap((c) => productsByCompany.get(c.slug) ?? []);

  return {
    totalPdfs: products.length,
    companies: runtimeCompanies,
    products,
  };
}

export function productCatalogStats(catalog: RuntimeCatalog): RuntimeCatalogStats {
  const companyCount = catalog.companies.filter((c) => c.productCount > 0).length;
  const ciCount = catalog.products.filter((p) => p.category === "critical_illness").length;
  const svCount = catalog.products.filter((p) => p.category === "savings").length;
  const comparisons = (ciCount * (ciCount - 1)) / 2 + (svCount * (svCount - 1)) / 2;
  return {
    companies: companyCount,
    products: catalog.products.length,
    comparisons,
  };
}

// ---------- aggregate helpers (legacy PDF-catalog math) ----------
// Kept for any code that still wants to derive counts from the
// filesystem-scanned catalog. The runtime catalog above has its own
// stats helper that reads from prisma instead.
export type PdfCatalogStats = {
  companies: number;
  products: number;
  /** Distinct category pairs (CI x CI, Savings x Savings). */
  comparisons: number;
};

export function pdfCatalogStats(catalog: PdfCatalog): PdfCatalogStats {
  const companyCount = catalog.companies.filter((c) => c.productCount > 0).length;
  const ciCount = catalog.products.filter((p) => p.category === "critical_illness").length;
  const svCount = catalog.products.filter((p) => p.category === "savings").length;
  const comparisons = (ciCount * (ciCount - 1)) / 2 + (svCount * (svCount - 1)) / 2;
  return {
    companies: companyCount,
    products: catalog.products.length,
    comparisons,
  };
}
