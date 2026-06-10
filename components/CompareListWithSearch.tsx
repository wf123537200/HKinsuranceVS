"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import InlineSearch from "./InlineSearch";

interface Comparison {
  id: string;
  slug: string;
  title: string;
  productA: { displayName: string; company: { displayName: string } };
  productB: { displayName: string; company: { displayName: string } };
}

interface Props {
  comparisons: Comparison[];
}

export default function CompareListWithSearch({ comparisons }: Props) {
  const tc = useTranslations("common");
  const [filtered, setFiltered] = useState(comparisons);

  // Adapt comparisons to work with InlineSearch
  const searchableItems = comparisons.map((c) => ({
    id: c.id,
    displayName: c.title,
    company: { displayName: `${c.productA.company.displayName} vs ${c.productB.company.displayName}` },
    region: "",
    summary: `${c.productA.displayName} vs ${c.productB.displayName}`,
  }));

  const handleFilter = (items: typeof searchableItems) => {
    const ids = new Set(items.map((i) => i.id));
    setFiltered(comparisons.filter((c) => ids.has(c.id)));
  };

  return (
    <>
      <InlineSearch items={searchableItems} onFilter={handleFilter} />
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No comparisons found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => (
            <Link
              key={comp.id}
              href={`/compare/${comp.slug}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{comp.title}</h3>
              <p className="text-xs text-gray-500">{comp.productA.displayName} {tc("vs")} {comp.productB.displayName}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
