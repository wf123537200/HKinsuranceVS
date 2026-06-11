"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilter: (filtered: any[]) => void;
}

export default function InlineSearch({ items, onFilter }: Props) {
  const t = useTranslations("common");
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      onFilter(items);
      return;
    }
    const q = value.toLowerCase();
    const filtered = items.filter((item) => {
      const name = (item.displayName || "").toLowerCase();
      const company = (item.company?.displayName || "").toLowerCase();
      const region = (item.region || "").toLowerCase();
      const summary = (item.summary || "").toLowerCase();
      return name.includes(q) || company.includes(q) || region.includes(q) || summary.includes(q);
    });
    onFilter(filtered);
  };

  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {query && (
        <button onClick={() => handleChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">✕</button>
      )}
    </div>
  );
}
