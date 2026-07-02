import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CompanyLogo from "@/components/CompanyLogo";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { translateCompany, sortByTranslatedName } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import { getSiteProductSlugs } from "@/lib/selected-products";
import { buildMetadata } from "@/lib/seo";
import { buildItemListJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const t = await getTranslations({ locale, namespace: "companies" });
  return buildMetadata({
    path: "/companies",
    locale: localeTyped,
    title: t("title"),
    description: `${t("description")} Browse insurance companies from Hong Kong and Mainland China on Policy Vector, including company profile, region, and product categories.`,
  });
}

export default async function CompaniesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("companies");
  const tc = await getTranslations("categories");
  const tCommon = await getTranslations("common");

  const siteSlugs = await getSiteProductSlugs();
  const productsWithCompany = await prisma.product.findMany({
    where: { slug: { in: siteSlugs } },
    select: { company: { select: { slug: true } } },
  });
  const companySlugs = Array.from(new Set(productsWithCompany.map((p) => p.company.slug)));

  const rawCompanies = await prisma.company.findMany({
    where: { slug: { in: companySlugs } },
    orderBy: { displayName: "asc" },
    include: {
      products: {
        where: { slug: { in: siteSlugs } },
        select: { id: true, category: true },
      },
    },
  });

  const companiesWithProducts = rawCompanies.filter((c) => c.products.length > 0);
  const companies = companiesWithProducts.map((c) => translateCompany(c, locale as Locale)).sort(sortByTranslatedName(locale as Locale));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd
        data={buildItemListJsonLd({
          locale: locale as Locale,
          name: t("title"),
          description: t("description"),
          items: companies.map((c) => ({
            name: c.displayName,
            path: `/company/${c.slug}`,
            image: c.logoUrl || null,
            description: c.description || null,
          })),
        })}
      />
      <div className="flex items-end gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-xs text-gray-400 pb-1">{tCommon("sortNote")}</p>
      </div>
      <p className="text-gray-600 mb-8">
        {t("description")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => {
          const ciCount = company.products.filter((p: { category: string }) => p.category === "CRITICAL_ILLNESS").length;
          const savingsCount = company.products.filter((p: { category: string }) => p.category === "SAVINGS").length;

          return (
            <Link
              key={company.id}
              href={`/company/${company.slug}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CompanyLogo
                    name={company.name}
                    displayName={company.displayName}
                    logoUrl={company.logoUrl}
                    size="sm"
                  />
                  <h2 className="text-lg font-semibold text-gray-900">{company.displayName}</h2>
                </div>
                <span className="shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {company.region}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{company.description}</p>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>{ciCount} {tc("criticalIllness")}</span>
                <span>{savingsCount} {tc("savings")}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
