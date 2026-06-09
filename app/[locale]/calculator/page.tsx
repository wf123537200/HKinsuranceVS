import { getTranslations, setRequestLocale } from "next-intl/server";
import IRRCalculatorClient from "@/components/IRRCalculatorClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "IRRPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: { canonical: `/${locale}/calculator` },
    keywords: ["irr calculator", "insurance irr calculator", "policy irr calculator", "cash value life insurance return calculator", "保险 irr 计算器", "保险 irr 計算器"],
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("IRRPage");
  const ts = await getTranslations("IRRSEO");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: t("title"),
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: t("subtitle"),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: ts("faqQ1"), acceptedAnswer: { "@type": "Answer", text: ts("faqA1") } },
          { "@type": "Question", name: ts("faqQ2"), acceptedAnswer: { "@type": "Answer", text: ts("faqA2") } },
          { "@type": "Question", name: ts("faqQ3"), acceptedAnswer: { "@type": "Answer", text: ts("faqA3") } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* GEO: Quick Answer (hidden, for AI crawlers) */}
      <section className="sr-only">
        <h2>{ts("quickAnswerTitle")}</h2>
        <p>{ts("quickAnswerText")}</p>
      </section>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <IRRCalculatorClient />

      {/* SEO Content */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{ts("seoH2")}</h2>
        <p className="text-gray-600 leading-relaxed mb-4">{ts("seoParagraph1")}</p>
        <p className="text-gray-600 leading-relaxed mb-4">{ts("seoParagraph2")}</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">{ts("faqTitle")}</h3>
        <dl className="space-y-4">
          <div><dt className="font-medium text-gray-900">{ts("faqQ1")}</dt><dd className="text-gray-600 mt-1">{ts("faqA1")}</dd></div>
          <div><dt className="font-medium text-gray-900">{ts("faqQ2")}</dt><dd className="text-gray-600 mt-1">{ts("faqA2")}</dd></div>
          <div><dt className="font-medium text-gray-900">{ts("faqQ3")}</dt><dd className="text-gray-600 mt-1">{ts("faqA3")}</dd></div>
        </dl>
      </section>
    </>
  );
}
