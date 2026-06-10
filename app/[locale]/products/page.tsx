import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { translateProduct, sortByTranslatedName } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import ProductListWithSearch from "@/components/ProductListWithSearch";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("title"), description: t("description") };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("products");
  const tc = await getTranslations("categories");
  const rawProducts = await prisma.product.findMany({
    orderBy: { displayName: "asc" },
    include: { company: true },
  });

  const products = rawProducts.map((p) => translateProduct(p, locale as Locale)).sort(sortByTranslatedName(locale as Locale));

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

      <ProductListWithSearch products={products} />
    </div>
  );
}
