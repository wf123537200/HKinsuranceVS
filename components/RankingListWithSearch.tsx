"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import InlineSearch from "./InlineSearch";

interface Product {
  id: string;
  slug: string;
  displayName: string;
  region: string;
  company: { displayName: string };
  viewCount?: number;
  compareCount?: number;
}

interface Props {
  products: Product[];
  countField: "viewCount" | "compareCount";
  countLabel: string;
}

export default function RankingListWithSearch({ products, countField, countLabel }: Props) {
  const [filtered, setFiltered] = useState(products);

  return (
    <>
      <InlineSearch items={products} onFilter={setFiltered} />
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products found.</p>
        ) : (
          filtered.map((product, idx) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
            >
              <span className="text-2xl font-bold text-gray-300 w-8">{idx + 1}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{product.displayName}</h3>
                <p className="text-xs text-gray-500">{product.company.displayName} · {product.region}</p>
              </div>
              <span className="text-sm text-gray-400">{(product as any)[countField] || 0} {countLabel}</span>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
