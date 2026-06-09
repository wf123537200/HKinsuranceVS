import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discussions",
  description: "Community discussions about insurance products.",
};

export default async function DiscussionsPage() {
  const discussions = await prisma.discussion.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { author: true, _count: { select: { comments: true } } },
    take: 50,
  });

  const categories = [
    { value: "PRODUCT_DISCUSSION", label: "Product Discussions" },
    { value: "CRITICAL_ILLNESS", label: "Critical Illness" },
    { value: "SAVINGS", label: "Savings Insurance" },
    { value: "COMPARISON", label: "Product Comparisons" },
    { value: "DATA_CORRECTION", label: "Data Correction" },
    { value: "PROFESSIONALS", label: "Insurance Professionals" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussions</h1>
          <p className="text-gray-600">Community discussions about insurance products.</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <span
            key={cat.value}
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            {cat.label}
          </span>
        ))}
      </div>

      {/* Discussions List */}
      {discussions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No discussions yet. Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Link
              key={discussion.id}
              href={`/discussions/${discussion.id}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{discussion.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{discussion.content}</p>
                </div>
                <span className="shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 ml-4">
                  {discussion.category.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <span>{discussion.author.name ?? "Anonymous"}</span>
                <span>{discussion._count.comments} comments</span>
                <span>{discussion.viewCount} views</span>
                <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
