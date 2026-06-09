import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SitemapPage() {
  const t = await getTranslations("sitemap");
  const tc = await getTranslations("common");

  const [companies, products] = await Promise.all([
    prisma.company.findMany({ orderBy: { displayName: "asc" } }),
    prisma.product.findMany({ orderBy: { displayName: "asc" }, include: { company: true } }),
  ]);

  const staticPages = [
    { href: "/", label: "Home" },
    { href: "/companies", label: "Companies" },
    { href: "/products", label: "Products" },
    { href: "/products/critical-illness", label: "Critical Illness" },
    { href: "/products/savings", label: "Savings" },
    { href: "/compare", label: "Compare" },
    { href: "/rankings", label: "Rankings" },
    { href: "/rankings/critical-illness", label: "CI Rankings" },
    { href: "/rankings/savings", label: "Savings Rankings" },
    { href: "/calculator", label: "Calculator" },
    { href: "/glossary", label: "Glossary" },
    { href: "/search", label: "Search" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Static Pages */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">{t("pages")}</h2>
          <ul className="space-y-2">
            {staticPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Companies */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Companies</h2>
          <ul className="space-y-2">
            {companies.map((co) => (
              <li key={co.id}>
                <Link href={`/company/${co.slug}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  {co.displayName}
                </Link>
                <span className="text-xs text-gray-400 ml-2">{co.region}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Products */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Products</h2>
          <ul className="space-y-2">
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/product/${p.slug}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  {p.displayName}
                </Link>
                <span className="text-xs text-gray-400 ml-2">{p.company.displayName}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
