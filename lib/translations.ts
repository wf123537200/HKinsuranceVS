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
export function translateCompany(company: { slug: string; displayName: string; region: string } | null | undefined, locale: Locale) {
  if (!company) return company as any;
  return {
    ...company,
    displayName: translateCompanyName(company.slug, locale),
    region: translateRegion(company.region, locale),
  };
}

// Product summary translations
const productSummaries: Record<string, Record<Locale, string>> = {
  "prudential-ci-plan": { en: "A comprehensive critical illness plan offering coverage for multiple conditions with flexible premium terms.", "zh-CN": "全面的重疾保障计划，涵盖多种疾病，缴费期限灵活。", "zh-TW": "全面的重疾保障計劃，涵蓋多種疾病，繳費期限靈活。" },
  "prudential-savings-plan": { en: "A participating savings plan with multi-currency options designed for long-term wealth accumulation.", "zh-CN": "分红型储蓄计划，支持多币种，专为长期财富积累设计。", "zh-TW": "分紅型儲蓄計劃，支援多幣種，專為長期財富累積設計。" },
  "aia-ci-elite": { en: "Premium critical illness coverage with extensive condition definitions and multiple claim benefits.", "zh-CN": "高端重疾保障，涵盖广泛的疾病定义和多次赔付权益。", "zh-TW": "高端重疾保障，涵蓋廣泛的疾病定義和多次賠付權益。" },
  "aia-savings-leader": { en: "A leading savings product with guaranteed and non-guaranteed benefits for education and retirement planning.", "zh-CN": "领先储蓄产品，提供保证和非保证收益，适合教育和退休规划。", "zh-TW": "領先儲蓄產品，提供保證和非保證收益，適合教育和退休規劃。" },
  "manulife-critical-care-plus": { en: "Comprehensive critical illness protection with heart and stroke coverage and premium waiver benefit.", "zh-CN": "全面重疾保障，涵盖心脑血管疾病，附带保费豁免权益。", "zh-TW": "全面重疾保障，涵蓋心腦血管疾病，附帶保費豁免權益。" },
  "manulife-global-currency-savings": { en: "A multi-currency savings plan with global currency options for international wealth management.", "zh-CN": "多币种储蓄计划，支持全球货币选择，适合国际财富管理。", "zh-TW": "多幣種儲蓄計劃，支援全球貨幣選擇，適合國際財富管理。" },
  "axa-health-shield": { en: "A health-focused critical illness plan with early-stage condition coverage and flexible benefits.", "zh-CN": "以健康为核心的重疾计划，涵盖早期疾病，权益灵活。", "zh-TW": "以健康為核心的重疾計劃，涵蓋早期疾病，權益靈活。" },
  "axa-wealth-builder": { en: "A wealth accumulation plan designed for long-term growth with guaranteed cash value.", "zh-CN": "财富增值计划，专为长期增长设计，提供保证现金价值。", "zh-TW": "財富增值計劃，專為長期增長設計，提供保證現金價值。" },
  "fwd-ci-defender": { en: "An affordable critical illness plan with comprehensive coverage and multiple claim options.", "zh-CN": "经济实惠的重疾计划，保障全面，支持多次赔付。", "zh-TW": "經濟實惠的重疾計劃，保障全面，支援多次賠付。" },
  "fwd-evergreen-savings": { en: "A long-term savings plan with competitive returns and flexible premium payment options.", "zh-CN": "长期储蓄计划，回报具竞争力，缴费方式灵活。", "zh-TW": "長期儲蓄計劃，回報具競爭力，繳費方式靈活。" },
  "ping-an-ci-insurance": { en: "A comprehensive critical illness product covering major and minor conditions with competitive premiums.", "zh-CN": "全面重疾产品，涵盖重大和轻度疾病，保费具竞争力。", "zh-TW": "全面重疾產品，涵蓋重大和輕度疾病，保費具競爭力。" },
  "ping-an-shengshi-jinyue": { en: "An increasing sum insured whole life product with guaranteed cash value growth for long-term savings.", "zh-CN": "增额终身寿险，保证现金价值增长，适合长期储蓄。", "zh-TW": "增額終身壽險，保證現金價值增長，適合長期儲蓄。" },
  "china-life-ci-coverage": { en: "A reliable critical illness product from China's largest life insurance company.", "zh-CN": "中国人寿旗下可靠的重疾产品，来自中国最大的寿险公司。", "zh-TW": "中國人壽旗下可靠的重疾產品，來自中國最大的壽險公司。" },
  "china-life-fortune-growth": { en: "A whole life savings product with increasing sum insured and guaranteed returns.", "zh-CN": "终身储蓄产品，保额递增，回报有保证。", "zh-TW": "終身儲蓄產品，保額遞增，回報有保證。" },
  "taikang-ci-plus": { en: "An enhanced critical illness product with additional minor condition coverage.", "zh-CN": "加强版重疾产品，额外涵盖轻度疾病。", "zh-TW": "加強版重疾產品，額外涵蓋輕度疾病。" },
  "taikang-zengduoduo": { en: "A popular increasing sum insured product known for competitive guaranteed returns.", "zh-CN": "热门增额产品，以具竞争力的保证回报著称。", "zh-TW": "熱門增額產品，以具競爭力的保證回報著稱。" },
  "cpic-ci-guardian": { en: "A guardian-style critical illness product with comprehensive protection features.", "zh-CN": "守护型重疾产品，提供全面保障功能。", "zh-TW": "守護型重疾產品，提供全面保障功能。" },
  "cpic-evergreen-whole-life": { en: "A whole life savings product with steady cash value growth and flexible withdrawal options.", "zh-CN": "终身储蓄产品，现金价值稳步增长，提取方式灵活。", "zh-TW": "終身儲蓄產品，現金價值穩步增長，提取方式靈活。" },
  "new-china-life-ci": { en: "A comprehensive critical illness product with extensive condition coverage.", "zh-CN": "全面重疾产品，涵盖广泛的疾病种类。", "zh-TW": "全面重疾產品，涵蓋廣泛的疾病種類。" },
  "new-china-life-fortune-plus": { en: "A fortune-focused savings product with increasing sum insured and long-term value growth.", "zh-CN": "财富增值储蓄产品，保额递增，长期价值增长。", "zh-TW": "財富增值儲蓄產品，保額遞增，長期價值增長。" },
};

export function translateProductSummary(slug: string, locale: Locale): string {
  return productSummaries[slug]?.[locale] || productSummaries[slug]?.en || "";
}

// Translate a product object
export function translateProduct(product: { slug: string; displayName: string; region: string; summary?: string | null; company: { slug: string; displayName: string; region: string } }, locale: Locale) {
  return {
    ...product,
    displayName: translateProductName(product.slug, locale),
    region: translateRegion(product.region, locale),
    summary: translateProductSummary(product.slug, locale) || product.summary,
    company: product.company ? translateCompany(product.company, locale) : product.company,
  };
}
