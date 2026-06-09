"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CalculatorPage() {
  const t = useTranslations("calculator");
  const [activeTab, setActiveTab] = useState("compound");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>

      <div className="flex gap-2 mb-8 flex-wrap">
        {["compound", "future", "monthly", "retirement", "education"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {t(tab === "compound" ? "compoundInterest" : tab === "future" ? "futureValue" : tab === "monthly" ? "monthlyPayment" : tab === "retirement" ? "retirementPlanning" : "educationFund")}
          </button>
        ))}
      </div>

      {activeTab === "compound" && <CompoundInterest t={t} />}
      {activeTab === "future" && <FutureValue t={t} />}
      {activeTab === "monthly" && <MonthlyPayment t={t} />}
      {activeTab === "retirement" && <RetirementPlanning t={t} />}
      {activeTab === "education" && <EducationFund t={t} />}
    </div>
  );
}

function CompoundInterest({ t }: { t: (key: string) => string }) {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(years);
    setResult(p * Math.pow(1 + r, n));
  };

  return (
    <div className="max-w-lg">
      <div className="space-y-4">
        <InputField label={t("principal")} value={principal} onChange={setPrincipal} />
        <InputField label={t("rate")} value={rate} onChange={setRate} />
        <InputField label={t("years")} value={years} onChange={setYears} />
        <button onClick={calculate} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{t("calculate")}</button>
      </div>
      {result !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600">{t("result")}</p>
          <p className="text-2xl font-bold text-green-700">${result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      )}
    </div>
  );
}

function FutureValue({ t }: { t: (key: string) => string }) {
  const [pv, setPv] = useState("100000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(pv);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(years);
    setResult(p * Math.pow(1 + r, n));
  };

  return (
    <div className="max-w-lg">
      <div className="space-y-4">
        <InputField label={t("principal")} value={pv} onChange={setPv} />
        <InputField label={t("rate")} value={rate} onChange={setRate} />
        <InputField label={t("years")} value={years} onChange={setYears} />
        <button onClick={calculate} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{t("calculate")}</button>
      </div>
      {result !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600">{t("result")}</p>
          <p className="text-2xl font-bold text-green-700">${result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      )}
    </div>
  );
}

function MonthlyPayment({ t }: { t: (key: string) => string }) {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("4");
  const [years, setYears] = useState("20");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    setResult((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  return (
    <div className="max-w-lg">
      <div className="space-y-4">
        <InputField label={t("principal")} value={principal} onChange={setPrincipal} />
        <InputField label={t("rate")} value={rate} onChange={setRate} />
        <InputField label={t("years")} value={years} onChange={setYears} />
        <button onClick={calculate} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{t("calculate")}</button>
      </div>
      {result !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600">{t("result")}</p>
          <p className="text-2xl font-bold text-green-700">${result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      )}
    </div>
  );
}

function RetirementPlanning({ t }: { t: (key: string) => string }) {
  const [monthlyExpense, setMonthlyExpense] = useState("20000");
  const [years, setYears] = useState("30");
  const [rate, setRate] = useState("3");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const expense = parseFloat(monthlyExpense) * 12;
    const r = parseFloat(rate) / 100;
    const n = parseFloat(years);
    const pvAnnuity = expense * ((1 - Math.pow(1 + r, -n)) / r);
    setResult(pvAnnuity);
  };

  return (
    <div className="max-w-lg">
      <div className="space-y-4">
        <InputField label="Monthly Expense" value={monthlyExpense} onChange={setMonthlyExpense} />
        <InputField label={t("years")} value={years} onChange={setYears} />
        <InputField label={t("rate")} value={rate} onChange={setRate} />
        <button onClick={calculate} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{t("calculate")}</button>
      </div>
      {result !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600">Retirement Fund Needed</p>
          <p className="text-2xl font-bold text-green-700">${result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      )}
    </div>
  );
}

function EducationFund({ t }: { t: (key: string) => string }) {
  const [annualCost, setAnnualCost] = useState("200000");
  const [years, setYears] = useState("4");
  const [inflation, setInflation] = useState("3");
  const [untilStart, setUntilStart] = useState("15");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const cost = parseFloat(annualCost);
    const n = parseFloat(years);
    const inf = parseFloat(inflation) / 100;
    const wait = parseFloat(untilStart);
    const futureCost = cost * Math.pow(1 + inf, wait);
    const total = futureCost * n;
    const monthlySaving = total / (wait * 12);
    setResult(monthlySaving);
  };

  return (
    <div className="max-w-lg">
      <div className="space-y-4">
        <InputField label="Annual Tuition (Today)" value={annualCost} onChange={setAnnualCost} />
        <InputField label="Study Years" value={years} onChange={setYears} />
        <InputField label="Education Inflation (%)" value={inflation} onChange={setInflation} />
        <InputField label="Years Until Start" value={untilStart} onChange={setUntilStart} />
        <button onClick={calculate} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{t("calculate")}</button>
      </div>
      {result !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600">Monthly Saving Needed</p>
          <p className="text-2xl font-bold text-green-700">${result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
