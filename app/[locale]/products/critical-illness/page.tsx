import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import ProductListWithSearch from "@/components/ProductListWithSearch";
import { getProductVectorsByCategory } from "@/lib/product-vector-registry";
import {
  getProductName,
  getCompanyName,
  getCategoryLabel,
  getRegionLabel,
  pickBaseName,
} from "@/lib/vector-i18n";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const t = await getTranslations({ locale, namespace: "products" });
  return buildMetadata({
    path: "/products/critical-illness",
    locale: localeTyped,
    title: "Critical Illness Insurance Products",
    description: "Browse critical illness insurance products from Hong Kong and Mainland China. Compare coverage breadth, multiple-claim features, and policy details on Policy Vector.",
  });
}

export default async function CriticalIllnessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("products");
  const tc = await getTranslations("categories");
  const tCommon = await getTranslations("common");
  const localeTyped = locale as Locale;

  const vectors = await getProductVectorsByCategory("critical_illness");
  const selectedSlugs = new Set((await import("@/data/hot-discussed-products")).selectedHotDiscussedInsuranceProducts
    .map((s) => s.db_slug)
    .filter((s): s is string => !!s && !s.startsWith("pending-")));

  const companySlugSet = Array.from(new Set(vectors.map((v) => v.base.company_slug)));
  const { prisma } = await import("@/lib/prisma");
  const companyRows = await prisma.company.findMany({
    where: { slug: { in: companySlugSet } },
    select: { slug: true, logoUrl: true },
  });
  const logoByCompany = new Map(companyRows.map((c) => [c.slug, c.logoUrl]));

  const products = vectors
    .map((v) => {
      const region = v.base.region || "Hong Kong";
      return {
        id: v.base.slug,
        slug: v.base.slug,
        displayName: getProductName(v.base.slug, localeTyped, pickBaseName(v.base, localeTyped)),
        category: "CRITICAL_ILLNESS" as const,
        rawRegion: region,
        // Translate region to current locale (Task: "地域没有翻译")
        region: getRegionLabel(region, localeTyped),
        summary: v.extraction_meta?.summary || null,
        isHot: selectedSlugs.has(v.base.slug) || v.base.is_hot_discussed === true,
        company: {
          displayName: getCompanyName(v.base.company_slug, localeTyped, v.base.company_name),
          slug: v.base.company_slug,
          logoUrl: logoByCompany.get(v.base.company_slug) ?? null,
        },
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName, localeTyped === "en" ? "en" : "zh"));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-blue-600">{t("title")}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{tc("criticalIllness")}</span>
      </nav>
      <div className="flex items-end gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{t("criticalIllnessTitle")}</h1>
        <p className="text-xs text-gray-400 pb-1">{tCommon("sortNote")}</p>
      </div>
      <p className="text-gray-600 mb-4">{t("criticalIllnessDescription")}</p>
      <ProductListWithSearch products={products} />
    </div>
  );
}
