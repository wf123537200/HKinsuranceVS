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
              <li><Link href="/rankings" className="hover:text-white transition-colors">{t("rankings")}</Link></li>
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
              <li><Link href="/discussions" className="hover:text-white transition-colors">{t("discussions")}</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">{t("search")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t("account")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">{t("signIn")}</Link></li>
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
