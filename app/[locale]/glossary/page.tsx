import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insurance Glossary",
  description: "Understand key insurance terms and concepts.",
};

export default async function GlossaryPage() {
  const t = await getTranslations("glossary");
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { term: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">
        {t("description")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {terms.map((term) => (
          <Link
            key={term.id}
            href={`/glossary/${term.slug}`}
            className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{term.term}</h3>
              {term.category && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {term.category}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{term.definition}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
