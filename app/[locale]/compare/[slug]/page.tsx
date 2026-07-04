import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { translateProduct } from "@/lib/translations";
import {
  loadCompareFieldRegistry,
  getCompareValue,
  getBooleanFallback,
  type CompareField,
  type ProductVectorV24,
} from "@/lib/product-vector-registry";
import { loadProductVector } from "@/lib/vectors/saveProductVector";
import {
  formatVectorValue,
  formatCategory,
  isEmptyValue,
  LONG_TEXT_MAX_CHARS,
} from "@/lib/product-vector-formatters";
import {
  formatCompareValue,
  getCompareAdvantage,
  getAdvantageLabel,
  getAdvantageTooltip,
  type CompareAdvantage,
} from "@/lib/compare-format-utils";
import { getRegionLabel, getCompanyName, getUiLabel } from "@/lib/vector-i18n";
import { buildMetadata, compareIndexable } from "@/lib/seo";
import { buildComparePairJsonLd, buildFaqPageJsonLd } from "@/lib/jsonld";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import GeoBlocks from "@/components/GeoBlocks";
import ViewProductCTA from "@/components/ViewProductCTA";
import RelatedComparisons, { type RelatedComparisonItem } from "@/components/RelatedComparisons";
import CompareTable, {
  type CompareRowClient,
  type DisplayFeatureClient,
} from "@/components/CompareTable";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const localeTyped = locale as Locale;
  const comparison = await prisma.comparison.findUnique({
    where: { slug },
    include: {
      productA: { include: { company: true } },
      productB: { include: { company: true } },
    },
  });
  if (!comparison) {
    return buildMetadata({
      path: `/compare/${slug}`,
      locale: localeTyped,
      title: "Insurance Product Comparison Not Found",
      description: "The comparison you are looking for is not available on Policy Vector.",
      robots: { index: false, follow: false },
    });
  }
  // Indexability: both products must carry required base/profile fields and at
  // least 3 comparable fields on each side, otherwise the page is noindex.
  const vectorA = (await loadProductVector(
    comparison.productA.company?.slug || "",
    comparison.productA.slug
  )) as unknown as ProductVectorV24 | null;
  const vectorB = (await loadProductVector(
    comparison.productB.company?.slug || "",
    comparison.productB.slug
  )) as unknown as ProductVectorV24 | null;
  const indexability = compareIndexable(vectorA, vectorB);
  const robots = indexability.indexable
    ? undefined
    : { index: false as const, follow: true as const };

  const trProductA = translateProduct(
    comparison.productA as Parameters<typeof translateProduct>[0],
    localeTyped
  );
  const trProductB = translateProduct(
    comparison.productB as Parameters<typeof translateProduct>[0],
    localeTyped
  );
  const a = trProductA.displayName;
  const b = trProductB.displayName;
  return buildMetadata({
    path: `/compare/${slug}`,
    locale: localeTyped,
    title: `${a} vs ${b}: Insurance Product Comparison`,
    description: `Compare ${a} and ${b} by company, region, product type, currency, premium term, guaranteed value, projected value, IRR, break-even year, and key policy features on Policy Vector.`,
    ogType: "article",
    robots,
  });
}

/**
 * Build compare rows using getCompareValue (primary + fallback chain) and
 * the boolean fallback (feature_tags / display_features). Hides rows where
 * BOTH sides are empty. Long text fields are truncated to LONG_TEXT_MAX_CHARS
 * for display, with the full text preserved in a/bFull for the expand toggle.
 *
 * Percentage / number / boolean advantage is computed on RAW values before
 * formatting, so e.g. 100 (raw number) is compared as 100, then formatted
 * to "100%" at display time only.
 */
