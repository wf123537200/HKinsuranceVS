import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { translateProduct, translateCompany, sortByTranslatedName } from "@/lib/translations";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");
  const tCommon = await getTranslations("common");

  const [companies, products, comparisons] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { viewCount: "desc" }, take: 8, include: { company: true } }),
    prisma.comparison.findMany({ orderBy: { viewCount: "desc" }, take: 6, include: { productA: { include: { company: true } }, productB: { include: { company: true } } } }),
  ]);

  const translatedProducts = products.map((p) => translateProduct(p, locale as Locale)).sort(sortByTranslatedName(locale as Locale));
  const translatedCompanies = companies.map((c) => translateCompany(c, locale as Locale)).sort(sortByTranslatedName(locale as Locale));

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("heroTitle")}</h1>
          <p className="text-xl text-blue-100 mb-2">{t("heroSubtitle")}</p>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">{t("heroDescription")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/products/critical-illness" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">{t("criticalIllnessBtn")}</Link>
            <Link href="/products/savings" className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors border border-blue-400">{t("savingsBtn")}</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("hotProducts")}</h2>
            <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700">{tCommon("viewAll")} &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {translatedProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 mb-2">
                  {product.category === "CRITICAL_ILLNESS" ? tc("criticalIllness") : tc("savings")}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.displayName}</h3>
                <p className="text-xs text-gray-500">{product.company.displayName}</p>
                <p className="text-xs text-gray-400 mt-1">{product.region}</p>
              </Link>
            ))}
          </div>
        </section>

        {comparisons.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t("mostCompared")}</h2>
              <Link href="/compare" className="text-sm text-blue-600 hover:text-blue-700">{tCommon("viewAll")} &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisons.map((comp) => (
                <Link key={comp.id} href={`/compare/${comp.slug}`} className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{comp.productA.displayName} {tCommon("vs")} {comp.productB.displayName}</h3>
                  <p className="text-xs text-gray-500">{comp.basicSummary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("companies")}</h2>
            <Link href="/companies" className="text-sm text-blue-600 hover:text-blue-700">{tCommon("viewAll")} &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {translatedCompanies.map((company) => (
              <Link key={company.id} href={`/company/${company.slug}`} className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-center">
                <h3 className="font-semibold text-gray-900 text-sm">{company.displayName}</h3>
                <p className="text-xs text-gray-400 mt-1">{company.region}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
