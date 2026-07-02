// ProductVector v2.4 i18n layer.
// Project already uses next-intl with en/zh-CN/zh-TW. The task spec mentions zh-HK
// but we keep the existing locale codes to avoid breaking routes. zh-TW is treated
// as the "Traditional Chinese" target and is reused for zh-HK.
//
// This module provides:
//   1. Product name translations (zh-CN, zh-TW, en) keyed by slug
//   2. Company name translations keyed by company slug
//   3. Category label translations
//   4. Compare-field label translations
//   5. Feature tag translations
//   6. SEO/GEO copy templates
//
// Source of truth for product names is the vector's own base.product_name (now fixed
// from mojibake) for zh-CN. zh-TW and en use the table below. Falls back to the
// vector's own field when a translation is missing.

import type { Locale } from "../i18n/config";

// Product name translation table. Each entry has zh-CN, zh-TW (=zh-HK), en.
// Source: official PDF + 10Life + Wikipedia product lists + company.hk sites.
// Slugs that are already correct in base.product_name will still get a stable
// translation here so future renames don't break UI.
export const PRODUCT_NAMES: Record<string, { "zh-CN": string; "zh-TW": string; en: string }> = {
  "aia-essence-on-your-side": {
    "zh-CN": "「简致·爱伴航」保险计划",
    "zh-TW": "「簡致·愛伴航」保險計劃",
    en: "Essence – On Your Side Insurance Plan",
  },
  "aia-globalflexi-savings": {
    "zh-CN": "环宇盈活储蓄保险计划",
    "zh-TW": "環宇盈活儲蓄保險計劃",
    en: "AIA GlobalFlexi Savings Insurance Plan",
  },
  "aia-on-your-side-2": {
    "zh-CN": "「爱伴航」保险计划 2",
    "zh-TW": "「愛伴航」保險計劃 2",
    en: "On Your Side Insurance Plan 2",
  },
  "axa-loving-care-ci-enhanced": {
    "zh-CN": "安盛爱唯守危疾保障（升级版）",
    "zh-TW": "AXA安盛愛唯守危疾保障（升級版）",
    en: "AXA Loving Care CI (Enhanced)",
  },
  "axa-wealth-advance-savings-ii-ultimate": {
    "zh-CN": "安进储蓄系列 II - 跃进（至尊）",
    "zh-TW": "安進儲蓄系列 II - 躍進（至尊）",
    en: "AXA Wealth Advance Savings II – Ultimate",
  },
  "cpic-evergreen-whole-life": {
    "zh-CN": "太保鑫相伴（至尊版）终身寿险",
    "zh-TW": "太保鑫相伴（至尊版）終身壽險",
    en: "CPIC Evergreen Whole Life Insurance Plan (Ultimate)",
  },
  "cpic-jinshengwuyou-2024-kids": {
    "zh-CN": "太保金生无忧 2024（少儿版）重大疾病保险",
    "zh-TW": "太保金生無憂 2024（少兒版）重大疾病保險",
    en: "CPIC Jin Sheng Wu You 2024 (Kids) Critical Illness Insurance",
  },
  "cpic-jinshengwuyou-kids": {
    "zh-CN": "太保金生无忧 2024（少儿版）重大疾病保险",
    "zh-TW": "太保金生無憂 2024（少兒版）重大疾病保險",
    en: "CPIC Jin Sheng Wu You 2024 (Kids) Critical Illness Insurance",
  },
  "cpic-wenyingjinsheng-ci": {
    "zh-CN": "太保附加稳赢金生重大疾病保险",
    "zh-TW": "太保附加穩贏金生重大疾病保險",
    en: "CPIC Wen Ying Jin Sheng Critical Illness Rider",
  },
  "cpic-xiangbanzhizun-2024s": {
    "zh-CN": "太保长相伴（至尊 2024S）终身寿险（分红型）",
    "zh-TW": "太保長相伴（至尊 2024S）終身壽險（分紅型）",
    en: "CPIC Xiang Ban Zhi Zun 2024S Whole Life Insurance (Participating)",
  },
  "fwd-crisis-one-master": {
    "zh-CN": "富卫危疾无双（尊享版）",
    "zh-TW": "富衛危疾無雙（尊享版）",
    en: "FWD Crisis One Master",
  },
  "fwd-crisis-u-supporter": {
    "zh-CN": "富卫危疾应援保",
    "zh-TW": "富衛危疾應援保",
    en: "FWD Crisis U Supporter",
  },
  "fwd-easycover-ci": {
    "zh-CN": "富卫简易危疾保",
    "zh-TW": "富衛簡易危疾保",
    en: "FWD EasyCover Critical Illness Plan",
  },
  "fwd-maxfocus-legacy-ii": {
    "zh-CN": "富卫聚宝传世储蓄保险计划 II",
    "zh-TW": "富衛聚寶傳世儲蓄保險計劃 II",
    en: "FWD MaxFocus Legacy II",
  },
  "fwd-noble-fortune": {
    "zh-CN": "富卫尊贵盈家储蓄保险计划",
    "zh-TW": "富衛尊貴盈家儲蓄保險計劃",
    en: "FWD Noble Fortune Savings Insurance Plan",
  },
  "fwd-wealthicon-horizon": {
    "zh-CN": "富卫财富皇图储蓄保险计划（地平线）",
    "zh-TW": "富衛財富皇圖儲蓄保險計劃（地平線）",
    en: "FWD WealthICON Horizon",
  },
  "fwd-wealthicon-supreme-iii": {
    "zh-CN": "富卫财富皇图储蓄保险计划（至尊 III）",
    "zh-TW": "富衛財富皇圖儲蓄保險計劃（至尊 III）",
    en: "FWD WealthICON Supreme III",
  },
  "manulife-bright-care-pro": {
    "zh-CN": "宏利活耀人生危疾保（专业版）",
    "zh-TW": "宏利活耀人生危疾保（專業版）",
    en: "Manulife Bright Care Pro",
  },
  "manulife-genesis-centurion": {
    "zh-CN": "宏利宏挚传承保障计划",
    "zh-TW": "宏利宏摯傳承保障計劃",
    en: "Genesis Centurion Insurance Plan",
  },
  "manulife-incomeguard-ci": {
    "zh-CN": "宏利收入保障危疾保",
    "zh-TW": "宏利收入保障危疾保",
    en: "Manulife IncomeGuard Critical Illness Protector",
  },
  "manulife-incomeshield-ci": {
    "zh-CN": "宏利守护收入危疾保",
    "zh-TW": "宏利守護收入危疾保",
    en: "Manulife IncomeShield Critical Illness Protector",
  },
  "manulife-manucentury": {
    "zh-CN": "宏利世纪传承保障计划",
    "zh-TW": "宏利世紀傳承保障計劃",
    en: "ManuCentury Insurance Plan",
  },
  "manulife-prestige-achiever": {
    "zh-CN": "宏利卓越成就储蓄保险计划",
    "zh-TW": "宏利卓越成就儲蓄保險計劃",
    en: "Manulife Prestige Achiever",
  },
  "new-china-life-rongyao-shijia": {
    "zh-CN": "新华荣耀世家终身寿险（分红型）",
    "zh-TW": "新華榮耀世家終身壽險（分紅型）",
    en: "New China Life Rong Yao Shi Jia Whole Life (Participating)",
  },
  "new-china-life-rongyao-xinxiang": {
    "zh-CN": "新华荣耀鑫享庆典版",
    "zh-TW": "新華榮耀鑫享慶典版",
    en: "New China Life Rong Yao Xin Xiang (Celebration Edition)",
  },
  "ping-an-shengshi-jinyue-premium": {
    "zh-CN": "平安盛世金越（尊享版）终身寿险",
    "zh-TW": "平安盛世金越（尊享版）終身壽險",
    en: "Ping An Sheng Shi Jin Yue (Premium) Whole Life Insurance",
  },
  "pingan-fuli-20-ci": {
    "zh-CN": "平安福 20 重大疾病保险",
    "zh-TW": "平安福 20 重大疾病保險",
    en: "Ping An Fu 20 Critical Illness Insurance",
  },
  "pingan-ruyi-quanneng-2025-ci": {
    "zh-CN": "平安附加如意全能（2025）提前给付重大疾病保险",
    "zh-TW": "平安附加如意全能（2025）提前給付重大疾病保險",
    en: "Ping An Ruyi Quanneng (2025) Accelerated Critical Illness Rider",
  },
  "pingan-ruyi-quanneng-ci": {
    "zh-CN": "平安附加如意全能（2025）提前给付重大疾病保险",
    "zh-TW": "平安附加如意全能（2025）提前給付重大疾病保險",
    en: "Ping An Ruyi Quanneng (2025) Accelerated Critical Illness Rider",
  },
  "pingan-shengshi-jinyue-zunxiang-26II": {
    "zh-CN": "平安盛世金越（尊享版 26Ⅱ）终身寿险（分红型）",
    "zh-TW": "平安盛世金越（尊享版 26Ⅱ）終身壽險（分紅型）",
    en: "Ping An Sheng Shi Jin Yue 26 II (Premium) Whole Life (Participating)",
  },
  "pingan-yuxiang-jinyue-2025": {
    "zh-CN": "平安御享金越（2025）终身寿险（分红型）",
    "zh-TW": "平安御享金越（2025）終身壽險（分紅型）",
    en: "Ping An Yu Xiang Jin Yue (2025) Whole Life (Participating)",
  },
  "pru-ci-extended-care-iii": {
    "zh-CN": "保诚信护危疾保 III",
    "zh-TW": "保誠信護危疾保 III",
    en: "PRUHealth Critical Illness Extended Care III",
  },
  "pru-entrust-multi-currency": {
    "zh-CN": "保诚信腾多元货币计划",
    "zh-TW": "保誠信騰多元貨幣計劃",
    en: "PRUHealth Entrust Multi-Currency Plan",
  },
  "pru-guardian-ci-series": {
    "zh-CN": "保诚诚保一生危疾保",
    "zh-TW": "保誠誠保一生危疾保",
    en: "PRUHealth Guardian Critical Illness Plan Series",
  },
  "prudential-enlit-savings": {
    "zh-CN": "保诚智醒储蓄保险计划",
    "zh-TW": "保誠智醒儲蓄保險計劃",
    en: "Prudential Enlight Savings Insurance Plan",
  },
  "prudential-evergreen-growth": {
    "zh-CN": "保诚恒常增长储蓄保险计划 II",
    "zh-TW": "保誠恆常增長儲蓄保險計劃 II",
    en: "Evergreen Growth Saver Plus II",
  },
  "prudential-prime-ace": {
    "zh-CN": "保诚卓享非凡储蓄保险计划",
    "zh-TW": "保誠卓享非凡儲蓄保險計劃",
    en: "Prime Ace Insurance Plan",
  },
  "prudential-prime-eternity": {
    "zh-CN": "保诚卓享永恒储蓄保险计划",
    "zh-TW": "保誠卓享永恆儲蓄保險計劃",
    en: "Prime Eternity Insurance Plan",
  },
  "taikang-lexiangjiankang-2026": {
    "zh-CN": "泰康乐享健康 2026 重大疾病保险",
    "zh-TW": "泰康樂享健康 2026 重大疾病保險",
    en: "Taikang Le Xiang Jian Kang 2026 Critical Illness Insurance",
  },
  "taikang-lexiangjiankang-kids": {
    "zh-CN": "泰康乐享健康（少儿 B 款）重大疾病保险",
    "zh-TW": "泰康樂享健康（少兒 B 款）重大疾病保險",
    en: "Taikang Le Xiang Jian Kang (Kids B) Critical Illness Insurance",
  },
  "taikang-xinxingshijia-2026-qingdianban": {
    "zh-CN": "鑫享世家 2026（庆典版）终身寿险（分红型）",
    "zh-TW": "鑫享世家 2026（慶典版）終身壽險（分紅型）",
    en: "Xin Xing Shi Jia 2026 (Celebration Edition) Whole Life (Participating)",
  },
  "taikang-xinxingshijia-2026-zunxiangban-b": {
    "zh-CN": "鑫享世家 2026（尊享版 B 款）终身寿险（分红型）",
    "zh-TW": "鑫享世家 2026（尊享版 B 款）終身壽險（分紅型）",
    en: "Xin Xing Shi Jia 2026 (Premium B) Whole Life (Participating)",
  },
  "taikang-zengduoduo": {
    "zh-CN": "泰康增多多增额终身寿险",
    "zh-TW": "泰康增多多增額終身壽險",
    en: "Taikang Zeng Duo Duo Increasing Whole Life Insurance",
  },
  "taikang-zunxiang-shijia-flagship": {
    "zh-CN": "泰康尊享世家（旗舰版）终身寿险",
    "zh-TW": "泰康尊享世家（旗艦版）終身壽險",
    en: "Taikang Zun Xiang Shi Jia (Flagship) Whole Life Insurance",
  },
  "taikang-zunxiang-shijia-zeng-e": {
    "zh-CN": "泰康尊享世家（增额版）2024 终身寿险",
    "zh-TW": "泰康尊享世家（增額版）2024 終身壽險",
    en: "Taikang Zun Xiang Shi Jia (Increasing) 2024 Whole Life Insurance",
  },
};

