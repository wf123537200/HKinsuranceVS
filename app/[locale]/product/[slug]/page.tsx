import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Disclaimer from "@/components/Disclaimer";
import HotBadge from "@/components/HotBadge";
import Breadcrumb from "@/components/Breadcrumb";
import type { Locale } from "@/i18n/config";
import { selectedHotDiscussedInsuranceProducts } from "@/data/hot-discussed-products";
import {
  getAllProductVectors,
  getProductVectorsByCompany,
  type ProductVectorV24,
} from "@/lib/product-vector-registry";
import { formatVectorValue } from "@/lib/product-vector-formatters";
import {
  getProductName,
  getCompanyName,
  getCategoryLabel,
  getRiskLabel,
  getFieldLabel,
  getFeatureTag,
  getUiLabel,
  getRegionLabel,
  pickBaseName,
} from "@/lib/vector-i18n";
import { buildMetadata } from "@/lib/seo";
import { buildFinancialProductJsonLd, buildFaqPageJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
import GeoBlocks from "@/components/GeoBlocks";
import RelatedProductsByCategory, { type RelatedByCategoryItem } from "@/components/RelatedProductsByCategory";
import ClientPdfGate from "@/components/ClientPdfGate";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const vectors = await getAllProductVectors();
  const vector = vectors.find((v) => v.base.slug === slug);
  const localeTyped = locale as Locale;
  if (!vector) {
    return buildMetadata({
      path: `/product/${slug}`,
      locale: localeTyped,
      title: "Insurance Product Not Found",
      description: "This insurance product is not yet available on Policy Vector.",
      robots: { index: false, follow: false },
    });
  }
  const name = getProductName(slug, localeTyped, pickBaseName(vector.base, localeTyped));
  const companyName = getCompanyName(
    vector.base.company_slug,
    localeTyped,
    vector.base.company_name
  );
  return buildMetadata({
    path: `/product/${slug}`,
    locale: localeTyped,
    title: `${name} by ${companyName}: Features, Currency, Premium Term and Comparison`,
    description: `Review ${name} by ${companyName}. See product type, region, currency, premium term, participating status, guaranteed value, projected value, break-even year, and comparable insurance products on Policy Vector.`,
    ogType: "article",
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations("products");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tGeo = await getTranslations("geo");
  const localeTyped = locale as Locale;

  const vectors = await getAllProductVectors();
  const vector = vectors.find((v) => v.base.slug === slug);
  if (!vector) notFound();

  const selectedMeta = selectedHotDiscussedInsuranceProducts.find((s) => s.db_slug === slug);
  const dbProduct = await prisma.product.findUnique({ where: { slug } });

  // dbProduct may be null for newly vector-only entries; comparison sections handle it.
  const productName = getProductName(slug, localeTyped, pickBaseName(vector.base, localeTyped));
  const productNameEn = vector.base.product_name_en || "";
  const companyName = getCompanyName(
    vector.base.company_slug,
    localeTyped,
    vector.base.company_name
  );
  const categoryLabel = getCategoryLabel(vector.base.category, localeTyped);
  const isCI = vector.base.category === "critical_illness";

  const sameCompanyVectors = (await getProductVectorsByCompany(vector.base.company_slug)).filter(
    (v) => v.base.slug !== vector.base.slug
  );

  const risks: string[] = Array.isArray(vector.compare_profile?.risk_summary)
    ? vector.compare_profile.risk_summary
    : Array.isArray(vector.modules?.risk_module?.risk_summary)
    ? vector.modules.risk_module.risk_summary
    : [];

  // Product features — only display_features. Don't fall back to product_features
  // (PDF 原文 / source_pages / evidence_quote must never appear on the public page).
  const displayFeatures = (vector.display_features || [])
    .slice()
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

  const featureTags = (vector.feature_tags || []).map((tag) => getFeatureTag(tag, localeTyped));

  const comparisons = dbProduct
    ? await prisma.comparison.findMany({
        where: { OR: [{ productAId: dbProduct.id }, { productBId: dbProduct.id }] },
        include: {
          productA: { include: { company: true } },
          productB: { include: { company: true } },
        },
        take: 6,
      })
    : [];

  const hotBadgeLabel = getUiLabel("hotBadge", localeTyped);
  const viewPdfLabel = getUiLabel("viewPdf", localeTyped);
  const noPdfLabel = getUiLabel("noPdf", localeTyped);

  const currencies = Array.isArray(vector.compare_profile?.currencies)
    ? (vector.compare_profile!.currencies as string[])
    : [];
  const categorySlug = isCI ? "critical-illness" : "savings";
  const currencyList = currencies.length ? currencies.join(", ") : "—";
  const regionLabel = getRegionLabel(vector.base.region, localeTyped) || vector.base.region || "";
  // Sources array uses plain string templates (no ICU), so we use tGeo.raw to
  // get the literal values, then substitute placeholders via String.replace.
  const sourcesRaw = tGeo.raw("product.sources");
  const sources = (Array.isArray(sourcesRaw) ? sourcesRaw : []).map((s: { label: string; url: string }) => ({
    label: s.label
      .replace("{company}", companyName)
      .replace("{category}", categoryLabel),
    url: s.url
      .replace("{companySlug}", vector.base.company_slug)
      .replace("{categorySlug}", categorySlug),
  }));
  // FAQ entries use ICU placeholders — pass values as the second argument so
  // next-intl substitutes them properly (calling t("key") without values for
  // an ICU message makes next-intl throw and fall back to the key path).
  const faqs = [
    {
      question: tGeo("product.faqQ1", { name: productName }),
      answer: tGeo("product.faqA1", { name: productName, category: categoryLabel, company: companyName }),
    },
    {
      question: tGeo("product.faqQ2", { name: productName }),
      answer: tGeo("product.faqA2", { name: productName, currencies: currencyList }),
    },
    {
      question: tGeo("product.faqQ3", { name: productName }),
      answer: tGeo("product.faqA3", { name: productName }),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd
        data={buildFinancialProductJsonLd({
          locale: localeTyped,
          name: productName,
          alternateName: productNameEn || null,
          path: `/product/${slug}`,
          category: vector.base.category,
          region: vector.base.region || "",
          currencies,
          description: vector.extraction_meta?.summary || null,
          brandName: companyName,
          brandPath: `/company/${vector.base.company_slug}`,
        })}
      />
      <JsonLd data={buildFaqPageJsonLd(faqs)} />
      <GeoBlocks
        quickAnswer={{
          title: tGeo("product.quickAnswerTitle", { name: productName }),
          text: tGeo("product.quickAnswerText", {
            name: productName,
            category: categoryLabel,
            company: companyName,
            region: regionLabel,
            currencies: currencyList,
          }),
        }}
        faqs={faqs}
        sources={sources.filter((s) => s.url)}
        methodology={{
          title: tGeo("common.methodologyTitle"),
          text: `${tGeo("common.dataExtractedFrom", { date: vector.extraction_meta?.extraction_date || "—" })} ${tGeo("common.vectorVersion")}`,
        }}
      />
      <Breadcrumb
        locale={localeTyped}
        items={[
          { name: tNav("home"), path: "/" },
          { name: t("title"), path: "/products" },
          { name: categoryLabel, path: isCI ? "/products/critical-illness" : "/products/savings" },
          { name: productName, path: `/product/${slug}` },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-start gap-3 mb-2 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-900">{productName}</h1>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full shrink-0 ${
              isCI ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {categoryLabel}
          </span>
          {(vector.base.is_hot_discussed ||
            vector.base.market_attention === "hot_discussed") && (
            <HotBadge size="md" label={hotBadgeLabel} />
          )}
        </div>
        <p className="text-gray-600">
          {tCommon("by")}{" "}
          <Link
            href={`/company/${vector.base.company_slug}`}
            className="text-blue-600 hover:text-blue-700"
          >
            {companyName}
          </Link>
          {vector.base.region ? ` · ${vector.base.region}` : ""}
        </p>
        {productNameEn && productNameEn !== productName && (
          <p className="text-sm text-gray-500 mt-1">
            {t("englishName")}: {productNameEn}
          </p>
        )}
      </div>

      {selectedMeta?.selected_reason && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-blue-900 mb-1">{t("whySelected")}</h2>
              <p className="text-sm text-blue-800">{selectedMeta.selected_reason}</p>
            </div>
          </div>
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{"基础信息"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard label={getUiLabel("companyName", localeTyped)} value={companyName} />
          <InfoCard label={getUiLabel("productCategory", localeTyped)} value={categoryLabel} />
          <InfoCard label={getUiLabel("policyTerm", localeTyped)} value={formatVectorValue(vector.base.policy_term)} />
          <InfoCard label={getUiLabel("premiumTerm", localeTyped)} value={formatVectorValue(vector.base.premium_term)} />
          <InfoCard
            label={getUiLabel("entryAge", localeTyped)}
            value={formatVectorValue(vector.compare_profile?.entry_age_summary || vector.base.entry_age)}
          />
          <InfoCard
            label={getUiLabel("currency", localeTyped)}
            value={formatVectorValue(vector.compare_profile?.currencies || vector.base.policy_currency)}
          />
          {vector.base.local_pdf_path ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t("productBrochure")}</h3>
              <ClientPdfGate
                productId={vector.base.slug}
                localPdfPath={vector.base.local_pdf_path}
                viewPdfLabel={viewPdfLabel}
                lockedLabel={tGeo("pdfGate.lockedLabel")}
              />
            </div>
          ) : (
            <InfoCard label={t("productBrochure")} value={noPdfLabel} />
          )}
        </div>
      </section>

      {isCI ? <CoreBenefitsCI vector={vector} locale={localeTyped} /> : <CoreBenefitsSV vector={vector} locale={localeTyped} />}

      {/* Product features — only display_features, never PDF source text */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{getFieldLabel("产品特色", localeTyped)}</h2>
        {displayFeatures.length > 0 ? (
          <div className="grid gap-4">
            {displayFeatures.map((feature, index) => (
              <div key={`${feature.title}-${index}`} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                {feature.summary && (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.summary}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">暂无产品特色摘要</p>
        )}
      </section>

      {featureTags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("tags")}</h2>
          <div className="flex flex-wrap gap-2">
            {featureTags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full">{tag}</span>
            ))}
          </div>
        </section>
      )}

      {risks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{getUiLabel("riskSection", localeTyped)}</h2>
          <ul className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 space-y-2">
            {risks.map((r, i) => (
              <li key={i} className="text-sm text-amber-900">• {getRiskLabel(r, localeTyped)}</li>
            ))}
          </ul>
        </section>
      )}

      {sameCompanyVectors.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("companyProductsTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sameCompanyVectors.slice(0, 6).map((v) => {
              const n = getProductName(v.base.slug, localeTyped, pickBaseName(v.base, localeTyped));
              const c = getCategoryLabel(v.base.category, localeTyped);
              return (
                <Link key={v.base.slug} href={`/product/${v.base.slug}`} className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                  <p className="font-semibold text-gray-900 mb-1">{n}</p>
                  <p className="text-xs text-gray-500">{c}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {comparisons.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("relatedComparisons")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisons.map((comp) => {
              const other = comp.productAId === dbProduct!.id ? comp.productB : comp.productA;
              return (
                <Link key={comp.id} href={`/compare/${comp.slug}`} className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                  <p className="text-sm font-semibold text-gray-900">
                    {productName} {tCommon("vs")} {getProductName(other.slug, localeTyped)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getCompanyName(other.company.slug, localeTyped, other.company.name)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <RelatedProductsByCategory
        title={t("relatedByCategoryTitle", { category: categoryLabel })}
        emptyText={t("noRelatedByCategory")}
        items={(() => {
          // Up to 4 same-category products, excluding current and same-company.
          const excludeSlugs = new Set<string>([slug]);
          sameCompanyVectors.forEach((v) => excludeSlugs.add(v.base.slug));
          const candidates = (vectors as ProductVectorV24[])
            .filter((v) => v.base.category === vector.base.category && !excludeSlugs.has(v.base.slug))
            .slice()
            // Deterministic order: alphabetical by slug. Anchors become unique
            // per page because each list excludes a different slug.
            .sort((a, b) => a.base.slug.localeCompare(b.base.slug))
            .slice(0, 4);
          return candidates.map<RelatedByCategoryItem>((v) => ({
            slug: v.base.slug,
            name: getProductName(v.base.slug, localeTyped, pickBaseName(v.base, localeTyped)),
            companyName: getCompanyName(v.base.company_slug, localeTyped, v.base.company_name),
            categoryLabel: getCategoryLabel(v.base.category, localeTyped),
          }));
        })()}
      />

      <Disclaimer />
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
      <p className="text-gray-900 break-words">{value}</p>
    </div>
  );
}

function CoreBenefitsCI({ vector, locale }: { vector: ProductVectorV24; locale: Locale }) {
  const cp = vector.compare_profile || {};
  const core = vector.core?.critical_illness_core || {};
  const items: Array<[string, unknown]> = [
    [getFieldLabel("疾病总数", locale), core.covered_illness_total ?? cp.covered_illness_total],
    [getFieldLabel("重大疾病数", locale), core.major_illness_count ?? cp.major_illness_count],
    [getFieldLabel("早期疾病数", locale), core.early_stage_illness_count ?? cp.early_stage_illness_count],
    ["中度疾病数", core.moderate_illness_count ?? cp.moderate_illness_count],
    ["儿童疾病数", core.child_illness_count ?? cp.child_illness_count],
    [getFieldLabel("多次赔付", locale), core.has_multiple_claims ?? cp.has_multiple_claims],
    [getFieldLabel("癌症多次赔", locale), core.has_cancer_multiple_claims ?? cp.has_cancer_multiple_claims],
    [getFieldLabel("ICU 保障", locale), core.has_icu_benefit ?? cp.has_icu_benefit],
    [getFieldLabel("保证现金价值", locale), cp.has_guaranteed_cash_value],
    [getFieldLabel("非保证红利", locale), cp.has_non_guaranteed_bonus],
  ];
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{"核心利益"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(([label, value]) => (
          <InfoCard key={label} label={label} value={formatVectorValue(value)} />
        ))}
      </div>
    </section>
  );
}

function CoreBenefitsSV({ vector, locale }: { vector: ProductVectorV24; locale: Locale }) {
  const cp = vector.compare_profile || {};
  const items: Array<[string, unknown]> = [
    [getFieldLabel("保证现金价值", locale), cp.has_guaranteed_cash_value],
    [getFieldLabel("非保证红利", locale), cp.has_non_guaranteed_bonus],
    [getFieldLabel("最高演示 IRR", locale), cp.highest_illustrated_irr],
    [getFieldLabel("保证 IRR", locale), cp.guaranteed_irr],
    [getFieldLabel("最高演示倍数", locale), cp.highest_illustrated_return_multiple],
    [getFieldLabel("保单贷款", locale), cp.has_policy_loan],
    [getFieldLabel("部分提取", locale), cp.has_partial_withdrawal],
    [getFieldLabel("保单分拆", locale), cp.supports_policy_split],
    [getFieldLabel("更改受保人", locale), cp.supports_change_insured],
  ];
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{"核心利益"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(([label, value]) => (
          <InfoCard key={label} label={label} value={formatVectorValue(value)} />
        ))}
      </div>
    </section>
  );
}
