import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import CompareTable from "@/components/CompareTable";
import { translateProduct, translateRegion } from "@/lib/translations";
import type { Locale } from "@/i18n/config";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const comparison = await prisma.comparison.findUnique({ where: { slug }, include: { productA: true, productB: true } });
  if (!comparison) return {};
  const trProductA = translateProduct(comparison.productA as Parameters<typeof translateProduct>[0], locale as Locale);
  const trProductB = translateProduct(comparison.productB as Parameters<typeof translateProduct>[0], locale as Locale);
  return { title: `${trProductA.displayName} vs ${trProductB.displayName}` };
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations("compare");
  const tc = await getTranslations("common");

  const comparison = await prisma.comparison.findUnique({
    where: { slug },
    include: {
      productA: { include: { company: true, criticalIllnessDetail: true, savingsDetail: true } },
      productB: { include: { company: true, criticalIllnessDetail: true, savingsDetail: true } },
    },
  });

  if (!comparison) notFound();

  const productA = translateProduct(comparison.productA as Parameters<typeof translateProduct>[0], locale as Locale);
  const productB = translateProduct(comparison.productB as Parameters<typeof translateProduct>[0], locale as Locale);
  const isCI = productA.category === "CRITICAL_ILLNESS";

  const basicRows: [string, string | number | null | undefined, string | number | null | undefined, boolean?][] = [
    [t("productType"), isCI ? tc("yes") : tc("no"), isCI ? tc("yes") : tc("no")],
    [t("feature") + ": " + tc("from"), productA.company.displayName, productB.company.displayName],
    ["Region", translateRegion(productA.region, locale as Locale), translateRegion(productB.region, locale as Locale)],
    ["Currency", productA.currency, productB.currency],
  ];

  // Mark estimated data with isEstimated flag
  if (isCI) {
    const a = productA.criticalIllnessDetail;
    const b = productB.criticalIllnessDetail;
    basicRows.push(
      ["Coverage Term", a?.coverageTerm, b?.coverageTerm],
      ["Premium Term", a?.premiumTerm, b?.premiumTerm],
      ["Entry Age", `${a?.entryAgeMin ?? "?"}-${a?.entryAgeMax ?? "?"}`, `${b?.entryAgeMin ?? "?"}-${b?.entryAgeMax ?? "?"}`],
      ["Waiting Period", a?.waitingPeriodDays ? `${a.waitingPeriodDays} days` : null, b?.waitingPeriodDays ? `${b.waitingPeriodDays} days` : null],
      ["Major Illness Count", a?.majorIllnessCount, b?.majorIllnessCount, true],
      ["Minor Illness Count", a?.minorIllnessCount, b?.minorIllnessCount, true],
      ["Cancer Multiple Claims", a?.cancerMultipleClaims ? "Yes" : "No", b?.cancerMultipleClaims ? "Yes" : "No"],
      ["Premium Waiver", a?.premiumWaiver ? "Yes" : "No", b?.premiumWaiver ? "Yes" : "No"],
      ["Cash Value", a?.cashValue ? "Yes" : "No", b?.cashValue ? "Yes" : "No"],
    );
  } else {
    const a = productA.savingsDetail;
    const b = productB.savingsDetail;
    basicRows.push(
      ["Premium Term", a?.premiumTerm, b?.premiumTerm],
      ["Coverage Term", a?.coverageTerm, b?.coverageTerm],
      ["Participating", a?.participating ? "Yes" : "No", b?.participating ? "Yes" : "No"],
      ["Illustrated IRR", a?.illustratedIrr ? `${a.illustratedIrr}%` : null, b?.illustratedIrr ? `${b.illustratedIrr}%` : null, true],
      ["Guaranteed IRR", a?.guaranteedIrr ? `${a.guaranteedIrr}%` : null, b?.guaranteedIrr ? `${b.guaranteedIrr}%` : null, true],
      ["Break-even Year", a?.illustratedBreakEvenYear, b?.illustratedBreakEvenYear, true],
      ["Terminal Bonus", a?.terminalBonus ? "Yes" : "No", b?.terminalBonus ? "Yes" : "No"],
      ["Policy Loan", a?.policyLoan ? "Yes" : "No", b?.policyLoan ? "Yes" : "No"],
      ["Legacy Planning", a?.legacyPlanning ? "Yes" : "No", b?.legacyPlanning ? "Yes" : "No"],
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/compare" className="hover:text-blue-600">{t("title")}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{productA.displayName} vs {productB.displayName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{productA.displayName} vs {productB.displayName}</h1>
        <p className="text-gray-600">{comparison.basicSummary}</p>
        <p className="text-xs text-gray-400 mt-2">
          <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></span>{t("dataSource")}
          <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 rounded mr-1 ml-4"></span>{t("estimatedData")}
        </p>
      </div>

      <CompareTable rows={basicRows.map(([label, valA, valB, isEstimated]) => ({ label, valA, valB, isEstimated }))} productAName={productA.displayName} productBName={productB.displayName} />

      {/* AI Comparison */}
      <section className="mt-8 mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t("aiDeepComparison")}</h2>
        <p className="text-sm text-gray-600 mb-4">{t("aiDescription")} {t("usesQuota")}</p>
        {comparison.aiSummary ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{t("summary")}</h3>
              <p className="text-gray-700">{comparison.aiSummary}</p>
            </div>
            {comparison.aiKeyDifferences && (
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{t("keyDifferences")}</h3>
                <p className="text-gray-700">{comparison.aiKeyDifferences}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">{t("generating")}</p>
        )}
      </section>
    </div>
  );
}
