import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import {
  getProductVectorsByCategory,
} from "@/lib/product-vector-registry";
import { getProductName, getCompanyName, pickBaseName } from "@/lib/vector-i18n";
import QuickCompareSelector, { type QuickCompareProduct } from "@/components/QuickCompareSelector";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const t = await getTranslations({ locale, namespace: "compare" });
  return buildMetadata({
    path: "/compare/critical-illness",
    locale: localeTyped,
    title: `${t("title")} - Critical Illness Insurance Pairs`,
    description: `${t("description")} Browse Critical Illness insurance product comparisons by company, region, currency, premium term, and multiple-claim coverage on Policy Vector.`,
    robots: { index: false, follow: true },
  });
}

export default async function CompareCriticalIllnessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("compare");
  const tc = await getTranslations("categories");
  const tCommon = await getTranslations("common");
  const localeTyped = locale as Locale;

  const vectors = await getProductVectorsByCategory("critical_illness");
  const pairs: Array<{ a: typeof vectors[number]; b: typeof vectors[number] }> = [];
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      pairs.push({ a: vectors[i], b: vectors[j] });
    }
  }

  const selectorProducts: QuickCompareProduct[] = vectors.map((v) => ({
    slug: v.base.slug,
    displayName: getProductName(v.base.slug, localeTyped, pickBaseName(v.base, localeTyped)),
    companySlug: v.base.company_slug,
    companyName: getCompanyName(v.base.company_slug, localeTyped, v.base.company_name),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/compare" className="hover:text-blue-600">{t("title")}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{tc("criticalIllness")}</span>
      </nav>
      <div className="flex items-end gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{"健康险对比"}</h1>
        <p className="text-xs text-gray-400 pb-1">{`共 ${vectors.length} 款健康险 · ${pairs.length} 组对比`}</p>
      </div>
      <p className="text-gray-600 mb-6">{"基于官方 PDF 抽取的结构化字段对比。"}</p>

      <QuickCompareSelector leftProducts={selectorProducts} rightProducts={selectorProducts} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pairs.slice(0, 60).map((p, i) => {
          const aName = getProductName(p.a.base.slug, localeTyped, pickBaseName(p.a.base, localeTyped));
          const bName = getProductName(p.b.base.slug, localeTyped, pickBaseName(p.b.base, localeTyped));
          const aCo = getCompanyName(p.a.base.company_slug, localeTyped, p.a.base.company_name);
          const bCo = getCompanyName(p.b.base.company_slug, localeTyped, p.b.base.company_name);
          return (
            <Link
              key={i}
              href={`/compare/${p.a.base.slug}-vs-${p.b.base.slug}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <p className="text-sm font-semibold text-gray-900">
                {aName} <span className="text-gray-400">{tCommon("vs") || "vs"}</span> {bName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {aCo} <span className="text-gray-300">·</span> {bCo}
              </p>
            </Link>
          );
        })}
      </div>
      {pairs.length > 60 && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          {`显示前 60 组对比，共 ${pairs.length} 组`}
        </p>
      )}
    </div>
  );
}