function buildRows(
  fields: CompareField[],
  vectorA: ProductVectorV24 | null,
  vectorB: ProductVectorV24 | null,
  locale: Locale
): CompareRowClient[] {
  const rows: CompareRowClient[] = [];
  for (const field of fields) {
    let aRaw = getCompareValue(vectorA, field);
    let bRaw = getCompareValue(vectorB, field);

    // Boolean fallback from feature_tags / display_features for known keys
    if (isEmptyValue(aRaw)) {
      const fb = getBooleanFallback(vectorA, field.path);
      if (fb !== null) aRaw = fb;
    }
    if (isEmptyValue(bRaw)) {
      const fb = getBooleanFallback(vectorB, field.path);
      if (fb !== null) bRaw = fb;
    }

    // Hide rows where BOTH sides are empty
    if (isEmptyValue(aRaw) && isEmptyValue(bRaw)) continue;

    // Localize region field
    if (field.path === "base.region") {
      if (typeof aRaw === "string") aRaw = getRegionLabel(aRaw, locale) || aRaw;
      if (typeof bRaw === "string") bRaw = getRegionLabel(bRaw, locale) || bRaw;
    }
    // Localize product_type (Chinese label like "重疾险" / "储蓄险" stays as-is)

    // Compute advantage on RAW values (so percentage fields compare as numbers).
    const advantage = getCompareAdvantage(aRaw, bRaw, field) as CompareAdvantage;

    // Format for display. Percent / number / boolean honour field.valueType.
    const aDisplay = formatCompareValue(aRaw, field);
    const bDisplay = formatCompareValue(bRaw, field);

    // Long-text truncation for the expand toggle (display + full).
    const aFull = shouldProvideFull(aRaw) ? String(aRaw) : undefined;
    const bFull = shouldProvideFull(bRaw) ? String(bRaw) : undefined;

    rows.push({
      section: field.section,
      label: field.label,
      aValue: aDisplay,
      bValue: bDisplay,
      aRaw,
      bRaw,
      aFull,
      bFull,
      advantage,
      aAdvantageLabel:
        advantage === "left_better" || advantage === "left_has_data"
          ? getAdvantageLabel(advantage)
          : null,
      bAdvantageLabel:
        advantage === "right_better" || advantage === "right_has_data"
          ? getAdvantageLabel(advantage)
          : null,
      advantageTooltip: getAdvantageTooltip(advantage),
    });
  }
  return rows;
}

