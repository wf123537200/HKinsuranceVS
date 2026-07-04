"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export type QuickCompareCategory = "critical_illness" | "savings";

export interface QuickCompareProduct {
  slug: string;
  displayName: string;
  companySlug: string;
  companyName: string;
  category: QuickCompareCategory;
}

interface Props {
  /** Products available in the left dropdown. */
  leftProducts: QuickCompareProduct[];
  /** Products available in the right dropdown. */
  rightProducts: QuickCompareProduct[];
  /** Optional base path prefix (default "/compare"). */
  basePath?: string;
}

const LOCALE = "VS";

export default function QuickCompareSelector({
  leftProducts,
  rightProducts,
  basePath = "/compare",
}: Props) {
  const router = useRouter();
  const [leftCompany, setLeftCompany] = useState("");
  const [leftProduct, setLeftProduct] = useState("");
  const [rightCompany, setRightCompany] = useState("");
  const [rightProduct, setRightProduct] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Build a deduplicated list of companies that have at least one product
  function companiesOf(list: QuickCompareProduct[]) {
    const map = new Map<string, string>();
    for (const p of list) {
      if (!map.has(p.companySlug)) map.set(p.companySlug, p.companyName);
    }
    return Array.from(map.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "zh"));
  }

  const leftCompanies = useMemo(() => companiesOf(leftProducts), [leftProducts]);
  const rightCompanies = useMemo(() => companiesOf(rightProducts), [rightProducts]);

  function productsFor(
    list: QuickCompareProduct[],
    companySlug: string
  ): QuickCompareProduct[] {
    return list
      .filter((p) => p.companySlug === companySlug)
      .sort((a, b) => a.displayName.localeCompare(b.displayName, "zh"));
  }

  const leftOptions = useMemo(() => {
    const lockedCat = lockedCategoryFor("left");
    return productsFor(leftProducts, leftCompany).filter(
      (p) => !lockedCat || p.category === lockedCat
    );
  }, [leftProducts, leftCompany, rightProduct]);
  const rightOptions = useMemo(() => {
    const lockedCat = lockedCategoryFor("right");
    return productsFor(rightProducts, rightCompany).filter(
      (p) => !lockedCat || p.category === lockedCat
    );
  }, [rightProducts, rightCompany, leftProduct]);

  // Hide products from the opposite category rather than confusingly listing
  // them. The placeholder note explains the lock-in.
  const leftLockHint =
    lockedCategoryFor("left") === "savings" ? "（已限定：储蓄险）" : lockedCategoryFor("left") === "critical_illness" ? "（已限定：重疾险）" : "";
  const rightLockHint =
    lockedCategoryFor("right") === "savings" ? "（已限定：储蓄险）" : lockedCategoryFor("right") === "critical_illness" ? "（已限定：重疾险）" : "";

  // Reset dependent state when company changes
  function onLeftCompanyChange(v: string) {
    setLeftCompany(v);
    setLeftProduct("");
    // When the user changes the left company, if a right product was
    // already chosen and its category no longer fits, drop it.
    if (
      rightProduct &&
      productBySlug(rightProduct)?.category !==
        productBySlug(leftProduct)?.category
    ) {
      // Keep the rule: both sides must match. We'll detect category below
      // when the user picks a product; for now, just clear the error.
    }
    setError(null);
  }
  function onRightCompanyChange(v: string) {
    setRightCompany(v);
    setRightProduct("");
    setError(null);
  }

  // Find product metadata by slug from the union list. Used to lock the
  // opposite side's category once a product is picked.
  function productBySlug(slug: string): QuickCompareProduct | undefined {
    return [...leftProducts, ...rightProducts].find(
      (p) => p.slug === slug && p.companySlug === (slug === leftProduct ? leftCompany : rightCompany)
    )
      ?? [...leftProducts, ...rightProducts].find((p) => p.slug === slug);
  }

  // Returns the locked category (if any) for a given side, derived from the
  // product already chosen on the opposite side.
  function lockedCategoryFor(side: "left" | "right"): QuickCompareCategory | undefined {
    const otherSlug = side === "left" ? rightProduct : leftProduct;
    if (!otherSlug) return undefined;
    return productBySlug(otherSlug)?.category;
  }

  function onLeftProductChange(v: string) {
    setLeftProduct(v);
    // If the right side already picked a product but it now disagrees with
    // the left category, drop it so the user can pick a matching one.
    const leftCat = productBySlug(v)?.category;
    if (leftCat && rightProduct) {
      const rightCat = productBySlug(rightProduct)?.category;
      if (rightCat && rightCat !== leftCat) {
        setRightProduct("");
      }
    }
    setError(null);
  }
  function onRightProductChange(v: string) {
    setRightProduct(v);
    const rightCat = productBySlug(v)?.category;
    if (rightCat && leftProduct) {
      const leftCat = productBySlug(leftProduct)?.category;
      if (leftCat && leftCat !== rightCat) {
        setLeftProduct("");
      }
    }
    setError(null);
  }

  function swap() {
    const oldL = leftCompany;
    const oldLP = leftProduct;
    setLeftCompany(rightCompany);
    setLeftProduct(rightProduct);
    setRightCompany(oldL);
    setRightProduct(oldLP);
  }

  function go() {
    if (!leftProduct || !rightProduct) {
      setError("请同时选择两个产品");
      return;
    }
    if (leftProduct === rightProduct) {
      setError("请选择不同的两个产品");
      return;
    }
    const leftCat = productBySlug(leftProduct)?.category;
    const rightCat = productBySlug(rightProduct)?.category;
    if (leftCat && rightCat && leftCat !== rightCat) {
      setError("请选择同类型（重疾险 vs 重疾险，或 储蓄险 vs 储蓄险）的产品");
      return;
    }
    router.push(`${basePath}/${leftProduct}-vs-${rightProduct}`);
  }

  return (
    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
      <p className="text-xs text-gray-500 mb-3">快速对比：先选公司，再选产品</p>

      <div className="flex flex-col md:flex-row md:items-end gap-3">
        {/* Left side: company + product */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
          <select
            aria-label="左侧公司"
            value={leftCompany}
            onChange={(e) => onLeftCompanyChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">选择公司</option>
            {leftCompanies.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            aria-label="左侧产品"
            value={leftProduct}
            onChange={(e) => onLeftProductChange(e.target.value)}
            disabled={!leftCompany}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">
              {leftCompany
                ? leftLockHint
                  ? `选择产品 ${leftLockHint}`
                  : "选择产品"
                : "请先选择公司"}
            </option>
            {leftOptions.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-end gap-1 px-2 pb-2">
          <span className="text-sm font-bold text-gray-500">{LOCALE}</span>
          <button
            type="button"
            onClick={swap}
            disabled={!leftCompany && !rightCompany}
            className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-300"
            title="交换两侧选择"
          >
            ⇄ 交换
          </button>
        </div>

        {/* Right side: company + product */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
          <select
            aria-label="右侧公司"
            value={rightCompany}
            onChange={(e) => onRightCompanyChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">选择公司</option>
            {rightCompanies.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            aria-label="右侧产品"
            value={rightProduct}
            onChange={(e) => onRightProductChange(e.target.value)}
            disabled={!rightCompany}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">
              {rightCompany
                ? rightLockHint
                  ? `选择产品 ${rightLockHint}`
                  : "选择产品"
                : "请先选择公司"}
            </option>
            {rightOptions.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={go}
          disabled={!leftProduct || !rightProduct}
          className="md:ml-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          开始对比
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