// Company name translations.
export const COMPANY_NAMES: Record<string, { "zh-CN": string; "zh-TW": string; en: string }> = {
  "aia-hk": { "zh-CN": "友邦香港", "zh-TW": "友邦香港", en: "AIA Hong Kong" },
  "axa-hk": { "zh-CN": "安盛香港", "zh-TW": "AXA安盛香港", en: "AXA Hong Kong" },
  "cpic-life": { "zh-CN": "中国太保寿险", "zh-TW": "中國太保壽險", en: "CPIC Life Insurance" },
  "fwd-hk": { "zh-CN": "富卫香港", "zh-TW": "富衛香港", en: "FWD Hong Kong" },
  "manulife-hk": { "zh-CN": "宏利香港", "zh-TW": "宏利香港", en: "Manulife Hong Kong" },
  "new-china-life": { "zh-CN": "新华保险", "zh-TW": "新華保險", en: "New China Life Insurance" },
  "ping-an": { "zh-CN": "中国平安", "zh-TW": "中國平安", en: "Ping An Insurance" },
  "prudential-hk": { "zh-CN": "保诚香港", "zh-TW": "保誠香港", en: "Prudential Hong Kong" },
  "taikang-life": { "zh-CN": "泰康保险", "zh-TW": "泰康保險", en: "Taikang Insurance" },
};

