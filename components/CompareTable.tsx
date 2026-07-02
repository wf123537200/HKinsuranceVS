"use client";

import { useState, useMemo } from "react";
import ClientPdfGate from "./ClientPdfGate";

export type CompareRowClient = {
  section: string;
  label: string;
  aValue: string;
  bValue: string;
  aRaw: unknown;
  bRaw: unknown;
  /** The original (untruncated) text, when a/b was truncated. */
  aFull?: string;
  bFull?: string;
  /** v2.11 advantage model. null = no badge. */
  advantage:
    | "left_better"
    | "right_better"
    | "left_has_data"
    | "right_has_data"
    | "same"
    | "a"
    | "b"
    | "none"
    | null;
  /** Badge text ("优势") or null. */
  aAdvantageLabel: string | null;
  bAdvantageLabel: string | null;
  /** Tooltip explaining why this side has the advantage. */
  advantageTooltip: string | null;
};

export type DisplayFeatureClient = {
  title: string;
  summary: string;
};

interface Props {
  rows: CompareRowClient[];
  displayA: DisplayFeatureClient[];
  displayB: DisplayFeatureClient[];
  productAName: string;
  productBName: string;
  pdfA?: string | null;
  pdfB?: string | null;
  /** Slug for product A — used by ClientPdfGate to look up the PDF. */
  pdfProductIdA?: string | null;
  /** Slug for product B — used by ClientPdfGate to look up the PDF. */
  pdfProductIdB?: string | null;
  /** Label for authenticated users (e.g. "查看官方 PDF"). */
  viewPdfLabel: string;
  /** Label for guests (e.g. "登录后查看官方产品 PDF"). */
  lockedPdfLabel: string;
  /** Category translated label (e.g. "重疾险" / "储蓄险"). */
  categoryLabel: string;
}

const SECTION_ORDER: string[] = [
  "基础信息",
  "疾病覆盖",
  "首次赔付",
  "多次赔付",
  "保费豁免",
  "现金价值/分红",
  "收益演示",
  "流动性",
  "传承功能",
  "人寿保障",
  "医疗支援",
  "其他",
];

export default function CompareTable({
  rows,
  displayA,
  displayB,
  productAName,
  productBName,
  pdfA,
  pdfB,
  pdfProductIdA,
  pdfProductIdB,
  viewPdfLabel,
  lockedPdfLabel,
  categoryLabel,
}: Props) {
  const [hideSame, setHideSame] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const m = new Map<string, CompareRowClient[]>();
    for (const r of rows) {
      if (hideSame && r.aValue === r.bValue && r.aValue !== "暂无数据") continue;
      if (!m.has(r.section)) m.set(r.section, []);
      m.get(r.section)!.push(r);
    }
    return m;
  }, [rows, hideSame]);

  // Order sections per SECTION_ORDER, then any unknowns at the end
  const orderedSections = useMemo(() => {
    const known = SECTION_ORDER.filter((s) => grouped.has(s));
    const rest = Array.from(grouped.keys()).filter((s) => !SECTION_ORDER.includes(s));
    return [...known, ...rest];
  }, [grouped]);

  function toggleExpand(key: string) {
    setExpanded((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <>
      {/* 控制条 */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-xs text-gray-500">
          共 {rows.length} 行 · {grouped.size} 个分组
        </p>
        <button
          type="button"
          onClick={() => setHideSame((v) => !v)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            hideSame
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
          }`}
        >
          {hideSame ? "显示相同项" : "隐藏相同项"}
        </button>
      </div>

      {/* 主对比表 */}
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">暂无对比数据</p>
      ) : (
        <div className="space-y-8">
          {orderedSections.map((section) => {
            const sectionRows = grouped.get(section)!;
            if (sectionRows.length === 0) return null;
            return (
              <div key={section}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{section}</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-1/3">字段</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-1/3">
                          {productAName}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-1/3">
                          {productBName}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sectionRows.map((row, i) => {
                        const rowKey = section + "-" + i;
                        const isSame = row.aValue === row.bValue;
                        const hasAdvantage =
                          row.advantage === "left_better" ||
                          row.advantage === "right_better" ||
                          row.advantage === "left_has_data" ||
                          row.advantage === "right_has_data";
                        return (
                          <tr
                            key={rowKey}
                            className={hasAdvantage ? "bg-green-50" : ""}
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-700 align-top">
                              {row.label}
                              {isSame && (
                                <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-500">
                                  相同
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 align-top">
                              <span>
                                {expanded[rowKey + "-a"] && row.aFull
                                  ? row.aFull
                                  : row.aValue}
                              </span>
                              {row.aAdvantageLabel && (
                                <span
                                  title={row.advantageTooltip || undefined}
                                  className="ml-2 inline-block px-1.5 py-0.5 text-xs font-medium rounded bg-green-200 text-green-800"
                                >
                                  {row.aAdvantageLabel}
                                </span>
                              )}
                              {row.aFull && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(rowKey + "-a")}
                                  className="ml-2 text-xs text-blue-600 hover:text-blue-700 underline"
                                >
                                  {expanded[rowKey + "-a"] ? "收起" : "展开"}
                                </button>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 align-top">
                              <span>
                                {expanded[rowKey + "-b"] && row.bFull
                                  ? row.bFull
                                  : row.bValue}
                              </span>
                              {row.bAdvantageLabel && (
                                <span
                                  title={row.advantageTooltip || undefined}
                                  className="ml-2 inline-block px-1.5 py-0.5 text-xs font-medium rounded bg-green-200 text-green-800"
                                >
                                  {row.bAdvantageLabel}
                                </span>
                              )}
                              {row.bFull && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(rowKey + "-b")}
                                  className="ml-2 text-xs text-blue-600 hover:text-blue-700 underline"
                                >
                                  {expanded[rowKey + "-b"] ? "收起" : "展开"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 产品特色对比：只读 display_features */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">产品特色对比</h2>
        <p className="text-xs text-gray-500 mb-4">摘要补充 · 来自产品结构化特征</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[displayA, displayB].map((features, idx) => {
            const product = idx === 0 ? productAName : productBName;
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{product}</h3>
                {features.length === 0 ? (
                  <p className="text-sm text-gray-500">暂无产品特色摘要</p>
                ) : (
                  <ul className="space-y-2">
                    {features.map((f, j) => (
                      <li key={j} className="text-sm">
                        <span className="font-medium text-gray-900">{f.title}</span>
                        {f.summary && (
                          <span className="text-gray-600"> · {f.summary}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PDF 来源 — gated by Supabase auth via ClientPdfGate */}
      <section className="mt-8 flex flex-wrap gap-3 text-sm">
        {pdfA && pdfProductIdA && (
          <ClientPdfGate
            productId={pdfProductIdA}
            localPdfPath={pdfA}
            viewPdfLabel={`${productAName} · ${viewPdfLabel}`}
            lockedLabel={`${productAName} · ${lockedPdfLabel}`}
          />
        )}
        {pdfB && pdfProductIdB && (
          <ClientPdfGate
            productId={pdfProductIdB}
            localPdfPath={pdfB}
            viewPdfLabel={`${productBName} · ${viewPdfLabel}`}
            lockedLabel={`${productBName} · ${lockedPdfLabel}`}
          />
        )}
      </section>

      <p className="mt-8 text-xs text-gray-400 text-center">{categoryLabel} · 共 {rows.length} 个对比字段</p>
    </>
  );
}
