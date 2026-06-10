"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Props {
  comparisonId: string;
  productAId: string;
  productBId: string;
}

export default function CompareAIButton({ comparisonId, productAId, productBId }: Props) {
  const { data: session } = useSession();
  const t = useTranslations("compare");
  const tc = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comparisonId, productAId, productBId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t("generateError")); return; }
      setResult(data.aiSummary);
      window.location.reload();
    } catch {
      setError(t("tryAgain"));
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-600 mb-3">{t("signInToGenerate")}</p>
        <Link href="/login" className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          {t("signIn")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}
        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? (
          <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t("generating")}</>
        ) : t("generateAI")}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {result && <p className="mt-2 text-sm text-green-600">{t("generatedSuccess")}</p>}
    </div>
  );
}
