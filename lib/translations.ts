import type { Locale } from "@/i18n/config";

// Company name translations
const companyNames: Record<string, Record<Locale, string>> = {
  "prudential-hk": { en: "Prudential Hong Kong", "zh-CN": "保诚香港", "zh-TW": "保誠香港" },
  "aia-hk": { en: "AIA Hong Kong", "zh-CN": "友邦香港", "zh-TW": "友邦香港" },
  "fwd-hk": { en: "FWD Hong Kong", "zh-CN": "富卫香港", "zh-TW": "富衛香港" },
  "ping-an": { en: "Ping An Insurance", "zh-CN": "中国平安", "zh-TW": "中國平安" },
  "taikang-life": { en: "Taikang Insurance Group", "zh-CN": "泰康保险", "zh-TW": "泰康保險" },
  "cpic-life": { en: "China Pacific Insurance (CPIC)", "zh-CN": "中国太平洋保险", "zh-TW": "中國太平洋保險" },
};

// Product name translations
const productNames: Record<string, Record<Locale, string>> = {
  "prudential-ci-plan": { en: "Prudential Critical Illness Plan", "zh-CN": "保诚重疾保障计划", "zh-TW": "保誠重疾保障計劃" },
  "aia-ci-elite": { en: "AIA Critical Illness Elite", "zh-CN": "友邦重疾精英计划", "zh-TW": "友邦重疾精英計劃" },
  "aia-savings-leader": { en: "AIA Savings Leader", "zh-CN": "友邦储蓄领先计划", "zh-TW": "友邦儲蓄領先計劃" },
  "fwd-noble-fortune": { en: "FWD Noble Fortune", "zh-CN": "富卫寰荟致富", "zh-TW": "富衛寰薈致富" },
  "fwd-crisis-one-master": { en: "FWD Crisis One Master", "zh-CN": "富卫危疾致尚保", "zh-TW": "富衛危疾緻尚保" },
  "fwd-crisis-u-supporter": { en: "FWD Crisis U Supporter", "zh-CN": "富卫危疾应援保", "zh-TW": "富衛危疾應援保" },
  "fwd-easycover-ci": { en: "FWD EasyCover CI Plan", "zh-CN": "富卫好易拣危疾保障", "zh-TW": "富衛好易揀危疾保障" },
  "fwd-maxfocus-legacy-ii": { en: "FWD MaxFocus Legacy II", "zh-CN": "富卫盈聚天下II", "zh-TW": "富衛盈聚天下II" },
  "aia-cancer-care": { en: "AIA Cancer Care Essence", "zh-CN": "友邦智护癌症保", "zh-TW": "友邦智護癌症保" },
  "aia-executive-care-pro-2": { en: "AIA Executive Care Pro 2", "zh-CN": "友邦泰然安心保2", "zh-TW": "友邦泰然安心保2" },
  "aia-essence-on-your-side": { en: "AIA Essence On Your Side", "zh-CN": "友邦简緻·爱伴航", "zh-TW": "友邦簡緻·愛伴航" },
  // New AIA 2026 products
  "aia-on-your-side-2": { en: "AIA On Your Side Insurance Plan 2", "zh-CN": "友邦爱伴航2", "zh-TW": "友邦愛伴航2" },
  "aia-cancer-guardian-3": { en: "AIA Cancer Guardian 3", "zh-CN": "友邦癌症全方位保障3", "zh-TW": "友邦癌症全方位保障3" },
  "aia-globalflexi-savings": { en: "AIA GlobalFlexi Savings Insurance Plan", "zh-CN": "友邦环宇盈活储蓄计划", "zh-TW": "友邦環宇盈活儲蓄計劃" },
  "aia-wealth-flexi-savings": { en: "AIA Wealth Flexi Savings Insurance Plan", "zh-CN": "友邦财富盈活储蓄计划", "zh-TW": "友邦財富盈活儲蓄計劃" },
  // New Prudential 2026 products
  "pru-guardian-ci-series": { en: "Prudential Guardian CI Plan Series", "zh-CN": "保诚诚保一生危疾保", "zh-TW": "保誠誠保一生危疾保" },
  "pru-ci-extended-care-iii": { en: "Prudential CI Extended Care III", "zh-CN": "保诚危疾加护保III", "zh-TW": "保誠危疾加護保III" },
  "pru-entrust-multi-currency": { en: "Prudential Entrust Multi-Currency Plan", "zh-CN": "保诚信守明天多元货币计划", "zh-TW": "保誠信守明天多元貨幣計劃" },

  "prudential-enlit-savings": { en: "Prudential Enlight Savings", "zh-CN": "保诚启耀未来储蓄", "zh-TW": "保誠啟耀未來儲蓄" },
  "prudential-evergreen-growth": { en: "Evergreen Growth Saver Plus II", "zh-CN": "保诚常青增长储蓄保II", "zh-TW": "保誠常青增長儲蓄保II" },
  "prudential-prime-ace": { en: "Prime Ace Insurance Plan", "zh-CN": "保诚Prime Ace储蓄计划", "zh-TW": "保誠Prime Ace儲蓄計劃" },
  "prudential-prime-eternity": { en: "Prime Eternity", "zh-CN": "保诚Prime Eternity", "zh-TW": "保誠Prime Eternity" },
  "ping-an-shengshi-jinyue": { en: "Ping An Shengshi Jinyue", "zh-CN": "平安盛世金越", "zh-TW": "平安盛世金越" },
  "taikang-zengduoduo": { en: "Taikang Zengduoduo", "zh-CN": "泰康增多多", "zh-TW": "泰康增多多" },
  "cpic-evergreen-whole-life": { en: "CPIC Evergreen Whole Life", "zh-CN": "太平洋常青终身寿", "zh-TW": "太平洋常青終身壽" },
};

