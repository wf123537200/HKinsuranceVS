import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { buildDefinedTermSetJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
import { getGlossaryTerm } from "@/lib/glossary-i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    path: "/glossary",
    locale: locale as Locale,
    title: "Insurance Glossary",
    description: "Insurance terminology explained for Hong Kong and Mainland China insurance products on Policy Vector.",
  });
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const t = await getTranslations("glossary");
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { term: "asc" },
  });
  const localized = terms.map((term) => ({
    ...term,
    i18n: getGlossaryTerm(term.slug, localeTyped, {
      name: term.term,
      description: term.definition,
      category: term.category,
    }),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd
        data={buildDefinedTermSetJsonLd({
          locale: localeTyped,
          setName: t("title"),
          setDescription: t("description"),
          terms: localized.map((term) => ({
            name: term.i18n.name,
            path: `/glossary/${term.slug}`,
            description: term.i18n.description,
          })),
        })}
      />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">
        {t("description")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localized.map((term) => (
          <Link
            key={term.id}
            href={`/glossary/${term.slug}`}
            className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{term.i18n.name}</h3>
              {term.i18n.category && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {term.i18n.category}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{term.i18n.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
