import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { translateProduct, translateCompany } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import { getSiteProductSlugs } from "@/lib/selected-products";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const localeTyped = locale as Locale;
  const t = await getTranslations({ locale, namespace: "search" });
  const q = (sp?.q || "").trim();
  const title = q ? `Search: ${q}` : t("title");
  const description = q
    ? `Search results for "${q}" across insurance products and companies on Policy Vector.`
    : t("description");
  return buildMetadata({
    path: "/search",
    locale: localeTyped,
    title,
    description,
    robots: { index: false, follow: true },
  });
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations("search");
  const { q } = await searchParams;
  const query = q?.trim() || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let companies: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];

  if (query) {
    const q = query.toLowerCase();
    const siteSlugs = await getSiteProductSlugs();
    const productsWithCompany = await prisma.product.findMany({
      where: { slug: { in: siteSlugs } },
      select: { company: { select: { slug: true } } },
    });
    const companySlugs = Array.from(new Set(productsWithCompany.map((p) => p.company.slug)));
    const [rawCompanies, rawProducts] = await Promise.all([
      prisma.company.findMany({
        where: {
          slug: { in: companySlugs },
          OR: [
            { name: { contains: q } },
            { displayName: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 10,
      }),
      prisma.product.findMany({
        where: {
          slug: { in: siteSlugs },
          OR: [
            { name: { contains: q } },
            { displayName: { contains: q } },
            { summary: { contains: q } },
            { tags: { contains: q } },
          ],
        },
        include: { company: true },
        take: 20,
      }),
    ]);

    companies = rawCompanies.map((c) => translateCompany(c, locale as Locale));
    products = rawProducts.map((p) => translateProduct(p, locale as Locale));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>

      {/* Search form */}
      <form className="mb-8" action="/search" method="GET">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search products, companies, tags..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <div>
          {companies.length === 0 && products.length === 0 ? (
            <p className="text-gray-500">No results found for &ldquo;{query}&rdquo;.</p>
          ) : (
            <>
              {companies.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Companies ({companies.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((c) => (
                      <Link
                        key={c.id}
                        href={`/company/${c.slug}`}
                        className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <h3 className="font-semibold text-gray-900">{c.displayName}</h3>
                        <p className="text-xs text-gray-500 mt-1">{c.region}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {products.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Products ({products.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${
                          p.category === "CRITICAL_ILLNESS" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          {p.category === "CRITICAL_ILLNESS" ? "Critical Illness" : "Savings"}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">{p.displayName}</h3>
                        <p className="text-xs text-gray-500 mt-1">{p.company.displayName}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
