import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const localeTyped = locale as Locale;
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) {
    return buildMetadata({
      path: `/discussions/${id}`,
      locale: localeTyped,
      title: "Discussion Not Found",
      description: "The discussion you are looking for is not available on Policy Vector.",
      robots: { index: false, follow: false },
    });
  }
  return buildMetadata({
    path: `/discussions/${id}`,
    locale: localeTyped,
    title: discussion.title,
    description: discussion.content.slice(0, 200).replace(/\s+/g, " ").trim(),
    ogType: "article",
  });
}

export default async function DiscussionDetailPage({ params }: Props) {
  const { id } = await params;
  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!discussion) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/discussions" className="hover:text-blue-600">Discussions</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{discussion.title}</span>
      </nav>

      <article className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
            {discussion.category.replace(/_/g, " ")}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{discussion.title}</h1>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="whitespace-pre-line">{discussion.content}</p>
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <span>{discussion.author.name ?? "Anonymous"}</span>
          <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
          <span>{discussion.viewCount} views</span>
        </div>
      </article>

      {/* Comments */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Comments ({discussion.comments.length})
        </h2>
        {discussion.comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {discussion.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-line">{comment.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{comment.author.name ?? "Anonymous"}</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
