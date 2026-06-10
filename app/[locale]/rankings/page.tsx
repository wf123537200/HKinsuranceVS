import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rankings" });
  return { title: t("title"), description: t("description") };
}

export default async function RankingsPage() {
  const t = await getTranslations("rankings");
  const [mostViewed, mostCompared] = await Promise.all([
    prisma.product.findMany({
      orderBy: { viewCount: "desc" },
      take: 10,
      include: { company: true },
    }),
    prisma.product.findMany({
      orderBy: { compareCount: "desc" },
      take: 10,
      include: { company: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>

      <div className="flex gap-3 mb-8">
        <Link href="/rankings/critical-illness" className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
          {t("criticalIllnessTitle")}
        </Link>
        <Link href="/rankings/savings" className="px-4 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
          {t("savingsTitle")}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Viewed */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("mostViewed")}</h2>
          <div className="space-y-3">
            {mostViewed.map((product, idx) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
              >
                <span className="text-2xl font-bold text-gray-300 w-8">{idx + 1}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{product.displayName}</h3>
                  <p className="text-xs text-gray-500">{product.company.displayName} · {product.region}</p>
                </div>
                <span className="text-sm text-gray-400">{product.viewCount} {t("views")}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Most Compared */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("mostCompared")}</h2>
          <div className="space-y-3">
            {mostCompared.map((product, idx) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
              >
                <span className="text-2xl font-bold text-gray-300 w-8">{idx + 1}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{product.displayName}</h3>
                  <p className="text-xs text-gray-500">{product.company.displayName} · {product.region}</p>
                </div>
                <span className="text-sm text-gray-400">{product.compareCount} {t("compares")}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
