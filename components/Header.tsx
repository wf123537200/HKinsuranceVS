"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = (params?.locale as Locale) || "en";

  const NAV_ITEMS = [
    { href: "/companies", label: t("companies") },
    { href: "/products", label: t("products") },
    { href: "/compare", label: t("compare") },
    { href: "/rankings", label: t("rankings") },
    { href: "/glossary", label: t("glossary") },
    { href: "/discussions", label: t("discussions") },
  ];

  const pathWithoutLocale = pathname.replace(/^\/(en|zh-CN|zh-TW)/, "") || "/";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-blue-700">Insurance</span>
            <span className="text-xl font-bold text-gray-900">Atlas</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="w-64"><SearchBar /></div>

            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-700 px-2 py-1 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {localeNames[currentLocale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {locales.map((locale) => (
                    <Link key={locale} href={`/${locale}${pathWithoutLocale}`}
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${locale === currentLocale ? "text-blue-700 font-medium bg-blue-50" : "text-gray-700"}`}
                      onClick={() => setLangOpen(false)}>
                      {localeNames[locale]}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{session.user?.email}</span>
                <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-red-600">{tc("signOut")}</button>
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
                <p className="px-3 py-1 text-xs text-gray-400">Language / 语言</p>
                {locales.map((locale) => (
                  <Link key={locale} href={`/${locale}${pathWithoutLocale}`}
                    className={`block px-3 py-2 text-sm rounded ${locale === currentLocale ? "text-blue-700 font-medium bg-blue-50" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setMobileOpen(false)}>
                    {localeNames[locale]}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2">
                {session ? (
                  <button onClick={() => signOut()} className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-600">{tc("signOut")}</button>
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