export const CATEGORY_LABELS = {
  savings: { "zh-CN": "储蓄险", "zh-TW": "儲蓄險", en: "Savings" },
  critical_illness: { "zh-CN": "健康险（重疾险）", "zh-TW": "健康險（重疾險）", en: "Critical Illness" },
} as const;

// Region label translations. Keys match base.region values from ProductVector.
export const REGION_LABELS: Record<string, { "zh-CN": string; "zh-TW": string; en: string }> = {
  "Hong Kong": { "zh-CN": "中国香港", "zh-TW": "中國香港", en: "Hong Kong" },
  "Mainland China": { "zh-CN": "中国大陆", "zh-TW": "中國大陸", en: "Mainland China" },
  "HK": { "zh-CN": "中国香港", "zh-TW": "中國香港", en: "Hong Kong" },
  "CN": { "zh-CN": "中国大陆", "zh-TW": "中國大陸", en: "Mainland China" },
};

export function getRegionLabel(
  region: string | undefined | null,
  locale: Locale
): string {
  if (!region) return "";
  const entry = REGION_LABELS[region];
  if (entry) return entry[locale];
  // unknown region: pass through as-is
  return region;
}

// Compare-field label translations. Keys are the same as registry labels in
// registry.savings_fields[].label / registry.critical_illness_fields[].label.
export const COMPARE_FIELD_LABELS: Record<string, { "zh-CN": string; "zh-TW": string; en: string }> = {
  "保障年期": { "zh-CN": "保障年期", "zh-TW": "保障年期", en: "Policy Term" },
  "缴费年期": { "zh-CN": "缴费年期", "zh-TW": "繳費年期", en: "Premium Term" },
  "投保年龄": { "zh-CN": "投保年龄", "zh-TW": "投保年齡", en: "Entry Age" },
  "保单货币": { "zh-CN": "保单货币", "zh-TW": "保單貨幣", en: "Policy Currency" },
  "保证现金价值": { "zh-CN": "保证现金价值", "zh-TW": "保證現金價值", en: "Guaranteed Cash Value" },
  "非保证红利": { "zh-CN": "非保证红利 / 分红", "zh-TW": "非保證紅利 / 分紅", en: "Non-Guaranteed Bonus / Dividend" },
  "最高演示 IRR": { "zh-CN": "最高演示 IRR", "zh-TW": "最高演示 IRR", en: "Highest Illustrated IRR" },
  "保证 IRR": { "zh-CN": "保证 IRR", "zh-TW": "保證 IRR", en: "Guaranteed IRR" },
  "最高演示倍数": { "zh-CN": "最高演示倍数", "zh-TW": "最高演示倍數", en: "Highest Illustrated Return Multiple" },
  "保单贷款": { "zh-CN": "保单贷款", "zh-TW": "保單貸款", en: "Policy Loan" },
  "部分提取": { "zh-CN": "部分提取", "zh-TW": "部分提取", en: "Partial Withdrawal" },
  "保单分拆": { "zh-CN": "保单分拆", "zh-TW": "保單分拆", en: "Policy Split" },
  "更改受保人": { "zh-CN": "更改受保人", "zh-TW": "更改受保人", en: "Change Insured" },
  "疾病总数": { "zh-CN": "疾病总数", "zh-TW": "疾病總數", en: "Total Covered Illnesses" },
  "重大疾病数": { "zh-CN": "重大疾病数", "zh-TW": "重大疾病數", en: "Major Illness Count" },
  "早期疾病数": { "zh-CN": "早期疾病数", "zh-TW": "早期疾病數", en: "Early-Stage Illness Count" },
  "多次赔付": { "zh-CN": "多次赔付", "zh-TW": "多次賠付", en: "Multiple Claims" },
  "癌症多次赔": { "zh-CN": "癌症多次赔", "zh-TW": "癌症多次賠", en: "Cancer Multiple Claims" },
  "ICU 保障": { "zh-CN": "ICU 保障", "zh-TW": "ICU 保障", en: "ICU Benefit" },
};

