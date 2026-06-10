import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { translateProduct } from "@/lib/translations";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Critical Illness Insurance Products",
  description: "Browse critical illness insurance products from Hong Kong and Mainland China.",
};

export default async function CriticalIllnessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("products");
  const tc = await getTranslations("categories");
  const rawProducts = await prisma.product.findMany({
    where: { category: "CRITICAL_ILLNESS" },
    orderBy: { displayName: "asc" },
    include: { company: true, criticalIllnessDetail: true },
  });

  const products = rawProducts.map((p) => translateProduct(p, locale as Locale));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-blue-600">{t("title")}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{tc("criticalIllness")}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("criticalIllnessTitle")}</h1>
      <p className="text-gray-600 mb-8">
        {t("criticalIllnessDescription")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{product.displayName}</h3>
              <span className="shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                {product.region}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{product.company.displayName}</p>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.summary}</p>
            {product.criticalIllnessDetail && (
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {product.criticalIllnessDetail.majorIllnessCount && (
                  <span>{product.criticalIllnessDetail.majorIllnessCount} {t("majorIllnesses")}</span>
                )}
                {product.criticalIllnessDetail.cancerMultipleClaims && (
                  <span className="text-blue-600">{t("cancerMultipleClaims")}</span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
