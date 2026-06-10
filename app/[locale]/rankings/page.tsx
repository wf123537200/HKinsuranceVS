import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { translateProduct } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import RankingListWithSearch from "@/components/RankingListWithSearch";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rankings" });
  return { title: t("title"), description: t("description") };
}

export default async function RankingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("rankings");
  const [rawViewed, rawCompared] = await Promise.all([
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

  const mostViewed = rawViewed.map((p) => translateProduct(p, locale as Locale));
  const mostCompared = rawCompared.map((p) => translateProduct(p, locale as Locale));

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
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("mostViewed")}</h2>
          <RankingListWithSearch products={mostViewed} countField="viewCount" countLabel={t("views")} />
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("mostCompared")}</h2>
          <RankingListWithSearch products={mostCompared} countField="compareCount" countLabel={t("compares")} />
        </section>
      </div>
    </div>
  );
}
