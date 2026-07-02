// Shared product card used by:
//   - Homepage (app/[locale]/page.tsx) — hot products section, compact size
//   - Product list pages (ProductListWithSearch.tsx) — regular size
//
// One component, one design. Same content (displayName + region + company +
// category + logo + hot badge), only the size and the badge positioning differ
// between the two contexts.
//
// Tagline: "展示内容一样" — both sites show the same product information.

import Link from "next/link";
import CompanyLogo from "./CompanyLogo";
import HotBadge from "./HotBadge";

export interface ProductCardData {
  /** DB slug used for the link target */
  slug: string;
  /** Localized product name */
  displayName: string;
  /** "CRITICAL_ILLNESS" or "SAVINGS" — drives color and label */
  category: "CRITICAL_ILLNESS" | "SAVINGS";
  /** Already-localized region string (e.g. "中国香港", "中国大陆", "Hong Kong") */
  region: string;
  /** Localized company name (shown in the "regular" variant) */
  companyDisplayName: string;
  /** Company slug used to look up brand colors / abbreviations in CompanyLogo */
  companySlug: string;
  /** URL to company logo; falls back to brand-color block when missing */
  companyLogoUrl?: string | null;
  /** One- or two-sentence product summary (shown in the "regular" variant) */
  summary?: string | null;
  /** When true, the flame "火热" badge is shown next to the product name */
  isHot?: boolean;
  /** Pre-translated category label, e.g. "重疾险" / "储蓄险" / "Critical Illness" */
  categoryLabel: string;
}

export type ProductCardSize = "compact" | "regular";

interface Props {
  product: ProductCardData;
  /** "compact" = 4-up grid homepage; "regular" = 3-up grid list page */
  size?: ProductCardSize;
}

export default function ProductCard({ product, size = "regular" }: Props) {
  // `size` is kept in the API for future divergence (e.g. compact 4-col vs
  // regular 3-col) but both currently share the exact same render.
  void size;
  const badgeColor =
    product.category === "CRITICAL_ILLNESS"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  // Shared layout for both compact (homepage) and regular (list page).
  // Two-row design — the same shape in both, only the grid column count differs.
  //   row 1:  [title] [flame]                        [company logo]
  //   row 2:  [region]                              [category badge]   ← right-aligned with badge
  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex flex-col gap-1.5 p-3.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all min-h-[120px]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
          <span>{product.displayName}</span>
          {product.isHot && <HotBadge size="sm" />}
        </h3>
        <div className="shrink-0">
          <CompanyLogo
            name={product.companySlug}
            displayName={product.companyDisplayName}
            logoUrl={product.companyLogoUrl}
            size="sm"
          />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${badgeColor}`}>
          {product.categoryLabel}
        </span>
        <span className="text-xs text-gray-400">{product.region}</span>
      </div>
    </Link>
  );
}