// Feature tag translations. Keyed by compare_key from product_features[].
export const FEATURE_TAGS: Record<string, { "zh-CN": string; "zh-TW": string; en: string }> = {
  policy_loan: { "zh-CN": "保单贷款", "zh-TW": "保單貸款", en: "Policy Loan" },
  death_benefit_payment_option: { "zh-CN": "身故赔偿支付办法", "zh-TW": "身故賠償支付辦法", en: "Death Benefit Payment Options" },
  terminal_illness_benefit: { "zh-CN": "末期疾病利益", "zh-TW": "末期疾病利益", en: "Terminal Illness Benefit" },
  icu_benefit: { "zh-CN": "深切治疗保障", "zh-TW": "深切治療保障", en: "ICU Benefit" },
  persistent_cancer_cash: { "zh-CN": "持续癌症现金", "zh-TW": "持續癌症現金", en: "Persistent Cancer Cash" },
  neurodegenerative_annuity: { "zh-CN": "脑退化 / 柏金逊年金", "zh-TW": "腦退化 / 柏金遜年金", en: "Neurodegenerative Annuity" },
  maternity_version: { "zh-CN": "孕期 / 新生儿版本", "zh-TW": "孕期 / 新生兒版本", en: "Maternity / Newborn Version" },
  child_growth_benefit: { "zh-CN": "儿童成长保障", "zh-TW": "兒童成長保障", en: "Child Growth Benefit" },
  extra_premium_option: { "zh-CN": "额外保费方式", "zh-TW": "額外保費方式", en: "Extra Premium Option" },
  healthcare_service: { "zh-CN": "医疗礼宾服务", "zh-TW": "醫療禮賓服務", en: "Healthcare Concierge" },
  long_term_care: { "zh-CN": "长期护理保障", "zh-TW": "長期護理保障", en: "Long-Term Care" },
  currency_switch: { "zh-CN": "货币转换", "zh-TW": "貨幣轉換", en: "Currency Switch" },
  multi_currency: { "zh-CN": "多货币", "zh-TW": "多貨幣", en: "Multi-Currency" },
  policy_split: { "zh-CN": "保单分拆", "zh-TW": "保單分拆", en: "Policy Split" },
  change_insured: { "zh-CN": "更改受保人", "zh-TW": "更改受保人", en: "Change Insured" },
  second_insured: { "zh-CN": "第二受保人", "zh-TW": "第二受保人", en: "Second Insured" },
  second_policyholder: { "zh-TW": "第二保單持有人", en: "Second Policyholder", "zh-CN": "第二保单持有人" },
  bonus_lock: { "zh-CN": "红利锁定", "zh-TW": "紅利鎖定", en: "Bonus Lock" },
  bonus_unlock: { "zh-CN": "红利解锁", "zh-TW": "紅利解鎖", en: "Bonus Unlock" },
  value_protection_account: { "zh-CN": "价值保障户口", "zh-TW": "價值保障戶口", en: "Value Protection Account" },
  partial_withdrawal: { "zh-CN": "部分提取", "zh-TW": "部分提取", en: "Partial Withdrawal" },
  regular_withdrawal: { "zh-CN": "定期提取", "zh-TW": "定期提取", en: "Regular Withdrawal" },
};

