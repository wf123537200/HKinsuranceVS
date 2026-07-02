import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getGlossaryTerm } from "@/lib/glossary-i18n";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const localeTyped = locale as Locale;
  const term = await prisma.glossaryTerm.findUnique({ where: { slug } });
  if (!term) {
    return buildMetadata({
      path: `/glossary/${slug}`,
      locale: localeTyped,
      title: "Glossary Term Not Found",
      description: "The glossary term you are looking for is not available on Policy Vector.",
      robots: { index: false, follow: false },
    });
  }
  const i18n = getGlossaryTerm(term.slug, localeTyped, {
    name: term.term,
    description: term.definition,
    category: term.category,
  });
  return buildMetadata({
    path: `/glossary/${slug}`,
    locale: localeTyped,
    title: `${i18n.name} - Insurance Glossary`,
    description: i18n.description.slice(0, 200).replace(/\s+/g, " ").trim(),
  });
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug, locale } = await params;
  const localeTyped = locale as Locale;
  const term = await prisma.glossaryTerm.findUnique({ where: { slug } });

  if (!term) notFound();

  const i18n = getGlossaryTerm(term.slug, localeTyped, {
    name: term.term,
    description: term.definition,
    category: term.category,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/glossary" className="hover:text-blue-600">Glossary</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{i18n.name}</span>
      </nav>

      <div className="mb-4">
        {i18n.category && (
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
            {i18n.category}
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{i18n.name}</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-700 leading-relaxed">{i18n.description}</p>
      </div>
    </div>
  );
}
