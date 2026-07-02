// components/RelatedProductsByCategory.tsx
//
// Internal-link section shown at the bottom of /product/[slug] pages.
//
// Lists other products in the SAME category (Critical Illness or Savings),
// excluding the current product and excluding products from the SAME
// company (those are already shown by the existing "Other selected
// products from this company" section).
//
// Anchor text is the localized product name + category label so each
// link has a unique, descriptive anchor.

import Link from "next/link";

export interface RelatedByCategoryItem {
  slug: string;
  name: string;
  companyName: string;
  categoryLabel: string;
}

interface Props {
  title: string;
  items: RelatedByCategoryItem[];
  emptyText?: string;
}

export default function RelatedProductsByCategory({ title, items, emptyText }: Props) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      {items.length === 0 ? (
        emptyText ? <p className="text-sm text-gray-500">{emptyText}</p> : null
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <Link
              key={it.slug}
              href={`/product/${it.slug}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <p className="font-semibold text-gray-900 mb-1">{it.name}</p>
              <p className="text-xs text-gray-500">{it.companyName}</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">
                {it.categoryLabel}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
