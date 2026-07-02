import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { translateProduct, translateCompany, sortByTranslatedName } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import CompareListWithSearch from "@/components/CompareListWithSearch";
import QuickCompareSelector, { type QuickCompareProduct } from "@/components/QuickCompareSelector";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const t = await getTranslations({ locale, namespace: "compare" });
  return buildMetadata({
    path: "/compare",
    locale: localeTyped,
    title: `${t("title")} - All Insurance Product Pairs`,
    description: `${t("description")} Browse Critical Illness and Savings insurance product comparisons across Hong Kong and Mainland China on Policy Vector.`,
    robots: { index: false, follow: true },
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ComparePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("compare");
  const tc = await getTranslations("categories");
  const tCommon = await getTranslations("common");
  const rawComparisons = await prisma.comparison.findMany({
    orderBy: { viewCount: "desc" },
    include: {
      productA: { include: { company: true } },
      productB: { include: { company: true } },
    },
  });

  const comparisons = rawComparisons.map((comp) => {
    const trA = translateProduct(comp.productA as Parameters<typeof translateProduct>[0], locale as Locale);
    const trB = translateProduct(comp.productB as Parameters<typeof translateProduct>[0], locale as Locale);
    return {
      ...comp,
      title: `${trA.displayName} vs ${trB.displayName}`,
      productA: { ...comp.productA, displayName: trA.displayName, company: { ...comp.productA.company, displayName: trA.company?.displayName || comp.productA.company.displayName } },
      productB: { ...comp.productB, displayName: trB.displayName, company: { ...comp.productB.company, displayName: trB.company?.displayName || comp.productB.company.displayName } },
    };
  }).sort(sortByTranslatedName(locale as Locale));

  // Build QuickCompare selector dataset from all distinct products that
  // appear in any comparison. Deduplicate by product id.
  const productMap = new Map<string, QuickCompareProduct>();
  for (const c of comparisons) {
    const a = c.productA as (typeof comparisons)[number]["productA"];
    const b = c.productB as (typeof comparisons)[number]["productB"];
    productMap.set(a.id, {
      slug: a.slug,
      displayName: a.displayName,
      companySlug: a.company?.slug || "",
      companyName: a.company?.displayName || "",
    });
    productMap.set(b.id, {
      slug: b.slug,
      displayName: b.displayName,
      companySlug: b.company?.slug || "",
      companyName: b.company?.displayName || "",
    });
  }
  const selectorProducts = Array.from(productMap.values());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-xs text-gray-400 pb-1">{tCommon("sortNote")}</p>
      </div>
      <p className="text-gray-600 mb-4">{t("description")}</p>

      <CompareListWithSearch comparisons={comparisons} selectorProducts={selectorProducts} />
    </div>
  );
}
