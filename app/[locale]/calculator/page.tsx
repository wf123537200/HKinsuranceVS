"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CalculatorPage() {
  const t = useTranslations("calculator");

  const [premium, setPremium] = useState("100000");
  const [premiumYears, setPremiumYears] = useState("5");
  const [totalYears, setTotalYears] = useState("20");
  const [cashFlows, setCashFlows] = useState("");
  const [irr, setIrr] = useState<number | null>(null);
  const [npvData, setNpvData] = useState<{ year: number; cf: number; pv: number }[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);

  const calculateIRR = () => {
    const p = parseFloat(premium);
    const py = parseInt(premiumYears);
    const ty = parseInt(totalYears);
    if (isNaN(p) || isNaN(py) || isNaN(ty) || p <= 0 || py <= 0 || ty <= 0) return;

    const flows: number[] = new Array(ty + 1).fill(0);
    for (let i = 1; i <= py; i++) flows[i] = -p;

    if (cashFlows.trim()) {
      for (const entry of cashFlows.split(",").map((s) => s.trim()).filter(Boolean)) {
        const parts = entry.split(":").map((s) => s.trim());
        if (parts.length === 2) {
          const y = parseInt(parts[0]), a = parseFloat(parts[1]);
          if (!isNaN(y) && !isNaN(a) && y >= 0 && y <= ty) flows[y] += a;
        } else {
          const a = parseFloat(parts[0]);
          if (!isNaN(a)) flows[ty] += a;
        }
      }
    }

    let guess = 0.03;
    for (let iter = 0; iter < 1000; iter++) {
      let npv = 0, dnpv = 0;
      for (let i = 0; i <= ty; i++) {
        const d = Math.pow(1 + guess, i);
        npv += flows[i] / d;
        if (i > 0) dnpv -= (i * flows[i]) / (d * (1 + guess));
      }
      if (Math.abs(dnpv) < 1e-12) break;
      const next = guess - npv / dnpv;
      if (Math.abs(next - guess) < 1e-10) { guess = next; break; }
      guess = next;
    }

    setIrr(guess * 100);
    const bd: { year: number; cf: number; pv: number }[] = [];
    let cp = 0, cr = 0;
    for (let i = 0; i <= ty; i++) {
      if (flows[i] !== 0) bd.push({ year: i, cf: flows[i], pv: flows[i] / Math.pow(1 + guess, i) });
      if (flows[i] < 0) cp += flows[i];
      if (flows[i] > 0) cr += flows[i];
    }
    setNpvData(bd);
    setTotalPaid(Math.abs(cp));
    setTotalReceived(cr);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <InputField label={t("annualPremium")} value={premium} onChange={setPremium} />
          <InputField label={t("premiumYears")} value={premiumYears} onChange={setPremiumYears} />
          <InputField label={t("totalYears")} value={totalYears} onChange={setTotalYears} />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("cashFlows")}</label>
          <input type="text" value={cashFlows} onChange={(e) => setCashFlows(e.target.value)}
            placeholder={t("cashFlowsHint")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <button onClick={calculateIRR}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          {t("calculate")}
        </button>
      </div>

      {irr !== null && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">{t("irr")}</p>
            <p className="text-4xl font-bold text-green-700">{irr.toFixed(4)}%</p>
            <p className="text-sm text-gray-500 mt-2">{t("annualizedReturn")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">{t("totalPaid")}</p>
              <p className="text-xl font-bold text-red-600">${totalPaid.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">{t("totalReceived")}</p>
              <p className="text-xl font-bold text-green-600">${totalReceived.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          {npvData.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead><tr className="bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-500">{t("year")}</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-500">{t("cashFlow")}</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-500">{t("presentValue")}</th>
                </tr></thead>
                <tbody>{npvData.map((r, i) => (
                  <tr key={r.year} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 text-sm">{r.year}</td>
                    <td className={`p-3 text-sm text-right font-medium ${r.cf < 0 ? "text-red-600" : "text-green-600"}`}>${r.cf.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                    <td className="p-3 text-sm text-right text-gray-700">${r.pv.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{t("irrExplanation")}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {t("irrDesc1")}</li>
              <li>• {t("irrDesc2")}</li>
              <li>• {t("irrDesc3")}</li>
              <li>• {t("irrDesc4")}</li>
              <li>• {t("irrDesc5")}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
  );
}