// SEO/GEO copy templates.
// Title returns the page-specific portion only — the site-wide "Policy Vector"
// suffix is appended by app/[locale]/layout.tsx via Next.js title.template.
export const SEO_TEMPLATES = {
  title: {
    "zh-CN": (name: string) => `${name} 产品资料与对比`,
    "zh-TW": (name: string) => `${name} 產品資料與對比`,
    en: (name: string) => `${name} - Product Profile & Comparison`,
  } as Record<Locale, (name: string) => string>,
  description: (name: string) =>
    `查看 ${name} 的结构化产品资料，包括保障内容、保单年期、现金价值、分红、风险提示及官方 PDF 来源。`,
  geo_summary: (name: string) =>
    `${name} 的结构化产品资料页面，提供官方 PDF、字段级对比、风险提示与来源追溯。`,
};

// Section labels (用于 compare 页)
export const SECTION_LABELS = {
  base: { "zh-CN": "基础信息", "zh-TW": "基礎信息", en: "Basic Info" },
  currency: { "zh-CN": "币种", "zh-TW": "幣種", en: "Currency" },
  cashValue: { "zh-CN": "现金价值 / 分红", "zh-TW": "現金價值 / 分紅", en: "Cash Value / Bonus" },
  yield: { "zh-CN": "收益演示", "zh-TW": "收益演示", en: "Illustrated Yield" },
  liquidity: { "zh-CN": "流动性", "zh-TW": "流動性", en: "Liquidity" },
  legacy: { "zh-CN": "传承功能", "zh-TW": "傳承功能", en: "Legacy Features" },
  features: { "zh-CN": "产品特色", "zh-TW": "產品特色", en: "Product Features" },
  risks: { "zh-CN": "风险提示", "zh-TW": "風險提示", en: "Risk Disclosures" },
  pdf: { "zh-CN": "PDF 来源", "zh-TW": "PDF 來源", en: "PDF Source" },
  coverage: { "zh-CN": "疾病覆盖", "zh-TW": "疾病覆蓋", en: "Illness Coverage" },
  multipleClaims: { "zh-CN": "多次赔付", "zh-TW": "多次賠付", en: "Multiple Claims" },
  cancer: { "zh-CN": "癌症保障", "zh-TW": "癌症保障", en: "Cancer Coverage" },
  icu: { "zh-CN": "ICU / 额外保障", "zh-TW": "ICU / 額外保障", en: "ICU / Extra Benefits" },
  family: { "zh-CN": "儿童 / 孕期 / 家庭保障", "zh-TW": "兒童 / 孕期 / 家庭保障", en: "Children / Maternity / Family" },
} as const;

