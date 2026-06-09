import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CompanyLogo from "@/components/CompanyLogo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) return {};
  return {
    title: company.displayName,
    description: company.description ?? `Learn about ${company.displayName} insurance products.`,
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { name: "asc" },
        include: { criticalIllnessDetail: true, savingsDetail: true },
      },
    },
  });

  if (!company) notFound();

  const ciProducts = company.products.filter((p) => p.category === "CRITICAL_ILLNESS");
  const savingsProducts = company.products.filter((p) => p.category === "SAVINGS");

  // Parse tags from JSON string to array
  const parseTags = (tags: unknown): string[] => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") {
      try { return JSON.parse(tags); } catch { return []; }
    }
    return [];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/companies" className="hover:text-blue-600">Companies</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{company.displayName}</span>
      </nav>

      {/* Company Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <CompanyLogo
            name={company.name}
            displayName={company.displayName}
            logoUrl={company.logoUrl}
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

      {/* Company Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Founded</h3>
          <p className="text-gray-900">{company.foundedYear ?? "N/A"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Headquarters</h3>
          <p className="text-gray-900">{company.headquarters ?? "N/A"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Regulator</h3>
          <p className="text-gray-900">{company.regulator ?? "N/A"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">AM Best Rating</h3>
          <p className="text-gray-900">{company.amBestRating ?? "N/A"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Moody&apos;s Rating</h3>
          <p className="text-gray-900">{company.moodysRating ?? "N/A"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">S&P Rating</h3>
          <p className="text-gray-900">{company.spRating ?? "N/A"}</p>
        </div>
      </div>

      {company.website && (
        <div className="mb-8">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Visit Official Website &rarr;
          </a>
        </div>
      )}

      {/* Products */}
      {ciProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Critical Illness Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ciProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{product.displayName}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{product.summary}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {parseTags(product.tags).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {savingsProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Savings Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{product.displayName}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{product.summary}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {parseTags(product.tags).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
