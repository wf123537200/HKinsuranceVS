// components/RelatedComparisons.tsx
//
// Internal-link section shown at the bottom of /compare/[slug] pages.
//
// Renders up to N (default 4) other comparisons in the same category,
// excluding the current pair. Each link uses a pre-rendered localized
// anchor (with the "other" product name substituted server-side) so
// search engines see unique, descriptive anchors across the site.
//
// Server component. The page passes a pre-fetched list so we don't
// re-query inside the component.

import Link from "next/link";
import type { Locale } from "@/i18n/config";

export interface RelatedComparisonItem {
  slug: string;
  /** Pre-rendered localized anchor text (with {other} already substituted). */
  anchor: string;
  /** Localized display name of the OTHER product. */
  otherName: string;
  /** Localized display name of the OTHER company's name. */
  otherCompanyName: string;
  /** Localized category label. */
  categoryLabel: string;
}

interface Props {
  locale: Locale;
  title: string;
  items: RelatedComparisonItem[];
}

export default function RelatedComparisons({ locale, items, title }: Props) {
  if (!items.length) return null;
  const prefix = locale === "en" ? "" : `/${locale}`;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <Link
            key={it.slug}
            href={`${prefix}/compare/${it.slug}`}
            className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <p className="font-semibold text-gray-900">{it.anchor}</p>
            <p className="text-xs text-gray-500 mt-1">
              {it.otherCompanyName} · {it.categoryLabel}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
