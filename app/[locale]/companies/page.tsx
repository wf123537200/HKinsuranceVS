import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CompanyLogo from "@/components/CompanyLogo";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  translateCompanyName,
  translateRegion,
  sortByTranslatedName,
  companyDescriptions,
} from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";
import { getPdfCatalog } from "@/lib/pdf-catalog";
import { buildMetadata } from "@/lib/seo";
import { buildItemListJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale =
    rawLocale && (locales as readonly string[]).includes(rawLocale)
      ? rawLocale
      : defaultLocale;
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
  const { locale: rawLocale } = await params;
  const locale =
    rawLocale && (locales as readonly string[]).includes(rawLocale)
      ? rawLocale
      : defaultLocale;
  const t = await getTranslations("companies");
  const tc = await getTranslations("categories");
  const tCommon = await getTranslations("common");

  // PDFs are the truth source for which companies exist and which products
  // they own. We still pull logoUrl from prisma (a static asset that
  // doesn't ship with the PDF) but the company list and per-company
  // product counts come straight from disk.
  const pdfCatalog = await getPdfCatalog();
  const companyCountMap = new Map(
    pdfCatalog.companies.filter((c) => c.productCount > 0).map((c) => [c.slug, c.productCount])
  );
  const companyCategoryCounts = new Map<string, { ci: number; sv: number }>();
  for (const p of pdfCatalog.products) {
    const cur = companyCategoryCounts.get(p.companySlug) ?? { ci: 0, sv: 0 };
    if (p.category === "critical_illness") cur.ci += 1;
    else if (p.category === "savings") cur.sv += 1;
    companyCategoryCounts.set(p.companySlug, cur);
  }
  // Resolve logos + DB-side metadata for these 9 companies only.
  const prismaCompanies = await prisma.company.findMany({
    where: { slug: { in: Array.from(companyCountMap.keys()) } },
    select: { slug: true, name: true, logoUrl: true, region: true },
  });
  const logoBySlug = new Map(prismaCompanies.map((c) => [c.slug, c.logoUrl]));
  const regionBySlug = new Map(prismaCompanies.map((c) => [c.slug, c.region]));

  const companies = Array.from(companyCountMap.keys())
    .map((slug) => ({
      slug,
      displayName: translateCompanyName(slug, locale as Locale),
      rawName: prismaCompanies.find((c) => c.slug === slug)?.name ?? slug,
      logoUrl: logoBySlug.get(slug) ?? null,
      region: translateRegion(regionBySlug.get(slug) ?? "Hong Kong", locale as Locale),
      description:
        companyDescriptions[slug]?.[locale as Locale] ||
        companyDescriptions[slug]?.en ||
        "",
      ciCount: companyCategoryCounts.get(slug)?.ci ?? 0,
      svCount: companyCategoryCounts.get(slug)?.sv ?? 0,
    }))
    .sort(sortByTranslatedName(locale as Locale));

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
          return (
            <Link
              key={company.slug}
              href={`/company/${company.slug}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CompanyLogo
                    name={company.rawName}
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
                <span>{company.ciCount} {tc("criticalIllness")}</span>
                <span>{company.svCount} {tc("savings")}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
