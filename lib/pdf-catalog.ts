// pdf-catalog.ts
//
// Single source of truth for the public catalog.
//
// "Pdfs under public/pdfs/ are the truth source": every product has a PDF
// there, and the company boundary is inferred from filename prefix. This
// module reads the filesystem directly (`public/pdfs/` and
// `data/vectors/{co}/{slug}.vector.json`) and returns a frozen view of:
//
//   - all 9 companies that actually have at least one PDF (china-life has
//     translations but no PDF, so it is intentionally excluded here)
//   - all 45 products, one per PDF
//   - aggregate counts for the homepage stat block
//
// This intentionally does NOT read prisma. The DB still owns runtime-only
// data: users, sessions, discussions, user-saved comparisons, and PDF
// download authorization. None of that is catalog data and none of that
// flows through this module.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "@/i18n/config";

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

// ---------- aggregate helpers ----------
// Mirrors the math that `app/[locale]/page.tsx` does today against the
// prisma-backed `siteSlugs` list. We just count PDF products per category.

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
