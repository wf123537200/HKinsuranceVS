import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <span className="mx-2">/</span>
        <Link
          href={isCI ? "/products/critical-illness" : "/products/savings"}
          className="hover:text-blue-600"
        >
          {isCI ? "Critical Illness" : "Savings"}
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
            {isCI ? "Critical Illness" : "Savings"}
          </span>
        </div>
        <p className="text-gray-600">
          by{" "}
          <Link href={`/company/${product.company.slug}`} className="text-blue-600 hover:text-blue-700">
            {product.company.displayName}
          </Link>
          {" · "}{product.region}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Summary</h2>
        <p className="text-gray-600">{product.summary}</p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Company</h3>
          <p className="text-gray-900">{product.company.displayName}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Region</h3>
          <p className="text-gray-900">{product.region}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Currency</h3>
          <p className="text-gray-900">{product.currency}</p>
        </div>
        {supportedCurrencies.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Supported Currencies</h3>
            <p className="text-gray-900">{supportedCurrencies.join(", ")}</p>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Product Status</h3>
          <p className="text-gray-900 capitalize">{product.productStatus}</p>
        </div>
        {product.officialUrl && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Official Page</h3>
            <a href={product.officialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm">
              Visit Official Page &rarr;
            </a>
          </div>
        )}
        {product.brochureUrl && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Product Brochure</h3>
            <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Brochure
            </a>
          </div>
        )}
      </div>

      {/* CI Detail */}
      {isCI && product.criticalIllnessDetail && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Critical Illness Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["Coverage Term", product.criticalIllnessDetail.coverageTerm],
              ["Premium Term", product.criticalIllnessDetail.premiumTerm],
              ["Entry Age", `${product.criticalIllnessDetail.entryAgeMin ?? "N/A"} - ${product.criticalIllnessDetail.entryAgeMax ?? "N/A"}`],
              ["Waiting Period", product.criticalIllnessDetail.waitingPeriodDays ? `${product.criticalIllnessDetail.waitingPeriodDays} days` : "N/A"],
              ["Major Illness Count", product.criticalIllnessDetail.majorIllnessCount],
              ["Minor Illness Count", product.criticalIllnessDetail.minorIllnessCount],
              ["Major Illness Payout", product.criticalIllnessDetail.majorIllnessPayout],
              ["Minor Illness Payout", product.criticalIllnessDetail.minorIllnessPayout],
              ["Multiple Claims", product.criticalIllnessDetail.multipleClaims ? "Yes" : "No"],
              ["Cancer Multiple Claims", product.criticalIllnessDetail.cancerMultipleClaims ? "Yes" : "No"],
              ["Heart/Stroke Multiple Claims", product.criticalIllnessDetail.heartStrokeMultipleClaims ? "Yes" : "No"],
              ["Death Benefit", product.criticalIllnessDetail.deathBenefit],
              ["Premium Waiver", product.criticalIllnessDetail.premiumWaiver ? "Yes" : "No"],
              ["Cash Value", product.criticalIllnessDetail.cashValue ? "Yes" : "No"],
              ["Participating", product.criticalIllnessDetail.participating ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
                <p className="text-gray-900">{value ?? "N/A"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Savings Detail */}
      {!isCI && product.savingsDetail && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Savings Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["Premium Term", product.savingsDetail.premiumTerm],
              ["Coverage Term", product.savingsDetail.coverageTerm],
              ["Entry Age", `${product.savingsDetail.entryAgeMin ?? "N/A"} - ${product.savingsDetail.entryAgeMax ?? "N/A"}`],
              ["Participating", product.savingsDetail.participating ? "Yes" : "No"],
              ["Guaranteed Cash Value", product.savingsDetail.guaranteedCashValue ? "Yes" : "No"],
              ["Non-Guaranteed Bonus", product.savingsDetail.nonGuaranteedBonus ? "Yes" : "No"],
              ["Dividend Type", product.savingsDetail.dividendType],
              ["Terminal Bonus", product.savingsDetail.terminalBonus ? "Yes" : "No"],
              ["Reversionary Bonus", product.savingsDetail.reversionaryBonus ? "Yes" : "No"],
              ["Illustrated IRR", product.savingsDetail.illustratedIrr ? `${product.savingsDetail.illustratedIrr}%` : "N/A"],
              ["Guaranteed IRR", product.savingsDetail.guaranteedIrr ? `${product.savingsDetail.guaranteedIrr}%` : "N/A"],
              ["Illustrated Break-even Year", product.savingsDetail.illustratedBreakEvenYear],
              ["Guaranteed Break-even Year", product.savingsDetail.guaranteedBreakEvenYear],
              ["Policy Loan", product.savingsDetail.policyLoan ? "Yes" : "No"],
              ["Change Policyholder", product.savingsDetail.changePolicyholder ? "Yes" : "No"],
              ["Change Insured", product.savingsDetail.changeInsured ? "Yes" : "No"],
              ["Education Planning", product.savingsDetail.educationPlanning ? "Yes" : "No"],
              ["Retirement Planning", product.savingsDetail.retirementPlanning ? "Yes" : "No"],
              ["Legacy Planning", product.savingsDetail.legacyPlanning ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
                <p className="text-gray-900">{value ?? "N/A"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tags</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Comparisons</h2>
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
