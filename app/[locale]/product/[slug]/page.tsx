import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Disclaimer from "@/components/Disclaimer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.displayName,
    description: product.summary ?? `Learn about ${product.displayName}.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      company: true,
      criticalIllnessDetail: true,
      savingsDetail: true,
    },
  });

  if (!product) notFound();

  const isCI = product.category === "CRITICAL_ILLNESS";

  const t = await getTranslations("products");
  const tci = await getTranslations("ciDetails");
  const ts = await getTranslations("savingsDetails");
  const tc = await getTranslations("categories");
  const tCommon = await getTranslations("common");

  // Parse JSON string fields
  const parseJson = (val: unknown): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") { try { return JSON.parse(val); } catch { return []; } }
    return [];
  };
  const tags = parseJson(product.tags);
  const supportedCurrencies = parseJson(product.supportedCurrencies);

  // Find related comparisons
  const comparisons = await prisma.comparison.findMany({
    where: {
      OR: [{ productAId: product.id }, { productBId: product.id }],
    },
    include: {
      productA: { include: { company: true } },
      productB: { include: { company: true } },
    },
    take: 6,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-blue-600">{t("title")}</Link>
        <span className="mx-2">/</span>
        <Link
          href={isCI ? "/products/critical-illness" : "/products/savings"}
          className="hover:text-blue-600"
        >
          {isCI ? tc("criticalIllness") : tc("savings")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.displayName}</span>
      </nav>

      {/* Product Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{product.displayName}</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            isCI ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {isCI ? tc("criticalIllness") : tc("savings")}
          </span>
        </div>
        <p className="text-gray-600">
          {tCommon("by")}{" "}
          <Link href={`/company/${product.company.slug}`} className="text-blue-600 hover:text-blue-700">
            {product.company.displayName}
          </Link>
          {" · "}{product.region}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("productSummary")}</h2>
        <p className="text-gray-600">{product.summary}</p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("company")}</h3>
          <p className="text-gray-900">{product.company.displayName}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("region")}</h3>
          <p className="text-gray-900">{product.region}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("currency")}</h3>
          <p className="text-gray-900">{product.currency}</p>
        </div>
        {supportedCurrencies.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">{t("supportedCurrencies")}</h3>
            <p className="text-gray-900">{supportedCurrencies.join(", ")}</p>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("productStatus")}</h3>
          <p className="text-gray-900 capitalize">{product.productStatus}</p>
        </div>
        {product.officialUrl && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">{t("officialPage")}</h3>
            <a href={product.officialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm">
              {t("visitOfficialPage")} &rarr;
            </a>
          </div>
        )}
        {product.brochureUrl && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">{t("productBrochure")}</h3>
            <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t("downloadBrochure")}
            </a>
          </div>
        )}
      </div>

      {/* CI Detail */}
      {isCI && product.criticalIllnessDetail && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{tci("title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              [tci("coverageTerm"), product.criticalIllnessDetail.coverageTerm],
              [tci("premiumTerm"), product.criticalIllnessDetail.premiumTerm],
              [tci("entryAge"), `${product.criticalIllnessDetail.entryAgeMin ?? tCommon("na")} - ${product.criticalIllnessDetail.entryAgeMax ?? tCommon("na")}`],
              [tci("waitingPeriod"), product.criticalIllnessDetail.waitingPeriodDays ? `${product.criticalIllnessDetail.waitingPeriodDays} ${tci("days")}` : tCommon("na")],
              [tci("majorIllnessCount"), product.criticalIllnessDetail.majorIllnessCount],
              [tci("minorIllnessCount"), product.criticalIllnessDetail.minorIllnessCount],
              [tci("majorIllnessPayout"), product.criticalIllnessDetail.majorIllnessPayout],
              [tci("minorIllnessPayout"), product.criticalIllnessDetail.minorIllnessPayout],
              [tci("multipleClaims"), product.criticalIllnessDetail.multipleClaims ? tCommon("yes") : tCommon("no")],
              [tci("cancerMultipleClaims"), product.criticalIllnessDetail.cancerMultipleClaims ? tCommon("yes") : tCommon("no")],
              [tci("heartStrokeMultipleClaims"), product.criticalIllnessDetail.heartStrokeMultipleClaims ? tCommon("yes") : tCommon("no")],
              [tci("deathBenefit"), product.criticalIllnessDetail.deathBenefit],
              [tci("premiumWaiver"), product.criticalIllnessDetail.premiumWaiver ? tCommon("yes") : tCommon("no")],
              [tci("cashValue"), product.criticalIllnessDetail.cashValue ? tCommon("yes") : tCommon("no")],
              [tci("participating"), product.criticalIllnessDetail.participating ? tCommon("yes") : tCommon("no")],
            ].map(([label, value]) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
                <p className="text-gray-900">{value ?? tCommon("na")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Savings Detail */}
      {!isCI && product.savingsDetail && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{ts("title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              [ts("premiumTerm"), product.savingsDetail.premiumTerm],
              [ts("coverageTerm"), product.savingsDetail.coverageTerm],
              [ts("entryAge"), `${product.savingsDetail.entryAgeMin ?? tCommon("na")} - ${product.savingsDetail.entryAgeMax ?? tCommon("na")}`],
              [ts("participating"), product.savingsDetail.participating ? tCommon("yes") : tCommon("no")],
              [ts("guaranteedCashValue"), product.savingsDetail.guaranteedCashValue ? tCommon("yes") : tCommon("no")],
              [ts("nonGuaranteedBonus"), product.savingsDetail.nonGuaranteedBonus ? tCommon("yes") : tCommon("no")],
              [ts("dividendType"), product.savingsDetail.dividendType],
              [ts("terminalBonus"), product.savingsDetail.terminalBonus ? tCommon("yes") : tCommon("no")],
              [ts("reversionaryBonus"), product.savingsDetail.reversionaryBonus ? tCommon("yes") : tCommon("no")],
              [ts("illustratedIrr"), product.savingsDetail.illustratedIrr ? `${product.savingsDetail.illustratedIrr}%` : tCommon("na")],
              [ts("guaranteedIrr"), product.savingsDetail.guaranteedIrr ? `${product.savingsDetail.guaranteedIrr}%` : tCommon("na")],
              [ts("illustratedBreakEvenYear"), product.savingsDetail.illustratedBreakEvenYear],
              [ts("guaranteedBreakEvenYear"), product.savingsDetail.guaranteedBreakEvenYear],
              [ts("policyLoan"), product.savingsDetail.policyLoan ? tCommon("yes") : tCommon("no")],
              [ts("changePolicyholder"), product.savingsDetail.changePolicyholder ? tCommon("yes") : tCommon("no")],
              [ts("changeInsured"), product.savingsDetail.changeInsured ? tCommon("yes") : tCommon("no")],
              [ts("educationPlanning"), product.savingsDetail.educationPlanning ? tCommon("yes") : tCommon("no")],
              [ts("retirementPlanning"), product.savingsDetail.retirementPlanning ? tCommon("yes") : tCommon("no")],
              [ts("legacyPlanning"), product.savingsDetail.legacyPlanning ? tCommon("yes") : tCommon("no")],
            ].map(([label, value]) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
                <p className="text-gray-900">{value ?? tCommon("na")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("tags")}</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Related Comparisons */}
      {comparisons.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("relatedComparisons")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisons.map((comp) => {
              const other = comp.productAId === product.id ? comp.productB : comp.productA;
              return (
                <Link
                  key={comp.id}
                  href={`/compare/${comp.slug}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {product.displayName} vs {other.displayName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{other.company.displayName}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <Disclaimer />
    </div>
  );
}