// Stroke count for Chinese characters (common characters used in company/product names)
// Deduplicated - each character appears exactly once
const strokeCounts: Record<string, number> = {
  '保': 9, '诚': 8, '香': 9, '港': 12, '友': 4, '邦': 6, '宏': 7, '利': 7,
  '安': 6, '盛': 11, '富': 12, '卫': 3, '中': 4, '国': 8, '人': 2, '寿': 7,
  '泰': 10, '康': 11, '险': 8, '集': 12, '团': 6, '太': 4, '平': 5, '洋': 9,
  '新': 13, '华': 6, '重': 9, '疾': 10, '障': 13, '计': 4, '划': 6,
  '储': 12, '蓄': 13, '领': 11, '先': 6, '危': 6, '加': 5, '倍': 10, '环': 8,
  '球': 11, '货': 8, '币': 4, '健': 10, '盾': 9, '牌': 12, '财': 7, '增': 15,
  '值': 10, '守': 6, '护': 7, '者': 8, '长': 4, '青': 8, '世': 5, '金': 8,
  '越': 12, '常': 11, '终': 8, '身': 7, '万': 3, '能': 10, '放': 8, '心': 4,
  '理': 11, '多': 6, '全': 6, '面': 9, '大': 3, '广': 3, '泛': 7, '种': 9,
  '轻': 9, '度': 9, '癌': 17, '症': 10, '次': 6, '赔': 12, '付': 5, '豁': 17,
  '免': 7, '费': 9, '现': 8, '价': 6, '证': 7, '红': 6, '非': 8,
  '回': 6, '本': 5, '年': 6, '期': 12, '贷': 12, '款': 12,
  '传': 6, '承': 8, '规': 8, '医': 7, '疗': 7, '教': 11, '育': 8,
  '退': 9, '休': 6, '单': 8, '变': 8, '更': 7, '投': 7, '被': 10,
  '归': 5, '原': 10, '演': 14, '示': 5, '内': 4,
  '部': 11, '收': 6, '益': 10, '率': 11, '额': 12, '递': 10, '稳': 14,
  '步': 7, '提': 12, '取': 8, '方': 4, '式': 6, '灵': 7, '活': 9, '竞': 11,
  '争': 6, '具': 8, '低': 7, '结': 9,
  '算': 14, '月': 4, '复': 9, '化': 4, '合': 6, '报': 7,
  '达': 6, '标': 9, '记': 5, '预': 10, '估': 7, '资': 10, '料': 10,
  '的': 8, '是': 9, '不': 4, '了': 2, '在': 6, '有': 6, '和': 8, '这': 7,
  '个': 3, '上': 3, '到': 8, '说': 9, '就': 12, '对': 5, '也': 3, '会': 6,
  '可': 5, '以': 4, '要': 9, '时': 7, '来': 7, '自': 6, '出': 5,
  '过': 6, '后': 6, '作': 7, '生': 5, '用': 5, '道': 12, '行': 6,
  '都': 10, '发': 5, '成': 6, '里': 7, '没': 7, '开': 4, '很': 9, '好': 6,
  '看': 9, '起': 10, '把': 7, '让': 5, '想': 13, '点': 9, '小': 3, '样': 10,
  '她': 6, '两': 7, '去': 5, '又': 2, '得': 11, '做': 11, '实': 8,
  '着': 11, '见': 4, '等': 12, '还': 7, '天': 4, '只': 5, '如': 6,
  '最': 12, '已': 3, '经': 8, '日': 4, '么': 3, '同': 6, '什': 4, '体': 7,
  '从': 4, '进': 7, '它': 5, '前': 9, '美': 9, '高': 10,
  '老': 6, '第': 11, '此': 6, '总': 9, '为': 4, '分': 4,
  '于': 3, '别': 7, '数': 13, '位': 7, '主': 5, '问': 6,
  '通': 10, '特': 10, '向': 6, '明': 8, '文': 4, '但': 7, '当': 6, '知': 8,
  '与': 3, '正': 5, '业': 5, '市': 5, '无': 4, '政': 9, '相': 9,
  '因': 6, '事': 8, '其': 8, '公': 4, '外': 5, '区': 4,
  '表': 8, '解': 13, '情': 11, '性': 8, '走': 7, '系': 7, '定': 8, '法': 8,
  '关': 6, '件': 6, '任': 6, '名': 6, '你': 7, '工': 3, '所': 8, '己': 3,
  '手': 4, '三': 3, '五': 4, '四': 5, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
  '百': 6, '千': 3, '亿': 3, '兆': 6, '零': 13, '壹': 12, '贰': 9, '叁': 8, '肆': 13,
  '伍': 6, '陆': 7, '柒': 9, '捌': 11, '玖': 7, '拾': 9,
};

