"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import SearchBar from "./SearchBar";
import { locales, localeNames, type Locale, defaultLocale } from "@/i18n/config";
import { useSupabaseSession } from "./SupabaseSessionProvider";
import { getSupabaseBrowser } from "@/lib/supabase/client";

// next-intl writes its detected locale to this cookie. To make a manual
// language switch persist, we must update this cookie on click — otherwise
// the middleware will detect Accept-Language on the next request and
// redirect back to the previous locale.
const LOCALE_COOKIE = "NEXT_LOCALE";

function setLocaleCookie(value: string) {
  // 1 year, lax, root path. Same as next-intl's own middleware writes.
  document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export default function Header() {
  const { email: sessionEmail } = useSupabaseSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tCommon = useTranslations("common");
  const brandName = tCommon("siteName");
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = (params?.locale as Locale) || "en";

  // Switching language must do two things in order:
  //   1. Set the locale cookie. If we just navigated, next-intl would
  //      re-detect Accept-Language on the next request and overwrite.
  //   2. Navigate to a URL with an explicit locale prefix so the page
  //      always sees `params.locale`. With `localePrefix: "as-needed"`
  //      and `defaultLocale="en"`, next-intl canonicalizes prefixed
  //      URLs to the unprefixed form (e.g. /en/products → /products).
  //      For the locale root we explicitly keep `/en` (since `/` 404s
  //      under our setup) and rely on the in-app page rather than the
  //      middleware redirect.
  function switchLocale(target: Locale) {
    setLocaleCookie(target);
    const url =
      target === defaultLocale
        ? `/${defaultLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`
        : `/${target}${pathWithoutLocale}`;
    setLangOpen(false);
    setMobileOpen(false);
    startTransition(() => {
      router.push(url);
    });
  }

  const NAV_ITEMS = [
    { href: "/companies", label: t("companies") },
    { href: "/products", label: t("products") },
    { href: "/compare", label: t("compare") },
    { href: "/calculator", label: t("calculator") },
    { href: "/glossary", label: t("glossary") },
  ];

  const langLabel = t("language");

  const pathWithoutLocale = pathname.replace(/^\/(en|zh-CN|zh-TW)/, "") || "/";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={brandName}>
            <picture>
              {/* Prefer the SVG mark at small sizes for crispness on HiDPI. */}
              <img
                src="/logos/policy-vector-logo.svg"
                alt={brandName}
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg"
                loading="eager"
              />
            </picture>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">{brandName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="w-64" style={{ display: "none" }}><SearchBar /></div>

            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-700 px-2 py-1 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {localeNames[currentLocale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {locales.map((locale) => {
                    // With next-intl's localePrefix: "as-needed" and
                    // defaultLocale="en", the canonical URL for English
                    // is the unprefixed pathname (e.g. /products). Other
                    // locales keep their prefix.
                    const target =
                      locale === defaultLocale
                        ? pathWithoutLocale
                        : `/${locale}${pathWithoutLocale}`;
                    return (
                      <Link
                        key={locale}
                        href={target}
                        prefetch={false}
                        className={`block px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${locale === currentLocale ? "text-blue-700 font-medium bg-blue-50" : "text-gray-700"}`}
                        onClick={(e) => {
                          // We navigate manually so the locale cookie is
                          // set *before* the next request hits the
                          // middleware. If <Link> navigated first, the
                          // middleware could still see the old cookie
                          // and bounce the user back to the previous
                          // locale (ERR_TOO_MANY_REDIRECTS).
                          e.preventDefault();
                          switchLocale(locale);
                        }}>
                        {localeNames[locale]}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {sessionEmail ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{sessionEmail}</span>
                <button
                  type="button"
                  onClick={async () => {
                    const supabase = getSupabaseBrowser();
                    await supabase?.auth.signOut();
                  }}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  {tc("signOut")}
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium text-blue-700 hover:text-blue-800">{tc("signIn")}</Link>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-700 hover:bg-gray-50 rounded" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="px-3 py-1 text-xs text-gray-400">{langLabel}</p>
                {locales.map((locale) => {
                  // See comment in the desktop selector above — never
                  // stamp "/" + the default locale; use the bare pathname.
                  const target =
                    locale === defaultLocale
                      ? pathWithoutLocale
                      : `/${locale}${pathWithoutLocale}`;
                  return (
                    <Link
                      key={locale}
                      href={target}
                      prefetch={false}
                      className={`block px-3 py-2 text-sm rounded ${locale === currentLocale ? "text-blue-700 font-medium bg-blue-50" : "text-gray-600 hover:bg-gray-50"}`}
                      onClick={(e) => {
                        // See switchLocale() — we navigate manually so
                        // the cookie is updated before middleware reads it.
                        e.preventDefault();
                        switchLocale(locale);
                      }}>
                      {localeNames[locale]}
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2">
                {sessionEmail ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const supabase = getSupabaseBrowser();
                      await supabase?.auth.signOut();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-600"
                  >
                    {tc("signOut")}
                  </button>
                ) : (
                  <Link href="/login" className="block px-3 py-2 text-sm font-medium text-blue-700" onClick={() => setMobileOpen(false)}>{tc("signIn")}</Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