/** Decide whether to attach the full (untruncated) raw value for the expand toggle. */
function shouldProvideFull(raw: unknown): boolean {
  if (raw === null || raw === undefined) return false;
  if (typeof raw === "string") {
    return raw.length > LONG_TEXT_MAX_CHARS;
  }
  if (typeof raw === "number" || typeof raw === "boolean") return false;
  const s = formatVectorValue(raw);
  return s.length > LONG_TEXT_MAX_CHARS && !s.includes("…");
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations("compare");
  const tNav = await getTranslations("nav");
  const tGeo = await getTranslations("geo");
  const localeTyped = locale as Locale;

  const comparison = await prisma.comparison.findUnique({
    where: { slug },
    include: {
      productA: { include: { company: true } },
      productB: { include: { company: true } },
    },
  });
  if (!comparison) notFound();

  const productA = translateProduct(
    comparison.productA as Parameters<typeof translateProduct>[0],
    localeTyped
  );
  const productB = translateProduct(
    comparison.productB as Parameters<typeof translateProduct>[0],
    localeTyped
  );

  // Load vectors (cast from v2.0 schema to v2.4 type)
  const vectorA = (await loadProductVector(
    productA.company?.slug || "",
    productA.slug
  )) as unknown as ProductVectorV24 | null;
  const vectorB = (await loadProductVector(
    productB.company?.slug || "",
    productB.slug
  )) as unknown as ProductVectorV24 | null;

  // Determine category
  const catA =
    vectorA?.base?.category ||
    (productA.category === "CRITICAL_ILLNESS" ? "critical_illness" : "savings");
  const catB =
    vectorB?.base?.category ||
    (productB.category === "CRITICAL_ILLNESS" ? "critical_illness" : "savings");

  // Different categories: comparing a critical-illness product against a
  // savings product is not meaningful — the comparison matrix is per-category.
  // Mirror the rule the QuickCompareSelector enforces client-side so direct
  // deep links (manual URL typing, search engine referrals, etc.) get a
  // clear 404 with explanation rather than a confusing half-rendered page.
  if (catA !== catB) {
    notFound();
  }
  const isCI = catA === "critical_illness" || catB === "critical_illness";
  const categoryLabel = formatCategory(catA);

  // Load registry v2.4
  const registry = await loadCompareFieldRegistry();
  if (!registry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">对比表暂不可用</h1>
        <p className="text-gray-600">未能加载 compare-field-registry-v2.18.json。</p>
      </div>
    );
  }

  const fields: CompareField[] = isCI
    ? registry.critical_illness_fields || []
    : registry.savings_fields || [];

  // Build rows: hide empty-on-both-sides
  const rows = buildRows(fields, vectorA, vectorB, localeTyped);

  // Display features for the bottom "产品特色" comparison (max 6 each)
  function getDisplayFeatures(vector: ProductVectorV24 | null): DisplayFeatureClient[] {
    if (!vector) return [];
    return (vector.display_features || [])
      .slice()
      .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
      .slice(0, 6)
      .map((f) => ({
        title: f.title || "",
        summary: f.summary || "",
      }));
  }
  const displayA = getDisplayFeatures(vectorA);
  const displayB = getDisplayFeatures(vectorB);

  // Build GEO blocks (Quick Answer + FAQ + Sources)
  // Sources only reference non-PDF public URLs to avoid exposing the
  // static PDF path; the gated PDF links live in <CompareTable>.
  const faqs = [
    {
      question: tGeo("compare.faqQ1", { a: productA.displayName, b: productB.displayName }),
      answer: tGeo("compare.faqA1", { a: productA.displayName, b: productB.displayName }),
    },
    {
      question: tGeo("compare.faqQ2"),
      answer: tGeo("compare.faqA2"),
    },
    {
      question: tGeo("compare.faqQ3"),
      answer: tGeo("compare.faqA3"),
    },
  ];
  const sources: { label: string; url: string }[] = [];

  // === Internal links: ViewProductCTA + RelatedComparisons ===
  // View CTA: explicit links to each product's detail page with descriptive anchor.
  const viewProfileLabel = t("viewProductProfile");
  const viewCompanyLabel = t("viewCompanyProfile");
  const ctaSides = [
    {
      name: productA.displayName,
      companyName: productA.company?.displayName || "",
      productSlug: productA.slug,
      companySlug: productA.company?.slug || "",
      viewLabel: viewProfileLabel,
    },
    {
      name: productB.displayName,
      companyName: productB.company?.displayName || "",
      productSlug: productB.slug,
      companySlug: productB.company?.slug || "",
      viewLabel: viewProfileLabel,
    },
  ];

  // Related comparisons: 4 other pairs in the same category.
  // We query pairs where productAId or productBId is one of the two
  // products on the current page, AND the pair category is the same.
  // The result is then filtered to exclude the current pair.
  const sameCategory = isCI ? "CRITICAL_ILLNESS" : "SAVINGS";
  const relatedComparisons = await prisma.comparison.findMany({
    where: {
      slug: { not: slug },
      OR: [
        { productAId: productA.id, productB: { category: sameCategory } },
        { productBId: productA.id, productA: { category: sameCategory } },
        { productAId: productB.id, productB: { category: sameCategory } },
        { productBId: productB.id, productA: { category: sameCategory } },
      ],
    },
    include: {
      productA: { include: { company: true } },
      productB: { include: { company: true } },
    },
    take: 12,
  });
  // Deterministic shuffle by slug so the set is stable across requests.
  const shuffled = [...relatedComparisons].sort((x, y) => {
    const s = slug;
    return (x.slug < s ? -1 : x.slug > s ? 1 : 0) - (y.slug < s ? -1 : y.slug > s ? 1 : 0);
  });
  const relatedItems: RelatedComparisonItem[] = shuffled.slice(0, 4).map((c) => {
    // Pick the OTHER product as the link's identity (so the anchor is "Compare {other}...")
    const other = c.productAId === productA.id || c.productAId === productB.id ? c.productB : c.productA;
    const otherTranslated = translateProduct(
      other as Parameters<typeof translateProduct>[0],
      localeTyped
    );
    return {
      slug: c.slug,
      // Pre-resolved anchor template (ICU substitution applied server-side).
      // We cannot pass `other` through the React component as an ICU value
      // because next-intl would try to substitute it at lookup time.
      anchor: t("relatedAnchor", { other: otherTranslated.displayName }),
      otherName: otherTranslated.displayName,
      otherCompanyName: getCompanyName(other.company.slug, localeTyped, other.company.name),
      categoryLabel,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd
        data={buildComparePairJsonLd({
          locale: localeTyped,
          a: {
            name: productA.displayName,
            path: `/product/${productA.slug}`,
            brandName: productA.company?.displayName || "",
            brandPath: `/company/${productA.company?.slug || ""}`,
            category: catA,
            region: vectorA?.base?.region || "",
          },
          b: {
            name: productB.displayName,
            path: `/product/${productB.slug}`,
            brandName: productB.company?.displayName || "",
            brandPath: `/company/${productB.company?.slug || ""}`,
            category: catB,
            region: vectorB?.base?.region || "",
          },
          comparePath: `/compare/${slug}`,
        })}
      />
      <JsonLd data={buildFaqPageJsonLd(faqs)} />
      <GeoBlocks
        quickAnswer={{
          title: tGeo("compare.quickAnswerTitle", { a: productA.displayName, b: productB.displayName }),
          text: tGeo("compare.quickAnswerText", {
            a: productA.displayName,
            b: productB.displayName,
            category: categoryLabel,
          }),
        }}
        faqs={faqs}
        sources={sources}
        methodology={{
          title: tGeo("common.methodologyTitle"),
          text: tGeo("common.vectorVersion"),
        }}
      />
      <Breadcrumb
        locale={localeTyped}
        items={[
          { name: tNav("home"), path: "/" },
          { name: t("title"), path: "/compare" },
          { name: `${productA.displayName} vs ${productB.displayName}`, path: `/compare/${slug}` },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {productA.displayName} <span className="text-gray-400">vs</span>{" "}
          {productB.displayName}
        </h1>
        <p className="text-sm text-gray-500">{categoryLabel}</p>
        {comparison.basicSummary &&
          !/^[A-Za-z0-9 ,.;:'"()&/-]+$/.test(comparison.basicSummary) && (
            <p className="text-gray-600 mt-2">{comparison.basicSummary}</p>
          )}
      </div>

      <CompareTable
        rows={rows}
        displayA={displayA}
        displayB={displayB}
        productAName={productA.displayName}
        productBName={productB.displayName}
        pdfA={vectorA?.base?.local_pdf_path ?? null}
        pdfB={vectorB?.base?.local_pdf_path ?? null}
        pdfProductIdA={vectorA?.base?.slug ?? null}
        pdfProductIdB={vectorB?.base?.slug ?? null}
        viewPdfLabel={getUiLabel("viewPdf", localeTyped)}
        lockedPdfLabel={tGeo("pdfGate.lockedLabel")}
        categoryLabel={categoryLabel}
      />

      <ViewProductCTA
        locale={localeTyped}
        heading={t("exploreEachProduct")}
        sides={ctaSides}
      />

      {relatedItems.length > 0 && (
        <RelatedComparisons
          locale={localeTyped}
          title={t("relatedComparisonsTitle")}
          items={relatedItems}
        />
      )}
    </div>
  );
}
