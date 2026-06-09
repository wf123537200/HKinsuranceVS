"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { calculateIRR, findBreakEvenYear, totalInvestment, totalReturns } from "@/lib/irr";

interface ReturnRow { id: number; year: string; value: string }

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

const DEFAULT_RETURNS: ReturnRow[] = [
  { id: 1, year: "5", value: "20000" },
  { id: 2, year: "10", value: "40000" },
  { id: 3, year: "20", value: "80000" },
  { id: 4, year: "40", value: "160000" },
];

function buildCashflows(annualPremium: number, paymentYears: number, returnRows: ReturnRow[]): number[] {
  const parsedReturns = returnRows
    .map((row) => ({ year: parseInt(row.year, 10), value: parseFloat(row.value) }))
    .filter((row) => !isNaN(row.year) && !isNaN(row.value));

  const maxYear = Math.max(paymentYears - 1, ...parsedReturns.map((r) => r.year));
  const cashflows = new Array<number>(Math.max(maxYear + 1, 1)).fill(0);
  for (let y = 0; y < paymentYears; y++) cashflows[y] -= annualPremium;
  for (const r of parsedReturns) cashflows[r.year] += r.value;
  return cashflows;
}

export default function IRRCalculatorClient() {
  const t = useTranslations("IRRCalculator");
  const [annualPremium, setAnnualPremium] = useState("20000");
  const [paymentYears, setPaymentYears] = useState("5");
  const [returnRows, setReturnRows] = useState<ReturnRow[]>(DEFAULT_RETURNS);
  const [result, setResult] = useState<{ irr: number | null; breakEven: number | null; invested: number; returned: number } | null>(null);
  const [calcError, setCalcError] = useState("");

  const addReturnRow = useCallback(() => {
    setReturnRows((prev) => {
      const lastYear = prev.length > 0 ? parseInt(prev[prev.length - 1].year, 10) || 0 : 0;
      return [...prev, { id: Date.now(), year: String(lastYear + 5), value: "" }];
    });
  }, []);

  const addReturnRowTop = useCallback(() => {
    setReturnRows((prev) => {
      const firstYear = prev.length > 0 ? parseInt(prev[0].year, 10) || 0 : 0;
      return [{ id: Date.now(), year: String(Math.max(firstYear - 5, 0)), value: "" }, ...prev];
    });
  }, []);

  const removeReturnRow = useCallback((id: number) => {
    setReturnRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const updateReturnYear = useCallback((id: number, year: string) => {
    setReturnRows((prev) => prev.map((row) => (row.id === id ? { ...row, year } : row)));
  }, []);

  const updateReturnValue = useCallback((id: number, value: string) => {
    setReturnRows((prev) => prev.map((row) => (row.id === id ? { ...row, value } : row)));
  }, []);

  const handleCalculate = () => {
    setCalcError("");
    setResult(null);
    const premium = parseFloat(annualPremium);
    const years = parseInt(paymentYears, 10);
    if (isNaN(premium) || premium <= 0) { setCalcError(t("errorPremium")); return; }
    if (isNaN(years) || years <= 0) { setCalcError(t("errorYears")); return; }
    if (returnRows.some((r) => isNaN(parseFloat(r.value)) || isNaN(parseInt(r.year, 10)))) { setCalcError(t("errorFields")); return; }

    const cashflows = buildCashflows(premium, years, returnRows);
    const irr = calculateIRR(cashflows);
    setResult({ irr, breakEven: findBreakEvenYear(cashflows), invested: totalInvestment(cashflows), returned: totalReturns(cashflows) });
  };

  const loadExample = () => {
    setAnnualPremium("20000");
    setPaymentYears("5");
    setReturnRows(DEFAULT_RETURNS);
    setResult(null);
    setCalcError("");
  };

  const premiumValue = parseFloat(annualPremium);
  const yearValue = parseInt(paymentYears, 10);
  const totalInvestedValue = !isNaN(premiumValue) && !isNaN(yearValue) ? premiumValue * yearValue : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">{t("cashFlowInputs")}</h2>
          <button onClick={loadExample} className="text-sm text-blue-600 hover:underline">{t("loadExample")}</button>
        </div>
        <p className="text-sm text-gray-500 mb-5">{t("helpText")}</p>

        <div className="grid gap-4 sm:grid-cols-2 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("annualPremium")}</label>
            <input type="number" min="0" value={annualPremium} onChange={(e) => setAnnualPremium(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder={t("premiumPlaceholder")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("paymentYears")}</label>
            <input type="number" min="1" value={paymentYears} onChange={(e) => setPaymentYears(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder={t("yearsPlaceholder")} />
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          {t("totalInvestment")} <span className="font-semibold text-gray-800">{formatCurrency(totalInvestedValue)}</span>
          {yearValue > 0 ? ` (${formatCurrency(premiumValue || 0)} × ${yearValue} ${t("yearsRange")})` : ""}
        </p>

        <h3 className="text-sm font-semibold text-gray-800 mb-2">{t("cashValues")}</h3>
        <p className="text-sm text-gray-500 mb-4">{t("cashValuesHelp")}</p>

        <button onClick={addReturnRowTop} className="mb-3 text-sm text-blue-600 hover:underline">{t("addYear")}</button>

        <div className="space-y-2">
          {returnRows.map((row) => (
            <div key={row.id} className="flex items-center gap-3">
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-sm text-gray-500">{t("year")}</span>
                <input type="number" value={row.year} onChange={(e) => updateReturnYear(row.id, e.target.value)}
                  className="w-16 border border-gray-200 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <input type="number" value={row.value} onChange={(e) => updateReturnValue(row.id, e.target.value)}
                placeholder={t("cashValue")}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <button onClick={() => removeReturnRow(row.id)} className="text-gray-400 hover:text-red-500 text-xl leading-none" aria-label={t("removeRow")}>×</button>
            </div>
          ))}
        </div>

        <button onClick={addReturnRow} className="mt-3 text-sm text-blue-600 hover:underline">{t("addYear")}</button>

        {calcError && <p className="mt-3 text-sm text-red-600">{calcError}</p>}

        <button onClick={handleCalculate} className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
          {t("calculateIrr")}
        </button>
      </section>

      {result && (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t("results")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label={t("irrLabel")} value={result.irr !== null ? `${(result.irr * 100).toFixed(2)}%` : t("notAvailable")} highlight />
            <StatCard label={t("breakEvenYear")} value={result.breakEven !== null ? `${t("yearPrefix")} ${result.breakEven}` : t("notAvailable")} />
            <StatCard label={t("totalInvested")} value={formatCurrency(result.invested)} />
            <StatCard label={t("totalReturns")} value={formatCurrency(result.returned)} />
          </div>
          {result.irr === null && <p className="mt-4 text-sm text-amber-600">{t("errorIrr")}</p>}
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 text-center ${highlight ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-100"}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? "text-blue-700" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
