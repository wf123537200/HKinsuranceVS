// lib/selected-products.ts
// V1 product visibility helpers.
//
// Two tiers are exposed:
//   1. Selected 24 — the curated "V1 精选" products (use for special badges like "火热").
//   2. Site products — all products with a confirmed PDF (manual_verified or candidate)
//      available in DB. The site-wide product list pulls from this pool so visitors can
//      browse every product we have official documentation for.
import { prisma } from "./prisma";
import { selectedHotDiscussedInsuranceProducts, type SelectedProduct } from "../data/hot-discussed-products";

export type SelectedCategory = "critical_illness" | "savings";

export interface SelectedMeta {
  company_slug: string;
  product_name: string;
  category: SelectedCategory;
  db_slug: string;
  pdf_path: string;
  selected_reason: string;
}

/** All 24 selected products, with derived db_slug only. */
export function getSelectedProducts(): SelectedMeta[] {
  return selectedHotDiscussedInsuranceProducts.map((s) => ({
    company_slug: s.company_slug,
    product_name: s.product_name,
    category: s.category,
    db_slug: s.db_slug,
    pdf_path: s.pdf_path,
    selected_reason: s.selected_reason,
  }));
}

/** Slugs of the 24 selected products (excluding any pending-* placeholders). */
export function getSelectedDbSlugs(): string[] {
  return selectedHotDiscussedInsuranceProducts
    .map((s) => s.db_slug)
    .filter((s): s is string => !!s && !s.startsWith("pending-"));
}

/**
 * Slugs of all products visible site-wide: every product with an official PDF
 * and a `manual_verified` or `candidate` dataStatus. Includes the 24 selected.
 */
export async function getSiteProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: {
      dataStatus: { in: ["manual_verified", "candidate"] },
      localPdfPath: { not: null },
    },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

/** Selected slugs grouped by category, for CI / Savings filter pages. */
export function getSelectedDbSlugsByCategory(): {
  critical_illness: string[];
  savings: string[];
} {
  const result: { critical_illness: string[]; savings: string[] } = {
    critical_illness: [],
    savings: [],
  };
  for (const s of selectedHotDiscussedInsuranceProducts) {
    if (!s.db_slug || s.db_slug.startsWith("pending-")) continue;
    if (s.category === "critical_illness") result.critical_illness.push(s.db_slug);
    else if (s.category === "savings") result.savings.push(s.db_slug);
  }
  return result;
}

/** Re-export for convenience. */
export type { SelectedProduct };