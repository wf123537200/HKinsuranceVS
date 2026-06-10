import type { Locale } from "@/i18n/config";

// Company name translations
const companyNames: Record<string, Record<Locale, string>> = {
  "prudential-hk": { en: "Prudential Hong Kong", "zh-CN": "保诚香港", "zh-TW": "保誠香港" },
  "aia-hk": { en: "AIA Hong Kong", "zh-CN": "友邦香港", "zh-TW": "友邦香港" },
  "manulife-hk": { en: "Manulife Hong Kong", "zh-CN": "宏利香港", "zh-TW": "宏利香港" },
  "axa-hk": { en: "AXA Hong Kong", "zh-CN": "安盛香港", "zh-TW": "安盛香港" },
  "fwd-hk": { en: "FWD Hong Kong", "zh-CN": "富卫香港", "zh-TW": "富衛香港" },
  "ping-an": { en: "Ping An Insurance", "zh-CN": "中国平安", "zh-TW": "中國平安" },
  "china-life": { en: "China Life Insurance", "zh-CN": "中国人寿", "zh-TW": "中國人壽" },
  "taikang-life": { en: "Taikang Insurance Group", "zh-CN": "泰康保险", "zh-TW": "泰康保險" },
  "cpic-life": { en: "China Pacific Insurance (CPIC)", "zh-CN": "中国太平洋保险", "zh-TW": "中國太平洋保險" },
  "new-china-life": { en: "New China Life Insurance", "zh-CN": "新华保险", "zh-TW": "新華保險" },
};

// Product name translations
const productNames: Record<string, Record<Locale, string>> = {
  "prudential-ci-plan": { en: "Prudential Critical Illness Plan", "zh-CN": "保诚重疾保障计划", "zh-TW": "保誠重疾保障計劃" },
  "prudential-savings-plan": { en: "Prudential Savings Plan", "zh-CN": "保诚储蓄计划", "zh-TW": "保誠儲蓄計劃" },
  "aia-ci-elite": { en: "AIA Critical Illness Elite", "zh-CN": "友邦重疾精英计划", "zh-TW": "友邦重疾精英計劃" },
  "aia-savings-leader": { en: "AIA Savings Leader", "zh-CN": "友邦储蓄领先计划", "zh-TW": "友邦儲蓄領先計劃" },
  "manulife-critical-care-plus": { en: "Manulife Critical Care Plus", "zh-CN": "宏利危疾加倍保", "zh-TW": "宏利危疾加倍保" },
  "manulife-global-currency-savings": { en: "Manulife Global Currency Savings", "zh-CN": "宏利环球货币储蓄计划", "zh-TW": "宏利環球貨幣儲蓄計劃" },
  "axa-health-shield": { en: "AXA Health Shield", "zh-CN": "安盛健康盾牌", "zh-TW": "安盛健康盾牌" },
  "axa-wealth-builder": { en: "AXA Wealth Builder", "zh-CN": "安盛财富增值计划", "zh-TW": "安盛財富增值計劃" },
  "fwd-ci-defender": { en: "FWD Critical Illness Defender", "zh-CN": "富卫危疾守护者", "zh-TW": "富衛危疾守護者" },
  "fwd-evergreen-savings": { en: "FWD Evergreen Savings", "zh-CN": "富卫长青储蓄计划", "zh-TW": "富衛長青儲蓄計劃" },
  "ping-an-ci-insurance": { en: "Ping An Critical Illness Insurance", "zh-CN": "平安重疾险", "zh-TW": "平安重疾險" },
  "ping-an-shengshi-jinyue": { en: "Ping An Shengshi Jinyue", "zh-CN": "平安盛世金越", "zh-TW": "平安盛世金越" },
  "china-life-ci-coverage": { en: "China Life Critical Illness Coverage", "zh-CN": "中国人寿重疾保障", "zh-TW": "中國人壽重疾保障" },
  "china-life-fortune-growth": { en: "China Life Fortune Growth", "zh-CN": "中国人寿财富增长", "zh-TW": "中國人壽財富增長" },
  "taikang-ci-plus": { en: "Taikang Critical Illness Plus", "zh-CN": "泰康重疾加倍保", "zh-TW": "泰康重疾加倍保" },
  "taikang-zengduoduo": { en: "Taikang Zengduoduo", "zh-CN": "泰康增多多", "zh-TW": "泰康增多多" },
  "cpic-ci-guardian": { en: "CPIC Critical Illness Guardian", "zh-CN": "太平洋重疾守护者", "zh-TW": "太平洋重疾守護者" },
  "cpic-evergreen-whole-life": { en: "CPIC Evergreen Whole Life", "zh-CN": "太平洋常青终身寿", "zh-TW": "太平洋常青終身壽" },
  "new-china-life-ci": { en: "New China Life Critical Illness", "zh-CN": "新华重疾保障", "zh-TW": "新華重疾保障" },
  "new-china-life-fortune-plus": { en: "New China Life Fortune Plus", "zh-CN": "新华财富增值", "zh-TW": "新華財富增值" },
};

// Region translations
const regions: Record<string, Record<Locale, string>> = {
  "Hong Kong": { en: "Hong Kong", "zh-CN": "香港", "zh-TW": "香港" },
  "Mainland China": { en: "Mainland China", "zh-CN": "内地", "zh-TW": "內地" },
  "China": { en: "China", "zh-CN": "中国", "zh-TW": "中國" },
};

export function translateCompanyName(slug: string, locale: Locale): string {
  return companyNames[slug]?.[locale] || companyNames[slug]?.en || slug;
}

export function translateProductName(slug: string, locale: Locale): string {
  return productNames[slug]?.[locale] || productNames[slug]?.en || slug;
}

export function translateRegion(region: string, locale: Locale): string {
  return regions[region]?.[locale] || region;
}

// Translate a company object
export function translateCompany(company: { slug: string; displayName: string; region: string }, locale: Locale) {
  return {
    ...company,
    displayName: translateCompanyName(company.slug, locale),
    region: translateRegion(company.region, locale),
  };
}

// Translate a product object
export function translateProduct(product: { slug: string; displayName: string; region: string; company: { slug: string; displayName: string; region: string } }, locale: Locale) {
  return {
    ...product,
    displayName: translateProductName(product.slug, locale),
    region: translateRegion(product.region, locale),
    company: translateCompany(product.company, locale),
  };
}
