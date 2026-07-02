// lib/glossary-i18n.ts
//
// Glossary term translations. The Prisma `GlossaryTerm` model stores only the
// English term + definition (one row per term, language column defaults to
// "en"). To localize without a schema migration, this module holds per-slug
// translations that the page can look up by current locale.
//
// The English term/definition remains the source of truth (so authoring
// remains single-source). Translations are fallbacks — when a slug has no
// entry, the English text is shown. This keeps the page rendering even when
// a translation row is missing or has a typo.

import type { Locale } from "../i18n/config";

export interface GlossaryTermI18n {
  /** Localized term name. */
  name: string;
  /** Localized short definition. */
  description: string;
  /** Optional localized category label. */
  category?: string;
}

/** Map of slug -> { zh-CN, zh-TW } translations. en is taken from DB. */
export const GLOSSARY_TRANSLATIONS: Record<string, { "zh-CN": GlossaryTermI18n; "zh-TW": GlossaryTermI18n }> = {
  "irr": {
    "zh-CN": { name: "内部收益率（IRR）", description: "内部收益率（IRR）是用于估算保险产品在一段时期内年化回报的指标，会同时考虑现金流的时间和金额。", category: "财务" },
    "zh-TW": { name: "內部收益率（IRR）", description: "內部收益率（IRR）是用於估算保險產品在一段時期內年化回報的指標，會同時考慮現金流的時間和金額。", category: "財務" },
  },
  "guaranteed-cash-value": {
    "zh-CN": { name: "保证现金价值", description: "保险公司承诺在退保时支付的最低现金价值。该金额会写入保单合同。", category: "保单价值" },
    "zh-TW": { name: "保證現金價值", description: "保險公司承諾在退保時支付的最低現金價值。該金額會寫入保單合約。", category: "保單價值" },
  },
  "non-guaranteed-bonus": {
    "zh-CN": { name: "非保证红利", description: "保险公司根据其投资组合表现可能派发的额外回报，不保证且会浮动。", category: "保单价值" },
    "zh-TW": { name: "非保證紅利", description: "保險公司根據其投資組合表現可能派發的額外回報，不保證且會浮動。", category: "保單價值" },
  },
  "surrender-value": {
    "zh-CN": { name: "退保价值", description: "在寿险保单到期或被保险人身故之前提前解约时，保险公司向保单持有人支付的金额。", category: "保单价值" },
    "zh-TW": { name: "退保價值", description: "在壽險保單到期或被保險人身故之前提前解約時，保險公司向保單持有人支付的金額。", category: "保單價值" },
  },
  "participating-policy": {
    "zh-CN": { name: "分红保单", description: "一种与保险公司利润共享的寿险保单，通常以派发红利或花红的形式实现。", category: "保单类型" },
    "zh-TW": { name: "分紅保單", description: "一種與保險公司利潤共享的壽險保單，通常以派發紅利或花紅的形式實現。", category: "保單類型" },
  },
  "whole-life-insurance": {
    "zh-CN": { name: "终身寿险", description: "只要持续缴付保费，即可在被保险人整个生命周期内提供保障的寿险产品。", category: "保单类型" },
    "zh-TW": { name: "終身壽險", description: "只要持續繳付保費，即可在被保險人整個生命週期內提供保障的壽險產品。", category: "保單類型" },
  },
  "critical-illness-insurance": {
    "zh-CN": { name: "重大疾病保险", description: "在被保险人确诊合同约定的重大疾病或特定医疗状况时一次性给付保险金的险种。", category: "险种类型" },
    "zh-TW": { name: "重大疾病保險", description: "在被保險人確診合約約定的重大疾病或特定醫療狀況時一次性給付保險金的險種。", category: "險種類型" },
  },
  "savings-insurance": {
    "zh-CN": { name: "储蓄型保险", description: "将保险保障与储蓄或投资功能相结合的寿险产品。", category: "险种类型" },
    "zh-TW": { name: "儲蓄型保險", description: "將保險保障與儲蓄或投資功能相結合的壽險產品。", category: "險種類型" },
  },
  "annuity": {
    "zh-CN": { name: "年金", description: "在约定期间内向个人持续支付固定金额的金融产品，常用于退休规划。", category: "险种类型" },
    "zh-TW": { name: "年金", description: "在約定期間內向個人持續支付固定金額的金融產品，常用於退休規劃。", category: "險種類型" },
  },
  "premium-term": {
    "zh-CN": { name: "缴费期", description: "保单持有人需向保险公司缴付保费的期间。", category: "保单条款" },
    "zh-TW": { name: "繳費期", description: "保單持有人需向保險公司繳付保費的期間。", category: "保單條款" },
  },
  "coverage-term": {
    "zh-CN": { name: "保障期", description: "保单为被保险人提供保障或赔付责任的期间。", category: "保单条款" },
    "zh-TW": { name: "保障期", description: "保單為被保險人提供保障或賠付責任的期間。", category: "保單條款" },
  },
  "policy-loan": {
    "zh-CN": { name: "保单贷款", description: "保单持有人以寿险保单现金价值作为担保向保险公司申请的贷款。", category: "保单特色" },
    "zh-TW": { name: "保單貸款", description: "保單持有人以壽險保單現金價值作為擔保向保險公司申請的貸款。", category: "保單特色" },
  },
  "break-even-year": {
    "zh-CN": { name: "回本年", description: "保单现金价值等于已缴总保费的年份，即保单持有人已收回投入资金。", category: "财务" },
    "zh-TW": { name: "回本年", description: "保單現金價值等於已繳總保費的年份，即保單持有人已收回投入資金。", category: "財務" },
  },
  "dividend": {
    "zh-CN": { name: "红利", description: "保险公司将部分利润分配给分红保单持有人的金额。", category: "保单价值" },
    "zh-TW": { name: "紅利", description: "保險公司將部分利潤分配給分紅保單持有人的金額。", category: "保單價值" },
  },
  "terminal-bonus": {
    "zh-CN": { name: "终期红利", description: "在保单到期、退保或被保险人身故时一次性给付的红利，通常为非保证。", category: "保单价值" },
    "zh-TW": { name: "終期紅利", description: "在保單到期、退保或被保險人身故時一次性給付的紅利，通常為非保證。", category: "保單價值" },
  },
  "reversionary-bonus": {
    "zh-CN": { name: "复归红利", description: "保险公司每年宣告并加入分红保单保证金额的红利。", category: "保单价值" },
    "zh-TW": { name: "復歸紅利", description: "保險公司每年宣告並加入分紅保單保證金額的紅利。", category: "保單價值" },
  },
  "multi-currency-policy": {
    "zh-CN": { name: "多币种保单", description: "允许保单持有人选择多种货币缴付保费和领取保险金的保单。", category: "保单特色" },
    "zh-TW": { name: "多幣別保單", description: "允許保單持有人選擇多種貨幣繳付保費和領取保險金的保單。", category: "保單特色" },
  },
  "legacy-planning": {
    "zh-CN": { name: "遗产规划", description: "通过保险等金融工具组织和安排资产传承给受益人的过程。", category: "规划" },
    "zh-TW": { name: "遺產規劃", description: "通過保險等金融工具組織和安排資產傳承給受益人的過程。", category: "規劃" },
  },
  "retirement-planning": {
    "zh-CN": { name: "退休规划", description: "设定退休收入目标并制定达成方案的过程，通常涉及保险与投资产品。", category: "规划" },
    "zh-TW": { name: "退休規劃", description: "設定退休收入目標並製定達成方案的過程，通常涉及保險與投資產品。", category: "規劃" },
  },
  "education-planning": {
    "zh-CN": { name: "教育规划", description: "为未来教育支出进行储蓄和投资的过程，常使用具有储蓄功能的保险产品。", category: "规划" },
    "zh-TW": { name: "教育規劃", description: "為未來教育支出進行儲蓄和投資的過程，常使用具有儲蓄功能的保險產品。", category: "規劃" },
  },
  "cancer-multiple-claims": {
    "zh-CN": { name: "癌症多次赔付", description: "重大疾病保险中针对癌症相关疾病的多次赔付权益，需符合合同约定的等待期和条件。", category: "保单特色" },
    "zh-TW": { name: "癌症多次理賠", description: "重大疾病保險中針對癌症相關疾病的多次理賠權益，需符合合約約定的等待期和條件。", category: "保單特色" },
  },
  "premium-waiver": {
    "zh-CN": { name: "保费豁免", description: "当保单持有人完全残疾或确诊合同约定的疾病时，豁免未来保费缴纳的权益。", category: "保单特色" },
    "zh-TW": { name: "保費豁免", description: "當保單持有人完全殘疾或確診合約約定的疾病時，豁免未來保費繳納的權益。", category: "保單特色" },
  },
};

/**
 * Look up the localized term fields for a given slug. Falls back to the
 * English text (which the caller passes in) if no translation exists.
 */
export function getGlossaryTerm(
  slug: string,
  locale: Locale,
  fallback: { name: string; description: string; category?: string | null }
): { name: string; description: string; category: string | null } {
  const translations = GLOSSARY_TRANSLATIONS[slug] as
    | Record<string, GlossaryTermI18n | undefined>
    | undefined;
  const entry = translations?.[locale];
  if (!entry) return { name: fallback.name, description: fallback.description, category: fallback.category ?? null };
  return {
    name: entry.name || fallback.name,
    description: entry.description || fallback.description,
    category: entry.category || (fallback.category ?? null),
  };
}
