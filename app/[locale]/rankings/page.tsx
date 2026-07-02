import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/rankings",
  locale: "en",
  title: "Insurance Product Rankings",
  description: "Explore insurance product rankings on Policy Vector.",
  robots: { index: false, follow: false },
});

export default function RankingsIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
        Product Rankings
      </p>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">产品排名 - 暂不可用</h1>
      <p className="text-gray-600 mb-6">
        该功能正在调整中，暂未上线。请通过
        <a href="/products" className="text-blue-600 hover:text-blue-700 mx-1">
          全部产品
        </a>
        /
        <a href="/compare" className="text-blue-600 hover:text-blue-700 mx-1">
          对比
        </a>
        浏览。
      </p>
      <div className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
        已隐藏
      </div>
    </div>
  );
}
