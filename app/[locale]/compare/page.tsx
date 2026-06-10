import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { translateProduct, translateCompany, sortByTranslatedName } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import CompareListWithSearch from "@/components/CompareListWithSearch";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });
  return { title: t("title"), description: t("description") };
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ComparePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("compare");
  const tc = await getTranslations("categories");
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>

      <CompareListWithSearch comparisons={comparisons} />
    </div>
  );
}
