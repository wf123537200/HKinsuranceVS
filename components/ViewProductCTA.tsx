// components/ViewProductCTA.tsx
//
// Inline CTA block on /compare/[slug] pages linking to each product's
// detail page. Provides explicit, descriptive anchor text rather than
// relying on breadcrumb-only navigation. Helps crawlers discover the
// product-detail pages from compare pages.

import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface Props {
  locale: Locale;
  /** Localized heading, e.g. "Explore each product". */
  heading: string;
  /** Two entries (A and B) with localized labels and product detail links. */
  sides: Array<{
    name: string;
    companyName: string;
    productSlug: string;
    companySlug: string;
    /** Localized "View full profile" / "查看完整档案" anchor text. */
    viewLabel: string;
  }>;
}

export default function ViewProductCTA({ locale, heading, sides }: Props) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const localize = (path: string) => `${prefix}${path}`;
  return (
    <section className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sides.map((s) => (
          <div key={s.productSlug} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{s.companyName}</p>
            <p className="font-semibold text-gray-900 mb-3">{s.name}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={localize(`/product/${s.productSlug}`)}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                {s.viewLabel} &rarr;
              </Link>
              {s.companySlug && (
                <Link
                  href={localize(`/company/${s.companySlug}`)}
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  {s.companyName} &rarr;
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
