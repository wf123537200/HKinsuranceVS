import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { translateCompany, sortByTranslatedName } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";
import ProductCard from "@/components/ProductCard";
import CompanyLogo from "@/components/CompanyLogo";
import { getSiteProductSlugs, getSelectedDbSlugs } from "@/lib/selected-products";
import { getHotProductVectors, getAllProductVectors } from "@/lib/product-vector-registry";
import { getProductName, getCompanyName, getRegionLabel, getCompareDescription, pickBaseName } from "@/lib/vector-i18n";
import { getPdfCatalog, pdfCatalogStats } from "@/lib/pdf-catalog";
import { buildMetadata } from "@/lib/seo";
import { buildWebSiteJsonLd, buildPublisherOrganizationJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
import GeoBlocks from "@/components/GeoBlocks";

// Theoretical same-category C(n, 2) pairs across all visible products.
// CI×CI + Savings×Savings only — CI vs Savings has no analytical value.
function pairCountSameCategory(ciCount: number, svCount: number): number {
  return (ciCount * (ciCount - 1)) / 2 + (svCount * (svCount - 1)) / 2;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale =
    rawLocale && (locales as readonly string[]).includes(rawLocale)
      ? rawLocale
      : defaultLocale;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildMetadata({
    path: "/",
    locale: locale as Locale,
    title: t("homeTitle"),
    description: t("homeDescription"),
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale =
    rawLocale && (locales as readonly string[]).includes(rawLocale)
      ? rawLocale
      : defaultLocale;
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");
  const tCommon = await getTranslations("common");
  const tGeo = await getTranslations("geo");

  const siteSlugs = await getSiteProductSlugs();
  const productsWithCompany = await prisma.product.findMany({
    where: { slug: { in: siteSlugs } },
    select: { slug: true, company: { select: { slug: true, logoUrl: true } } },
  });
  const companySlugs = Array.from(new Set(productsWithCompany.map((p) => p.company.slug)));
  // Build slug -> logoUrl map for the hot products block (Task: "红框应该展示各公司 logo")
  const logoByCompany = new Map(
    productsWithCompany.map((p) => [p.company.slug, p.company.logoUrl])
  );

  const [rawCompanies, dbHotProducts, comparisons, productStats, categoryCounts] = await Promise.all([
    prisma.company.findMany({
      where: { slug: { in: companySlugs } },
      orderBy: { name: "asc" },
      include: { products: { where: { slug: { in: siteSlugs } }, select: { id: true, category: true } } },
    }),
    // Hot products come from ProductVector v2.4 — primary source per Phase 5.
    // Logo URL is looked up from Prisma by company slug.
    getHotProductVectors().then((v) => v.slice(0, 8).map((vec) => ({
      id: vec.base.slug,
      slug: vec.base.slug,
      displayName: getProductName(vec.base.slug, locale as Locale, pickBaseName(vec.base, locale as Locale)),
      category: vec.base.category === "critical_illness" ? "CRITICAL_ILLNESS" : "SAVINGS",
      region: vec.base.region || "Hong Kong",
      summary: null,
      company: {
        id: vec.base.company_slug,
        slug: vec.base.company_slug,
        name: vec.base.company_name,
        displayName: getCompanyName(vec.base.company_slug, locale as Locale, vec.base.company_name),
        logoUrl: logoByCompany.get(vec.base.company_slug) || null,
      },
    }))),
    prisma.comparison.findMany({
      // Same-category comparisons only (CI×CI, Savings×Savings).
      where: {
        productA: { slug: { in: siteSlugs } },
        productB: { slug: { in: siteSlugs } },
        OR: [
          { productA: { category: "CRITICAL_ILLNESS" }, productB: { category: "CRITICAL_ILLNESS" } },
          { productA: { category: "SAVINGS" }, productB: { category: "SAVINGS" } },
        ],
      },
      orderBy: { viewCount: "desc" },
      take: 6,
      include: { productA: { include: { company: true } }, productB: { include: { company: true } } },
    }),
    prisma.product.aggregate({ where: { slug: { in: siteSlugs } }, _count: { id: true } }),
    prisma.product.groupBy({
      by: ["category"],
      where: { slug: { in: siteSlugs } },
      _count: { _all: true },
    }),
  ]);

  const companiesWithProducts = rawCompanies.filter((c) => c.products.length > 0);
  const translatedProducts = dbHotProducts;
  const translatedCompanies = companiesWithProducts.map((c) => translateCompany(c, locale as Locale)).sort(sortByTranslatedName(locale as Locale));

  // Stat block: PDFs are the truth source. We override the prisma-derived
  // counts with what we actually have on disk under public/pdfs/, so the
  // hero band never reports a stale number. Hot-products list still uses
  // prisma + vectors for now (cosmetic, not the stat).
  const pdfCatalog = await getPdfCatalog();
  const pdfStats = pdfCatalogStats(pdfCatalog);
  const totalProducts = pdfStats.products;

  // Build slug -> vector base map so comparison/product cards can resolve the
  // locale-correct Chinese name (zh-CN / zh-TW / en) from the ProductVector,
  // not from the single-locale Prisma `displayName` column.
  const hotVectors = await getHotProductVectors();
  const baseBySlug = new Map(hotVectors.map((v) => [v.base.slug, v.base]));
  const allVectors = await getAllProductVectors();
  for (const v of allVectors) {
    if (!baseBySlug.has(v.base.slug)) baseBySlug.set(v.base.slug, v.base);
  }
  const ciCount = categoryCounts.find((c) => c.category === "CRITICAL_ILLNESS")?._count._all ?? 0;
  const svCount = categoryCounts.find((c) => c.category === "SAVINGS")?._count._all ?? 0;
  const totalComparisons = pdfStats.comparisons;
  // Build a set of slugs that are in the V1 selected list, for the flame badge.
  const selectedSlugSet = new Set(getSelectedDbSlugs());

  const homeSourcesRaw = tGeo.raw("home.sources");
  const homeSources = Array.isArray(homeSourcesRaw)
    ? homeSourcesRaw.map((s: { label: string; url: string }) => ({ label: s.label, url: s.url }))
    : [];

  return (
    <div>
      <JsonLd
        data={[
          buildWebSiteJsonLd({ locale: locale as Locale, description: t("heroDescription") }),
          buildPublisherOrganizationJsonLd({ locale: locale as Locale, description: t("heroSubtitle") }),
        ]}
      />
      <GeoBlocks
        quickAnswer={{
          title: tGeo("home.quickAnswerTitle"),
          text: tGeo("home.quickAnswerText"),
        }}
        sources={homeSources}
        methodology={{
          title: tGeo("common.methodologyTitle"),
          text: tGeo("common.vectorVersion"),
        }}
      />
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("heroTitle")}</h1>
          <p className="text-xl text-blue-100 mb-2">{t("heroSubtitle")}</p>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">{t("heroDescription")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/products/critical-illness" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">{t("criticalIllnessBtn")}</Link>
            <Link href="/products/savings" className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors border border-blue-400">{t("savingsBtn")}</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{pdfStats.companies}</div>
              <div className="text-sm">{t("companiesCount")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalProducts}</div>
              <div className="text-sm">{t("productsCount")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalComparisons}</div>
              <div className="text-sm">{t("comparisonsCount")}</div>
            </div>
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
            {translatedProducts.map((product) => {
              const base = baseBySlug.get(product.slug);
              const localeName = getProductName(
                product.slug,
                locale as Locale,
                base ? pickBaseName(base, locale as Locale) : product.displayName,
              );
              const localeCompany = getCompanyName(
                product.company.slug,
                locale as Locale,
                base?.company_name ?? product.company.name,
              );
              return (
                <ProductCard
                  key={product.id}
                  size="compact"
                  product={{
                    slug: product.slug,
                    displayName: localeName,
                    category: product.category as "CRITICAL_ILLNESS" | "SAVINGS",
                    region: getRegionLabel(product.region, locale as Locale),
                    companyDisplayName: localeCompany,
                    companySlug: product.company.slug,
                    companyLogoUrl: product.company.logoUrl,
                    isHot: selectedSlugSet.has(product.slug),
                    categoryLabel:
                      product.category === "CRITICAL_ILLNESS" ? tc("criticalIllness") : tc("savings"),
                  }}
                />
              );
            })}
          </div>
        </section>

        {comparisons.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t("mostCompared")}</h2>
              <Link href="/compare" className="text-sm text-blue-600 hover:text-blue-700">{tCommon("viewAll")} &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisons.map((comp) => {
                const aBase = baseBySlug.get(comp.productA.slug);
                const bBase = baseBySlug.get(comp.productB.slug);
                const aName = aBase
                  ? getProductName(comp.productA.slug, locale as Locale, pickBaseName(aBase, locale as Locale))
                  : comp.productA.displayName;
                const bName = bBase
                  ? getProductName(comp.productB.slug, locale as Locale, pickBaseName(bBase, locale as Locale))
                  : comp.productB.displayName;
                // Detect if DB basicSummary is in English (it currently always is).
                // In that case, prefer the localized compare-description template so
                // the homepage shows locale-aware text instead of raw English.
                const rawSummary: string = (comp as any).basicSummary || "";
                const summaryLooksEnglish = /^[A-Za-z0-9 ,.;:'"()&/-]+$/.test(rawSummary);
                const useTemplate =
                  !rawSummary ||
                  (summaryLooksEnglish && (locale === "zh-CN" || locale === "zh-TW"));
                const description = useTemplate
                  ? getCompareDescription(aName, bName, locale as Locale)
                  : rawSummary;
                return (
                  <Link key={comp.id} href={`/compare/${comp.slug}`} className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{aName} {tCommon("vs")} {bName}</h3>
                    <p className="text-xs text-gray-500">{description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-end gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("companies")}</h2>
            <p className="text-xs text-gray-400 pb-1">{tCommon("sortNote")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pdfCatalog.companies.filter((c) => c.productCount > 0).map((c) => {
              const counts = pdfCatalog.products.reduce(
                (acc, p) => {
                  if (p.companySlug !== c.slug) return acc;
                  if (p.category === "critical_illness") acc.ci += 1;
                  else if (p.category === "savings") acc.sv += 1;
                  return acc;
                },
                { ci: 0, sv: 0 }
              );
              const ciCount = counts.ci;
              const savingsCount = counts.sv;
              const logoUrl = logoByCompany.get(c.slug) || null;
              return (
                <Link key={c.slug} href={`/company/${c.slug}`} className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <CompanyLogo name={c.slug} displayName={getCompanyName(c.slug, locale as Locale, c.slug)} logoUrl={logoUrl} size="sm" />
                    <h3 className="font-semibold text-gray-900 text-sm">{getCompanyName(c.slug, locale as Locale, c.slug)}</h3>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>{ciCount} {tc("criticalIllness")}</span>
                    <span>{savingsCount} {tc("savings")}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
