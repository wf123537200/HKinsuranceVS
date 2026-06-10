"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CompareRow {
  label: string;
  valA: string | number | null | undefined;
  valB: string | number | null | undefined;
  isEstimated?: boolean;
}

export default function CompareTable({
  rows,
  productAName,
  productBName,
}: {
  rows: CompareRow[];
  productAName: string;
  productBName: string;
}) {
  const t = useTranslations("compare");
  const tc = useTranslations("common");
  const [hideSame, setHideSame] = useState(false);

  const parseNum = (val: string | number | null | undefined): number | null => {
    if (val === null || val === undefined) return null;
    const s = String(val).replace(/[%,]/g, "");
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  };

  const filtered = hideSame
    ? rows.filter((r) => {
        const a = String(r.valA ?? "");
        const b = String(r.valB ?? "");
        return a !== b;
      })
    : rows;

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setHideSame(!hideSame)}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          {hideSame ? t("showAll") : t("hideSame")}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 text-sm font-medium text-gray-500 w-1/3">{t("feature")}</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900 w-1/3">{productAName}</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900 w-1/3">{productBName}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => {
              const numA = parseNum(row.valA);
              const numB = parseNum(row.valB);
              const bothNumbers = numA !== null && numB !== null;
              const aIsBigger = bothNumbers && numA > numB;
              const bIsBigger = bothNumbers && numB > numA;

              return (
                <tr key={`${row.label}-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-4 text-sm text-gray-500 font-medium">{row.label}</td>
                  <td className={`p-4 text-sm font-medium ${row.isEstimated ? "bg-red-50 text-red-700" : aIsBigger ? "bg-green-50 text-green-700" : "text-gray-900"}`}>
                    {row.valA ?? tc("na")}
                    {row.isEstimated && <span className="ml-1 text-xs text-red-400">⚠</span>}
                  </td>
                  <td className={`p-4 text-sm font-medium ${row.isEstimated ? "bg-red-50 text-red-700" : bIsBigger ? "bg-green-50 text-green-700" : "text-gray-900"}`}>
                    {row.valB ?? tc("na")}
                    {row.isEstimated && <span className="ml-1 text-xs text-red-400">⚠</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
