"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import InlineSearch from "./InlineSearch";
import ProductCard, { type ProductCardData } from "./ProductCard";

interface Product {
  id: string;
  slug: string;
  displayName: string;
  category: string;
  rawRegion: string;
  region: string;
  summary?: string | null;
  company: { displayName: string; slug?: string; logoUrl?: string | null };
  isHot?: boolean;
}

interface Props {
  products: Product[];
  /**
   * When set, the page is locked to one category and the category
   * filter buttons (全部 / 重疾 / 储蓄) are hidden. Region filter
   * stays available. Pass on /products/critical-illness and
   * /products/savings where switching category is meaningless.
   */
  lockedCategory?: "CRITICAL_ILLNESS" | "SAVINGS";
}

export default function ProductListWithSearch({ products, lockedCategory }: Props) {
  const tc = useTranslations("categories");
  const tCompanies = useTranslations("companies");
  const tCommon = useTranslations("common");
  const [filtered, setFiltered] = useState(products);
  const [categoryFilter, setCategoryFilter] = useState<string>(lockedCategory ?? "ALL");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");

  const displayed = useMemo(() => {
    return filtered.filter((p) => {
      if (categoryFilter !== "ALL" && p.category !== categoryFilter) return false;
      if (regionFilter !== "ALL" && p.rawRegion !== regionFilter) return false;
      return true;
    });
  }, [filtered, categoryFilter, regionFilter]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {!lockedCategory && (
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter("ALL")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                categoryFilter === "ALL" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tCommon("allCategories")}
            </button>
            <button
              onClick={() => setCategoryFilter("CRITICAL_ILLNESS")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                categoryFilter === "CRITICAL_ILLNESS" ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {tc("criticalIllness")}
            </button>
            <button
              onClick={() => setCategoryFilter("SAVINGS")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                categoryFilter === "SAVINGS" ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {tc("savings")}
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setRegionFilter("ALL")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              regionFilter === "ALL" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tCommon("allRegions")}
          </button>
          <button
            onClick={() => setRegionFilter("Hong Kong")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              regionFilter === "Hong Kong" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {tCompanies("hongKong")}
          </button>
          <button
            onClick={() => setRegionFilter("Mainland China")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              regionFilter === "Mainland China" ? "bg-orange-600 text-white" : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }`}
          >
            {tCompanies("mainlandChina")}
          </button>
        </div>
      </div>
      <InlineSearch items={products} onFilter={setFiltered} />
      {displayed.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{tCommon("noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((product) => {
            const card: ProductCardData = {
              slug: product.slug,
              displayName: product.displayName,
              category: product.category as "CRITICAL_ILLNESS" | "SAVINGS",
              region: product.region,
              companyDisplayName: product.company.displayName,
              companySlug: product.company.slug || product.company.displayName,
              companyLogoUrl: product.company.logoUrl ?? null,
              summary: product.summary ?? null,
              isHot: product.isHot,
              categoryLabel:
                product.category === "CRITICAL_ILLNESS" ? tc("criticalIllness") : tc("savings"),
            };
            return <ProductCard key={product.id} product={card} size="regular" />;
          })}
        </div>
      )}
    </>
  );
}
