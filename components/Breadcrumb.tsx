// components/Breadcrumb.tsx
//
// Renders a localized breadcrumb trail and (optionally) the matching
// Schema.org BreadcrumbList JSON-LD block as a <script> tag.
//
// Usage:
//   <Breadcrumb
//     locale={localeTyped}
//     items={[
//       { name: tCommon("home"), path: "/" },
//       { name: t("title"), path: "/products" },
//       { name: productName, path: `/product/${slug}` },
//     ]}
//   />
//
// `locale` is used to:
//   - produce localized absolute URLs in the JSON-LD output
//   - omit the locale prefix for "en" (matches the project's
//     localePrefix: "as-needed" convention)

import Link from "next/link";
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

interface Props {
  locale: Locale;
  items: BreadcrumbItem[];
  /** When true (default), inject the BreadcrumbList JSON-LD <script>. */
  withJsonLd?: boolean;
  /** Optional className override for the visible <nav>. */
  className?: string;
}

export default function Breadcrumb({
  locale,
  items,
  withJsonLd = true,
  className,
}: Props) {
  if (!items.length) return null;

  // Build JSON-LD only when there are ≥ 2 items (per Google, BreadcrumbList
  // with a single item is not useful).
  const jsonLd = withJsonLd && items.length >= 2
    ? buildBreadcrumbJsonLd({ locale, items })
    : null;

  // Localized href builder for the visible links (matches localizedUrl's
  // convention but without needing a server-side import).
  const hrefFor = (path: string): string => {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return locale === "en" ? clean : `/${locale}${clean}`;
  };

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={
          className ??
          "text-sm text-gray-500 mb-6 flex flex-wrap items-center"
        }
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <span key={`${item.path}-${idx}`} className="flex items-center">
              {isLast ? (
                <span className="text-gray-900" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={hrefFor(item.path)}
                  className="hover:text-blue-600"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && <span className="mx-2 text-gray-400">/</span>}
            </span>
          );
        })}
      </nav>
      {jsonLd && (
        <script
          type="application/ld+json"
          // JSON.stringify escapes <, >, &, ensuring the </script> sequence
          // cannot appear in user-controllable strings.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
