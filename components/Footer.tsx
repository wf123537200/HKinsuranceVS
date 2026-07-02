"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">{t("products")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products/critical-illness" className="hover:text-white transition-colors">{t("criticalIllness")}</Link></li>
              <li><Link href="/products/savings" className="hover:text-white transition-colors">{t("savingsInsurance")}</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">{t("productComparison")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t("companies")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/companies" className="hover:text-white transition-colors">{t("allCompanies")}</Link></li>
              <li><Link href="/companies?region=hong-kong" className="hover:text-white transition-colors">{t("hongKong")}</Link></li>
              <li><Link href="/companies?region=mainland-china" className="hover:text-white transition-colors">{t("mainlandChina")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t("resources")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/glossary" className="hover:text-white transition-colors">{t("glossary")}</Link></li>
              <li><Link href="/calculator" className="hover:text-white transition-colors">{t("calculator")}</Link></li>
              <li><Link href="/sitemap" className="hover:text-white transition-colors">{t("sitemap")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t("contactUs")}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:contact@policy-vector.com" className="hover:text-white transition-colors">contact@policy-vector.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-xs text-gray-500 leading-relaxed">{t("disclaimer")}</p>
        </div>

        <div className="mt-8 text-center text-xs text-gray-600">
          {t("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
