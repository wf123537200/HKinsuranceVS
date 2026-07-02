import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CompanyLogo from "@/components/CompanyLogo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { translateCompany } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import CompanyProductFilter from "@/components/CompanyProductFilter";
import Breadcrumb from "@/components/Breadcrumb";
import GeoBlocks from "@/components/GeoBlocks";
import { selectedHotDiscussedInsuranceProducts } from "@/data/hot-discussed-products";
import {
  getProductVectorsByCompany,
} from "@/lib/product-vector-registry";
import {
  getProductName,
  getCompanyName,
  getFeatureTag,
  pickBaseName,
} from "@/lib/vector-i18n";
import { buildMetadata } from "@/lib/seo";
import { buildCompanyOrganizationJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const localeTyped = locale as Locale;
  const companyName = getCompanyName(slug, localeTyped);
  return buildMetadata({
    path: `/company/${slug}`,
    locale: localeTyped,
    title: `${companyName} Insurance Products, Ratings and Company Profile`,
    description: `View ${companyName} insurance products, company profile, region, product categories, and popular policies on Policy Vector. Sourced from official brochures.`,
  });
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations("companies");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tProducts = await getTranslations("products");
  const tGeo = await getTranslations("geo");
  const localeTyped = locale as Locale;

  // Company metadata (logo + ratings) still comes from Prisma — vectors
  // don't carry brand metadata.
  const rawCompany = await prisma.company.findUnique({ where: { slug } });
  if (!rawCompany) notFound();

  const company = translateCompany(rawCompany, localeTyped);

  // Vectors are the source of truth for products (task 12: "必须从 ProductVector 自动计算")
  const vectors = await getProductVectorsByCompany(slug);

  // Build tag translation map for client component
  const allTags = new Set<string>();
  vectors.forEach((v) => (v.feature_tags || []).forEach((t) => allTags.add(t)));
  const tagTranslations: Record<string, string> = {};
  allTags.forEach((tag) => {
    tagTranslations[tag] = getFeatureTag(tag, localeTyped);
  });

  // Selected slugs (for flame badge)
  const selectedBySlug = new Map(
    selectedHotDiscussedInsuranceProducts
      .filter((s) => s.company_slug === slug && s.db_slug && !s.db_slug.startsWith("pending-"))
      .map((s) => [s.db_slug as string, s])
  );
  const selectedSlugSet = new Set(selectedBySlug.keys());

  const productsWithFlag = vectors.map((v) => {
    const region = v.base.region || "Hong Kong";
    return {
      id: v.base.slug,
      slug: v.base.slug,
      displayName: getProductName(v.base.slug, localeTyped, pickBaseName(v.base, localeTyped)),
      category: v.base.category === "critical_illness" ? "CRITICAL_ILLNESS" : "SAVINGS",
      region: region,
      summary: v.extraction_meta?.summary || null,
      tags: (v.feature_tags || []).map((t) => getFeatureTag(t, localeTyped)),
      isSelected: selectedSlugSet.has(v.base.slug),
    };
  });

  // Build company sources for the GEO Sources block
  const companySources = [
    { label: `${company.displayName} on Policy Vector`, url: `https://policy-vector.com${localeTyped === "en" ? "" : "/" + localeTyped}/company/${slug}` },
    { label: "All insurance companies", url: `https://policy-vector.com${localeTyped === "en" ? "" : "/" + localeTyped}/companies` },
  ];

  // Count categories for the bottom cross-link CTA
  const ciCount = productsWithFlag.filter((p) => p.category === "CRITICAL_ILLNESS").length;
  const svCount = productsWithFlag.filter((p) => p.category === "SAVINGS").length;
  const localePrefix = localeTyped === "en" ? "" : `/${localeTyped}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd
        data={buildCompanyOrganizationJsonLd({
          locale: localeTyped,
          displayName: company.displayName,
          name: rawCompany.name,
          path: `/company/${slug}`,
          region: rawCompany.region,
          country: rawCompany.country,
          website: rawCompany.website,
          foundedYear: rawCompany.foundedYear,
          headquarters: rawCompany.headquarters,
          description: rawCompany.description,
          logoUrl: rawCompany.logoUrl,
          regulator: rawCompany.regulator,
          amBestRating: rawCompany.amBestRating,
          moodysRating: rawCompany.moodysRating,
          spRating: rawCompany.spRating,
          fitchRating: rawCompany.fitchRating,
        })}
      />
      <GeoBlocks
        quickAnswer={{
          title: tGeo("company.quickAnswerTitle", { name: company.displayName }),
          text: tGeo("company.quickAnswerText", {
            name: company.displayName,
            region: rawCompany.region,
            count: String(productsWithFlag.length),
          }),
        }}
        sources={companySources}
        methodology={{
          title: tGeo("common.methodologyTitle"),
          text: tGeo("common.vectorVersion"),
        }}
      />
      <Breadcrumb
        locale={localeTyped}
        items={[
          { name: tNav("home"), path: "/" },
          { name: t("title"), path: "/companies" },
          { name: company.displayName, path: `/company/${slug}` },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <CompanyLogo
            name={rawCompany.name}
            displayName={company.displayName}
            logoUrl={rawCompany.logoUrl}
            size="lg"
          />
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{company.displayName}</h1>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
              {company.region}
            </span>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl">{company.description}</p>
      </div>

      {/* Auto-computed stats from ProductVector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-1">{"产品总数"}</h3>
          <p className="text-2xl font-bold text-gray-900">{productsWithFlag.length}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-1">{"健康险"}</h3>
          <p className="text-2xl font-bold text-gray-900">
            {productsWithFlag.filter((p) => p.category === "CRITICAL_ILLNESS").length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-1">{"储蓄险"}</h3>
          <p className="text-2xl font-bold text-gray-900">
            {productsWithFlag.filter((p) => p.category === "SAVINGS").length}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-1">{"热门产品"}</h3>
          <p className="text-2xl font-bold text-gray-900">
            {productsWithFlag.filter((p) => p.isSelected).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("founded")}</h3>
          <p className="text-gray-900">{company.foundedYear ?? tCommon("na")}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("headquarters")}</h3>
          <p className="text-gray-900">{company.headquarters ?? tCommon("na")}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("regulator")}</h3>
          <p className="text-gray-900">{company.regulator ?? tCommon("na")}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("amBestRating")}</h3>
          <p className="text-gray-900">{company.amBestRating ?? tCommon("na")}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("moodysRating")}</h3>
          <p className="text-gray-900">{company.moodysRating ?? tCommon("na")}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("spRating")}</h3>
          <p className="text-gray-900">{company.spRating ?? tCommon("na")}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("fitchRating")}</h3>
          <p className="text-gray-900">{company.fitchRating ?? tCommon("na")}</p>
        </div>
      </div>

      {company.website && (
        <div className="mb-8">
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm">
            {t("visitWebsite")} &rarr;
          </a>
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("allProducts")}</h2>
        <CompanyProductFilter products={productsWithFlag} tagTranslations={tagTranslations} />

        {/* Cross-link CTAs to the category landing pages — internal-link
            equity from company -> category lists. */}
        <div className="mt-6 flex flex-wrap gap-3">
          {ciCount > 0 && (
            <Link
              href={`${localePrefix}/products/critical-illness`}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              {tProducts("viewAllCategory", { category: tProducts("criticalIllnessTitle") })} &rarr;
            </Link>
          )}
          {svCount > 0 && (
            <Link
              href={`${localePrefix}/products/savings`}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              {tProducts("viewAllCategory", { category: tProducts("savingsTitle") })} &rarr;
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
