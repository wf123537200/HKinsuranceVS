import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "储蓄险产品排名 - 暂不可用",
  robots: { index: false, follow: false },
};

export default function RankingsSavingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
        Savings Insurance Rankings
      </p>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">储蓄险产品排名 - 暂不可用</h1>
      <p className="text-gray-600 mb-6">
        该功能正在调整中，暂未上线。请通过
        <a href="/products/savings" className="text-blue-600 hover:text-blue-700 mx-1">
          储蓄险列表
        </a>
        /
        <a href="/compare/savings" className="text-blue-600 hover:text-blue-700 mx-1">
          储蓄险对比
        </a>
        浏览。
      </p>
      <div className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
        已隐藏
      </div>
    </div>
  );
}
