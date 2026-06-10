"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import InlineSearch from "./InlineSearch";

interface Product {
  id: string;
  slug: string;
  displayName: string;
  category: string;
  region: string;
  summary?: string | null;
  company: { displayName: string };
}

interface Props {
  products: Product[];
}

export default function ProductListWithSearch({ products }: Props) {
  const tc = useTranslations("categories");
  const [filtered, setFiltered] = useState(products);

  return (
    <>
      <InlineSearch items={products} onFilter={setFiltered} />
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  product.category === "CRITICAL_ILLNESS" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>
                  {product.category === "CRITICAL_ILLNESS" ? tc("criticalIllness") : tc("savings")}
                </span>
                <span className="text-xs text-gray-400">{product.region}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{product.displayName}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.company.displayName}</p>
              <p className="text-sm text-gray-400 line-clamp-2">{product.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
