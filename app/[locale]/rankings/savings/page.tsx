import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { translateProduct } from "@/lib/translations";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return {
    title: "Savings Insurance Rankings",
    description: "Rankings of savings insurance products.",
  };
}

export default async function SavingsRankingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const rawProducts = await prisma.product.findMany({
    where: { category: "SAVINGS" },
    orderBy: { viewCount: "desc" },
    include: { company: true, savingsDetail: true },
  });

  const products = rawProducts.map((p) => translateProduct(p, locale as Locale));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/rankings" className="hover:text-blue-600">Rankings</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Savings</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Insurance Rankings</h1>
      <p className="text-gray-600 mb-8">Rankings of savings insurance products by views.</p>

      <div className="space-y-3">
        {products.map((product, idx) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
          >
            <span className="text-2xl font-bold text-gray-300 w-8">{idx + 1}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{product.displayName}</h3>
              <p className="text-sm text-gray-500">{product.company.displayName} · {product.region}</p>
              {product.savingsDetail?.illustratedIrr && (
                <p className="text-xs text-gray-400">Illustrated IRR: {product.savingsDetail.illustratedIrr}%</p>
              )}
            </div>
            <span className="text-sm text-gray-400">{product.viewCount} views</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
