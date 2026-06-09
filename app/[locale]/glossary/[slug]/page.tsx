import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = await prisma.glossaryTerm.findUnique({ where: { slug } });
  if (!term) return {};
  return {
    title: `${term.term} - Insurance Glossary`,
    description: term.definition,
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = await prisma.glossaryTerm.findUnique({ where: { slug } });

  if (!term) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/glossary" className="hover:text-blue-600">Glossary</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{term.term}</span>
      </nav>

      <div className="mb-4">
        {term.category && (
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
            {term.category}
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{term.term}</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-700 leading-relaxed">{term.definition}</p>
      </div>
    </div>
  );
}