export const RISK_LABELS = {
  "非保证利益风险": { "zh-CN": "非保证利益风险", "zh-TW": "非保證利益風險", en: "Non-Guaranteed Benefit Risk" },
  "退保/流动性风险": { "zh-CN": "退保 / 流动性风险", "zh-TW": "退保 / 流動性風險", en: "Surrender / Liquidity Risk" },
  "货币风险": { "zh-CN": "货币风险", "zh-TW": "貨幣風險", en: "Currency Risk" },
  "汇率风险": { "zh-CN": "汇率风险", "zh-TW": "匯率風險", en: "Exchange Rate Risk" },
  "理赔限制": { "zh-CN": "理赔限制", "zh-TW": "理賠限制", en: "Claims Limitation" },
  "保单贷款风险": { "zh-CN": "保单贷款风险", "zh-TW": "保單貸款風險", en: "Policy Loan Risk" },
} as const;

export const UI_LABELS = {
  hotBadge: { "zh-CN": "热门", "zh-TW": "熱門", en: "Hot" },
  viewPdf: { "zh-CN": "查看产品 PDF", "zh-TW": "查看產品 PDF", en: "View Product PDF" },
  noPdf: { "zh-CN": "暂无 PDF 来源", "zh-TW": "暫無 PDF 來源", en: "No PDF Source" },
  compare: { "zh-CN": "对比", "zh-TW": "對比", en: "Compare" },
  categoryMismatch: {
    "zh-CN": "这两个产品类别不同，暂不支持直接比较。",
    "zh-TW": "這兩個產品類別不同，暫不支援直接比較。",
    en: "These two products are in different categories and cannot be compared directly.",
  },
  advantage: { "zh-CN": "优势", "zh-TW": "優勢", en: "Advantage" },
  noData: { "zh-CN": "暂无数据", "zh-TW": "暫無數據", en: "No data" },
  supported: { "zh-CN": "支持", "zh-TW": "支持", en: "Supported" },
  notSupported: { "zh-CN": "暂无", "zh-TW": "暫無", en: "Not available" },
  riskSection: { "zh-CN": "风险提示", "zh-TW": "風險提示", en: "Risk Disclosures" },
  companyName: { "zh-CN": "所属公司", "zh-TW": "所屬公司", en: "Insurance Company" },
  productCategory: { "zh-CN": "产品类别", "zh-TW": "產品類別", en: "Product Category" },
  policyTerm: { "zh-CN": "保障年期", "zh-TW": "保障年期", en: "Policy Term" },
  premiumTerm: { "zh-CN": "缴费年期", "zh-TW": "繳費年期", en: "Premium Term" },
  entryAge: { "zh-CN": "投保年龄", "zh-TW": "投保年齡", en: "Entry Age" },
  currency: { "zh-CN": "保单货币", "zh-TW": "保單貨幣", en: "Policy Currency" },
  // CI specific
  illnessTotal: { "zh-CN": "疾病总数", "zh-TW": "疾病總數", en: "Total Covered Illnesses" },
  majorIllness: { "zh-CN": "重大疾病数", "zh-TW": "重大疾病數", en: "Major Illness Count" },
  earlyIllness: { "zh-CN": "早期疾病数", "zh-TW": "早期疾病數", en: "Early-Stage Illness Count" },
  multipleClaims: { "zh-CN": "多次赔付", "zh-TW": "多次賠付", en: "Multiple Claims" },
  cancerMultiple: { "zh-CN": "癌症多次赔", "zh-TW": "癌症多次賠", en: "Cancer Multiple Claims" },
  icuBenefit: { "zh-CN": "ICU 保障", "zh-TW": "ICU 保障", en: "ICU Benefit" },
  // Savings specific
  irr: { "zh-CN": "最高演示 IRR", "zh-TW": "最高演示 IRR", en: "Highest Illustrated IRR" },
  guaranteedIrr: { "zh-CN": "保证 IRR", "zh-TW": "保證 IRR", en: "Guaranteed IRR" },
  returnMultiple: { "zh-CN": "最高演示倍数", "zh-TW": "最高演示倍數", en: "Highest Illustrated Return Multiple" },
  cashValue: { "zh-CN": "保证现金价值", "zh-TW": "保證現金價值", en: "Guaranteed Cash Value" },
  bonus: { "zh-CN": "非保证红利", "zh-TW": "非保證紅利", en: "Non-Guaranteed Bonus" },
  policyLoan: { "zh-CN": "保单贷款", "zh-TW": "保單貸款", en: "Policy Loan" },
  partialWithdrawal: { "zh-CN": "部分提取", "zh-TW": "部分提取", en: "Partial Withdrawal" },
  policySplit: { "zh-CN": "保单分拆", "zh-TW": "保單分拆", en: "Policy Split" },
  changeInsured: { "zh-CN": "更改受保人", "zh-TW": "更改受保人", en: "Change Insured" },
} as const;

