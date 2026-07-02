"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import HotBadge from "./HotBadge";

interface Product {
  id: string;
  slug: string;
  displayName: string;
  category: string;
  region: string;
  summary?: string | null;
  tags: string[];
  /** When true, the product is in the V1 curated "selected" set and gets a flame badge. */
  isSelected?: boolean;
}

interface Props {
  products: Product[];
  tagTranslations: Record<string, string>;
}

export default function CompanyProductFilter({ products, tagTranslations }: Props) {
  const tc = useTranslations("categories");
  const tCommon = useTranslations("common");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const displayed = useMemo(() => {
    if (categoryFilter === "ALL") return products;
    return products.filter((p) => p.category === categoryFilter);
  }, [products, categoryFilter]);

  const parseTags = (tags: unknown): string[] => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") {
      try { return JSON.parse(tags); } catch { return []; }
    }
    return [];
  };

  return (
    <>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setCategoryFilter("ALL")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            categoryFilter === "ALL" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tCommon("all")}
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

      {displayed.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{tCommon("noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-1 gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  {product.isSelected && <HotBadge size="sm" />}
                  <h3 className="font-semibold text-gray-900">{product.displayName}</h3>
                </div>
                <span className={`shrink-0 ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                  product.category === "CRITICAL_ILLNESS" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>
                  {product.category === "CRITICAL_ILLNESS" ? tc("criticalIllness") : tc("savings")}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.summary}</p>
              <div className="flex flex-wrap gap-1">
                {parseTags(product.tags).slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    {tagTranslations[tag] || tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
