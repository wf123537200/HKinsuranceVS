import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Insurance Products",
  description: "Browse all insurance products from Hong Kong and Mainland China.",
};

export default async function ProductsPage() {
  const t = await getTranslations("products");
  const tc = await getTranslations("categories");
  const products = await prisma.product.findMany({
    orderBy: { displayName: "asc" },
    include: { company: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">
        {t("description")}
      </p>

      <div className="flex gap-3 mb-6">
        <Link href="/products/critical-illness" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
          {tc("criticalIllness")}
        </Link>
        <Link href="/products/savings" className="px-4 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
          {tc("savings")}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                product.category === "CRITICAL_ILLNESS"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {product.category === "CRITICAL_ILLNESS" ? "Critical Illness" : "Savings"}
              </span>
              <span className="text-xs text-gray-400">{product.region}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{product.displayName}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.company.displayName}</p>
            <p className="text-sm text-gray-400 line-clamp-2">{product.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