// ---------- lookup helpers ----------

// Pick the locale-correct name from a vector base record. The vector is now the
// authoritative source for zh-CN (base.product_name_zh_cn / product_name),
// zh-HK/zh-TW (base.product_name_zh_hk) and en (base.product_name_en).
// Falls back to product_name for missing locale fields, then to slug.
export function pickBaseName(
  base:
    | {
        product_name?: string | null;
        product_name_zh_cn?: string | null;
        product_name_zh_hk?: string | null;
        product_name_zh_tw?: string | null;
        product_name_en?: string | null;
      }
    | undefined
    | null,
  locale: Locale
): string {
  if (!base) return "";
  if (locale === "zh-CN") return base.product_name_zh_cn || base.product_name || "";
  if (locale === "zh-TW") return base.product_name_zh_tw || base.product_name_zh_hk || base.product_name || "";
  return base.product_name_en || base.product_name || "";
}

export function getProductName(
  slug: string,
  locale: Locale,
  fallback?: string
): string {
  // Prefer the vector's authoritative localized name (passed in by callers as
  // pickBaseName(base, locale)). Only consult the static table when no
  // fallback was provided, e.g. legacy code paths.
  if (fallback) return fallback;
  const entry = PRODUCT_NAMES[slug];
  if (entry) return entry[locale] || entry["zh-CN"] || slug;
  return slug;
}

