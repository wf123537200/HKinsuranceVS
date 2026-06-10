import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { translateProduct, translateCompany } from "@/lib/translations";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insurance Product Comparisons",
  description: "Compare insurance products side by side across Hong Kong and Mainland China.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ComparePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("compare");
  const comparisons = await prisma.comparison.findMany({
    orderBy: { viewCount: "desc" },
    include: {
      productA: { include: { company: true } },
      productB: { include: { company: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">
        {t("description")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisons.map((comp) => {
          const trA = translateProduct(comp.productA as Parameters<typeof translateProduct>[0], locale as Locale);
          const trB = translateProduct(comp.productB as Parameters<typeof translateProduct>[0], locale as Locale);
          return (
            <Link
              key={comp.id}
              href={`/compare/${comp.slug}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  comp.productA.category === "CRITICAL_ILLNESS"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {comp.productA.category === "CRITICAL_ILLNESS" ? "CI" : "Savings"}
                </span>
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{trA.displayName}</p>
              <p className="text-xs text-gray-500 mb-2">vs</p>
              <p className="font-semibold text-gray-900 text-sm mb-2">{trB.displayName}</p>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{trA.company.displayName}</span>
                <span>{trB.company.displayName}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
