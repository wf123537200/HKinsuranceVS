import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Disclaimer from "@/components/Disclaimer";
import CompareAIButton from "@/components/CompareAIButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await prisma.comparison.findUnique({
    where: { slug },
    include: {
      productA: true,
      productB: true,
    },
  });
  if (!comparison) return {};
  return {
    title: `${comparison.productA.displayName} vs ${comparison.productB.displayName}`,
    description: `Compare ${comparison.productA.displayName} and ${comparison.productB.displayName} across company, region, currency, premium term, coverage term, key features, and official product sources.`,
  };
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params;
  const comparison = await prisma.comparison.findUnique({
    where: { slug },
    include: {
      productA: {
        include: { company: true, criticalIllnessDetail: true, savingsDetail: true },
      },
      productB: {
        include: { company: true, criticalIllnessDetail: true, savingsDetail: true },
      },
    },
  });

  if (!comparison) notFound();

  const { productA, productB } = comparison;
  const isCI = productA.category === "CRITICAL_ILLNESS";

  // Build comparison rows
  const basicRows: [string, string | number | null | undefined, string | number | null | undefined][] = [
    ["Company", productA.company.displayName, productB.company.displayName],
    ["Region", productA.region, productB.region],
    ["Product Type", isCI ? "Critical Illness" : "Savings", isCI ? "Critical Illness" : "Savings"],
    ["Currency", productA.currency, productB.currency],
  ];

  if (isCI) {
    const a = productA.criticalIllnessDetail;
    const b = productB.criticalIllnessDetail;
    basicRows.push(
      ["Coverage Term", a?.coverageTerm, b?.coverageTerm],
      ["Premium Term", a?.premiumTerm, b?.premiumTerm],
      ["Entry Age", `${a?.entryAgeMin ?? "?"}-${a?.entryAgeMax ?? "?"}`, `${b?.entryAgeMin ?? "?"}-${b?.entryAgeMax ?? "?"}`],
      ["Waiting Period", a?.waitingPeriodDays ? `${a.waitingPeriodDays} days` : null, b?.waitingPeriodDays ? `${b.waitingPeriodDays} days` : null],
      ["Major Illness Count", a?.majorIllnessCount, b?.majorIllnessCount],
      ["Minor Illness Count", a?.minorIllnessCount, b?.minorIllnessCount],
      ["Cancer Multiple Claims", a?.cancerMultipleClaims ? "Yes" : "No", b?.cancerMultipleClaims ? "Yes" : "No"],
      ["Heart/Stroke Multiple Claims", a?.heartStrokeMultipleClaims ? "Yes" : "No", b?.heartStrokeMultipleClaims ? "Yes" : "No"],
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
      ["Guaranteed Cash Value", a?.guaranteedCashValue ? "Yes" : "No", b?.guaranteedCashValue ? "Yes" : "No"],
      ["Illustrated IRR", a?.illustratedIrr ? `${a.illustratedIrr}%` : null, b?.illustratedIrr ? `${b.illustratedIrr}%` : null],
      ["Guaranteed IRR", a?.guaranteedIrr ? `${a.guaranteedIrr}%` : null, b?.guaranteedIrr ? `${b.guaranteedIrr}%` : null],
      ["Break-even Year (Illustrated)", a?.illustratedBreakEvenYear, b?.illustratedBreakEvenYear],
      ["Break-even Year (Guaranteed)", a?.guaranteedBreakEvenYear, b?.guaranteedBreakEvenYear],
      ["Terminal Bonus", a?.terminalBonus ? "Yes" : "No", b?.terminalBonus ? "Yes" : "No"],
      ["Reversionary Bonus", a?.reversionaryBonus ? "Yes" : "No", b?.reversionaryBonus ? "Yes" : "No"],
      ["Policy Loan", a?.policyLoan ? "Yes" : "No", b?.policyLoan ? "Yes" : "No"],
      ["Legacy Planning", a?.legacyPlanning ? "Yes" : "No", b?.legacyPlanning ? "Yes" : "No"],
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/compare" className="hover:text-blue-600">Compare</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{productA.displayName} vs {productB.displayName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {productA.displayName} vs {productB.displayName}
        </h1>
        <p className="text-gray-600">{comparison.basicSummary}</p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 text-sm font-medium text-gray-500 w-1/3">Feature</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900 w-1/3">
                <Link href={`/product/${productA.slug}`} className="hover:text-blue-600">
                  {productA.displayName}
                </Link>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-900 w-1/3">
                <Link href={`/product/${productB.slug}`} className="hover:text-blue-600">
                  {productB.displayName}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {basicRows.map(([label, valA, valB], idx) => (
              <tr key={label} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-4 text-sm text-gray-500 font-medium">{label}</td>
                <td className="p-4 text-sm text-gray-900">{valA ?? "N/A"}</td>
                <td className="p-4 text-sm text-gray-900">{valB ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Comparison */}
      <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">AI Deep Comparison</h2>
        <p className="text-sm text-gray-600 mb-4">
          Generate an AI-powered deep comparison of these two products. This will use 1 of your daily free comparisons.
        </p>
        {comparison.aiSummary ? (
          <div className="prose prose-sm max-w-none">
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p>{comparison.aiSummary}</p>
            </div>
            {comparison.aiKeyDifferences && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Key Differences</h3>
                <p className="whitespace-pre-line">{comparison.aiKeyDifferences}</p>
              </div>
            )}
            {comparison.aiCommonPoints && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Common Points</h3>
                <p className="whitespace-pre-line">{comparison.aiCommonPoints}</p>
              </div>
            )}
            {comparison.aiRiskNotes && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Risk Notes & Things to Check</h3>
                <p className="whitespace-pre-line">{comparison.aiRiskNotes}</p>
              </div>
            )}
          </div>
        ) : (
          <CompareAIButton comparisonId={comparison.id} productAId={productA.id} productBId={productB.id} />
        )}
      </section>

      <Disclaimer />
    </div>
  );
}
