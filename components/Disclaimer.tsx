"use client";

import { useTranslations } from "next-intl";

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("footer");

  if (compact) {
    return (
      <p className="text-xs text-gray-500 leading-relaxed">
        {t("disclaimer")}
      </p>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-600 leading-relaxed">
        <strong>{t("disclaimerLabel")}</strong> {t("disclaimer")}
      </p>
    </div>
  );
}