export function getCompanyName(
  companySlug: string,
  locale: Locale,
  fallback?: string
): string {
  const entry = COMPANY_NAMES[companySlug];
  if (entry) return entry[locale] || entry["zh-CN"] || fallback || companySlug;
  return fallback || companySlug;
}

export function getCategoryLabel(
  category: string | undefined,
  locale: Locale
): string {
  if (!category) return CATEGORY_LABELS.savings[locale];
  const key = category as keyof typeof CATEGORY_LABELS;
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key][locale];
  return category;
}

export function getFieldLabel(label: string, locale: Locale): string {
  const entry = COMPARE_FIELD_LABELS[label];
  if (entry) return entry[locale] || label;
  return label;
}

export function getFeatureTag(tag: string, locale: Locale): string {
  const entry = FEATURE_TAGS[tag];
  if (entry) return entry[locale] || entry["zh-CN"] || tag;
  // fall back to humanize the slug
  return tag.replace(/_/g, " ");
}

export function getSectionLabel(
  sectionKey: keyof typeof SECTION_LABELS,
  locale: Locale
): string {
  return SECTION_LABELS[sectionKey][locale] || SECTION_LABELS[sectionKey]["zh-CN"];
}

export function getUiLabel(
  key: keyof typeof UI_LABELS,
  locale: Locale
): string {
  return UI_LABELS[key][locale] || UI_LABELS[key]["zh-CN"];
}

export function getRiskLabel(
  risk: string,
  locale: Locale
): string {
  const entry = RISK_LABELS[risk as keyof typeof RISK_LABELS];
  if (entry) return entry[locale] || risk;
  return risk;
}

export function getSeoTitle(productName: string, locale: Locale): string {
  const tmpl = SEO_TEMPLATES.title[locale] || SEO_TEMPLATES.title["zh-CN"];
  return tmpl(productName);
}

export function getSeoDescription(productName: string, locale: Locale): string {
  return SEO_TEMPLATES.description(productName);
}

export function getGeoSummary(productName: string, locale: Locale): string {
  return SEO_TEMPLATES.geo_summary(productName);
}

// Compare-page description template.
// Localized fallback when neither DB summary nor vector summary is available.
const COMPARE_DESCRIPTION_TEMPLATE = {
  "zh-CN": (a: string, b: string) =>
    `对比 ${a} 与 ${b} 的保障内容、产品特色与收益表现。`,
  "zh-TW": (a: string, b: string) =>
    `對比 ${a} 與 ${b} 的保障內容、產品特色與收益表現。`,
  en: (a: string, b: string) =>
    `Compare ${a} and ${b} across coverage, features, and benefits.`,
};

export function getCompareDescription(
  productAName: string,
  productBName: string,
  locale: Locale
): string {
  const tpl = COMPARE_DESCRIPTION_TEMPLATE[locale] || COMPARE_DESCRIPTION_TEMPLATE["zh-CN"];
  return tpl(productAName, productBName);
}