/**
 * Get the stroke count of a Chinese character
 */
function getStrokeCount(char: string): number {
  return strokeCounts[char] || 20; // Default to 20 for unknown characters
}

/**
 * Sort comparator for translated names
 * - English: alphabetical order (A-Z)
 * - Chinese: stroke count order (fewer strokes first)
 */
export function sortByTranslatedName(locale: Locale) {
  return (a: { displayName?: string; title?: string }, b: { displayName?: string; title?: string }) => {
    const nameA = a.displayName || a.title || "";
    const nameB = b.displayName || b.title || "";

    if (!nameA || !nameB) return 0;

    if (locale === "en") {
      // English: alphabetical order
      return nameA.localeCompare(nameB, "en", { sensitivity: "base" });
    } else {
      // Chinese: stroke count order for first character, then by unicode
      const firstCharA = nameA.charAt(0);
      const firstCharB = nameB.charAt(0);
      const strokesA = getStrokeCount(firstCharA);
      const strokesB = getStrokeCount(firstCharB);
      
      if (strokesA !== strokesB) {
        return strokesA - strokesB;
      }
      
      // Same stroke count, sort by unicode
      return firstCharA.localeCompare(firstCharB, locale);
    }
  };
}

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
  "aia-ci-elite": { en: "Premium critical illness coverage with extensive condition definitions and multiple claim benefits.", "zh-CN": "高端重疾保障，涵盖广泛的疾病定义和多次赔付权益。", "zh-TW": "高端重疾保障，涵蓋廣泛的疾病定義和多次賠付權益。" },
  "aia-savings-leader": { en: "A leading savings product with guaranteed and non-guaranteed benefits for education and retirement planning.", "zh-CN": "领先储蓄产品，提供保证和非保证收益，适合教育和退休规划。", "zh-TW": "領先儲蓄產品，提供保證和非保證收益，適合教育和退休規劃。" },
  "fwd-noble-fortune": { en: "A universal life product with savings element for wealth accumulation and legacy planning.", "zh-CN": "万用寿险产品，兼具储蓄功能，适合财富积累和传承规划。", "zh-TW": "萬用壽險產品，兼具儲蓄功能，適合財富累積和傳承規劃。" },
  "fwd-crisis-one-master": { en: "Comprehensive critical illness protection covering 68 major conditions and 80 severe diseases with up to 2080% of sum insured.", "zh-CN": "全面重疾保障，涵盖68种主要危疾和80种严重疾病，保障高达投保额的2080%。", "zh-TW": "全面重疾保障，涵蓋68種主要危疾和80種嚴重疾病，保障高達投保額的2080%。" },
  "fwd-crisis-u-supporter": { en: "Innovative critical illness plan with 10Life 5-star rating, covering cancer, heart disease, stroke and mental health support.", "zh-CN": "创新重疾计划，获10Life五星评级，涵盖癌症、心脏病、中风及精神健康支持。", "zh-TW": "創新重疾計劃，獲10Life五星評級，涵蓋癌症、心臟病、中風及精神健康支援。" },
  "fwd-easycover-ci": { en: "Affordable critical illness coverage including cancer, acute myocardial infarction and stroke.", "zh-CN": "经济实惠的重疾保障，涵盖癌症、急性心肌梗塞和中风。", "zh-TW": "經濟實惠的重疾保障，涵蓋癌症、急性心肌梗塞和中風。" },
  "fwd-maxfocus-legacy-ii": { en: "Participating savings plan for wealth accumulation and legacy planning with flexible premium options.", "zh-CN": "分红型储蓄计划，适合财富积累和传承规划，缴费方式灵活。", "zh-TW": "分紅型儲蓄計劃，適合財富累積和傳承規劃，繳費方式靈活。" },
  "prudential-enlit-savings": { en: "A savings insurance series with guaranteed financial support for children's education and lifelong protection.", "zh-CN": "储蓄保险系列，为子女教育提供保证财务支持和终身保障。", "zh-TW": "儲蓄保險系列，為子女教育提供保證財務支援和終身保障。" },
  "prudential-evergreen-growth": { en: "Long-term savings for retirement, education or passing down wealth through the generations.", "zh-CN": "长期储蓄，用于退休、教育或代际财富传承。", "zh-TW": "長期儲蓄，用於退休、教育或代際財富傳承。" },
  "prudential-prime-ace": { en: "The accelerated path to get ahead, build your wealth, and craft a legacy with just 3 years of premiums.", "zh-CN": "仅需3年缴费，快速积累财富、打造传承。", "zh-TW": "僅需3年繳費，快速累積財富、打造傳承。" },
  "prudential-prime-eternity": { en: "Crafting Prime Eternity wealth begins with a single premium: seamlessly grow, access and pass on your wealth for generations.", "zh-CN": "一次性缴费，无缝增长、提取并传承财富。", "zh-TW": "一次性繳費，無縫增長、提取並傳承財富。" },
  "ping-an-shengshi-jinyue": { en: "An increasing sum insured whole life product with guaranteed cash value growth for long-term savings.", "zh-CN": "增额终身寿险，保证现金价值增长，适合长期储蓄。", "zh-TW": "增額終身壽險，保證現金價值增長，適合長期儲蓄。" },
  "taikang-zengduoduo": { en: "A popular increasing sum insured product known for competitive guaranteed returns.", "zh-CN": "热门增额产品，以具竞争力的保证回报著称。", "zh-TW": "熱門增額產品，以具競爭力的保證回報著稱。" },
  "cpic-evergreen-whole-life": { en: "A whole life savings product with steady cash value growth and flexible withdrawal options.", "zh-CN": "终身储蓄产品，现金价值稳步增长，提取方式灵活。", "zh-TW": "終身儲蓄產品，現金價值穩步增長，提取方式靈活。" },
  // New AIA 2026 product summaries
  "aia-on-your-side-2": { en: "Participating critical illness plan providing comprehensive protection with loyalty benefits.", "zh-CN": "分红型重疾计划，提供全面保障和忠诚客户权益。", "zh-TW": "分紅型重疾計劃，提供全面保障和忠誠客戶權益。" },
  "aia-cancer-guardian-3": { en: "Comprehensive cancer protection plan with multiple claim benefits and recovery support.", "zh-CN": "全面癌症保障计划，多次赔付和康复支持。", "zh-TW": "全面癌症保障計劃，多次賠付和康復支援。" },
  "aia-globalflexi-savings": { en: "Global flexible savings plan with multi-currency options for international wealth management.", "zh-CN": "全球灵活储蓄计划，支持多币种，适合国际财富管理。", "zh-TW": "全球靈活儲蓄計劃，支援多幣種，適合國際財富管理。" },
  "aia-wealth-flexi-savings": { en: "Premium wealth savings plan with flexible withdrawal options and competitive returns.", "zh-CN": "高端财富储蓄计划，灵活提取选项和具竞争力的回报。", "zh-TW": "高端財富儲蓄計劃，靈活提取選項和具競爭力的回報。" },
  // New Prudential 2026 product summaries
  "pru-guardian-ci-series": { en: "Participating critical illness plan series offering comprehensive protection for the whole family.", "zh-CN": "分红型重疾保障系列，为全家提供全面保障。", "zh-TW": "分紅型重疾保障系列，為全家提供全面保障。" },
  "pru-ci-extended-care-iii": { en: "Extended critical illness care with multiple claims and comprehensive condition coverage.", "zh-CN": "扩展型重疾保障，多次赔付和全面疾病覆盖。", "zh-TW": "擴展型重疾保障，多次賠付和全面疾病覆蓋。" },
  "pru-entrust-multi-currency": { en: "Multi-currency savings plan for diversified wealth management and intergenerational transfer.", "zh-CN": "多币种储蓄计划，适合多元化财富管理和代际传承。", "zh-TW": "多幣種儲蓄計劃，適合多元化財富管理和代際傳承。" },

};

export function translateProductSummary(slug: string, locale: Locale): string {
  return productSummaries[slug]?.[locale] || productSummaries[slug]?.en || "";
}

// Translate a product object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function translateProduct(product: any, locale: Locale) {
  return {
    ...product,
    displayName: translateProductName(product.slug, locale),
    region: translateRegion(product.region, locale),
    summary: translateProductSummary(product.slug, locale) || product.summary,
    company: product.company ? translateCompany(product.company, locale) : product.company,
  };
}
