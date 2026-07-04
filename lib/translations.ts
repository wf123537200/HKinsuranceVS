import type { Locale } from "@/i18n/config";

// Company name translations
const companyNames: Record<string, Record<Locale, string>> = {
  "prudential-hk": { en: "Prudential Hong Kong", "zh-CN": "保诚香港", "zh-TW": "保誠香港" },
  "aia-hk": { en: "AIA Hong Kong", "zh-CN": "友邦香港", "zh-TW": "友邦香港" },
  "manulife-hk": { en: "Manulife Hong Kong", "zh-CN": "宏利香港", "zh-TW": "宏利香港" },
  "fwd-hk": { en: "FWD Hong Kong", "zh-CN": "富卫香港", "zh-TW": "富衛香港" },
  "ping-an": { en: "Ping An Insurance", "zh-CN": "中国平安", "zh-TW": "中國平安" },
  "taikang-life": { en: "Taikang Insurance Group", "zh-CN": "泰康保险", "zh-TW": "泰康保險" },
  "cpic-life": { en: "China Pacific Insurance (CPIC)", "zh-CN": "中国太平洋保险", "zh-TW": "中國太平洋保險" },
  "axa-hk": { en: "AXA Hong Kong", "zh-CN": "安盛香港", "zh-TW": "安盛香港" },
  "china-life": { en: "China Life Insurance", "zh-CN": "中国人寿", "zh-TW": "中國人壽" },
  "new-china-life": { en: "New China Life Insurance", "zh-CN": "新华保险", "zh-TW": "新華保險" },
};

// Company description translations
export const companyDescriptions: Record<string, Record<Locale, string>> = {
  "prudential-hk": { en: "Prudential Hong Kong is a leading life insurance company that has been serving customers in Hong Kong for over 60 years, offering a comprehensive range of protection, savings, and investment-linked products.", "zh-CN": "保诚香港是领先的寿险公司，服务香港客户超过60年，提供全面的保障、储蓄和投资相连产品。", "zh-TW": "保誠香港是領先的壽險公司，服務香港客戶超過60年，提供全面的保障、儲蓄和投資相連產品。" },
  "aia-hk": { en: "AIA is the largest independent publicly listed pan-Asian life insurance group, serving over 3 million customers in Hong Kong. With a history spanning over a century since 1919, AIA is ranked No.1 in Hong Kong's insurance market and leads globally in MDRT membership.", "zh-CN": "友邦是最大的独立上市泛亚人寿保险集团，服务香港超过300万客户。自1919年创立至今已有百年历史，友邦在香港保险市场排名第一，MDRT会员人数全球领先。", "zh-TW": "友邦是最大的獨立上市泛亞人壽保險集團，服務香港超過300萬客戶。自1919年創立至今已有百年歷史，友邦在香港保險市場排名第一，MDRT會員人數全球領先。" },
  "manulife-hk": { en: "Manulife Hong Kong, part of the global Manulife Financial Corporation founded in 1887, provides financial protection and wealth management solutions to individuals and businesses in Hong Kong, with a strong focus on retirement and investment products.", "zh-CN": "宏利香港是全球宏利金融集团（创立于1887年）的成员，为香港个人和企业提供财务保障和财富管理方案，专注于退休和投资产品。", "zh-TW": "宏利香港是全球宏利金融集團（創立於1887年）的成員，為香港個人和企業提供財務保障和財富管理方案，專注於退休和投資產品。" },
  "axa-hk": { en: "AXA Hong Kong offers a comprehensive range of life, health, savings, and general insurance products. With the Emma by AXA digital platform, AXA provides innovative self-servicing solutions and a holistic wellness programme called BetterMe.", "zh-CN": "安盛香港提供全面的人寿、健康、储蓄和一般保险产品。通过Emma by AXA数字平台，安盛提供创新的自助服务方案和名为BetterMe的全面健康计划。", "zh-TW": "安盛香港提供全面的人壽、健康、儲蓄和一般保險產品。通過Emma by AXA數字平台，安盛提供創新的自助服務方案和名為BetterMe的全面健康計劃。" },
  "fwd-hk": { en: "FWD is a pan-Asian life insurance business headquartered in Hong Kong, offering life insurance, medical and critical illness protection, savings plans, retirement solutions, and investment-linked insurance with a focus on digital-first customer experience.", "zh-CN": "富卫是一家总部位于香港的泛亚人寿保险业务，提供人寿保险、医疗和重疾保障、储蓄计划、退休方案和投资相连保险，注重数字化客户体验。", "zh-TW": "富衛是一家總部位於香港的泛亞人壽保險業務，提供人壽保險、醫療和重疾保障、儲蓄計劃、退休方案和投資相連保險，注重數位化客戶體驗。" },
  "ping-an": { en: "Ping An Insurance is one of China's largest financial services groups, offering life insurance, property and casualty insurance, banking, and investment services.", "zh-CN": "中国平安是中国最大的金融服务集团之一，提供人寿保险、财产保险、银行和投资服务。", "zh-TW": "中國平安是中國最大的金融服務集團之一，提供人壽保險、財產保險、銀行和投資服務。" },
  "taikang-life": { en: "Taikang Insurance Group is a major Chinese insurance and financial services company, focusing on life insurance, healthcare, and养老 services.", "zh-CN": "泰康保险集团是中国主要的保险和金融服务公司，专注于人寿保险、医疗保健和养老服务。", "zh-TW": "泰康保險集團是中國主要的保險和金融服務公司，專注於人壽保險、醫療保健和養老服務。" },
  "cpic-life": { en: "China Pacific Insurance (CPIC) is one of China's top insurance groups, providing life and property insurance services with a strong national presence.", "zh-CN": "中国太平洋保险是中国顶级保险集团之一，提供人寿和财产保险服务，全国覆盖面广。", "zh-TW": "中國太平洋保險是中國頂級保險集團之一，提供人壽和財產保險服務，全國覆蓋面廣。" },
  "china-life": { en: "China Life Insurance (Group) Company is the largest life insurance company in China and a Fortune Global 500 company, offering life insurance, overseas business, asset management, health investment, and property insurance across its extensive nationwide network.", "zh-CN": "中国人寿保险（集团）公司是中国最大的寿险公司，也是世界500强企业，通过遍布全国的网络提供人寿保险、海外业务、资产管理、健康投资和财产保险服务。", "zh-TW": "中國人壽保險（集團）公司是中國最大的壽險公司，也是世界500強企業，通過遍布全國的網絡提供人壽保險、海外業務、資產管理、健康投資和財產保險服務。" },
  "new-china-life": { en: "New China Life Insurance Co., Ltd. (NCI) is a leading life insurance company in China listed on the Shanghai, Hong Kong, and New York stock exchanges, extending into elderly care, health management, and asset management.", "zh-CN": "新华保险是中国领先的寿险公司，在上海、香港和纽约三地上市，业务涵盖养老、健康管理和资产管理。", "zh-TW": "新華保險是中國領先的壽險公司，在上海、香港和紐約三地上市，業務涵蓋養老、健康管理和資產管理。" },
};

// Company headquarters translations
const headquartersTranslations: Record<string, Record<Locale, string>> = {
  "Hong Kong": { en: "Hong Kong", "zh-CN": "香港", "zh-TW": "香港" },
  "Shanghai": { en: "Shanghai", "zh-CN": "上海", "zh-TW": "上海" },
  "Shanghai, China": { en: "Shanghai, China", "zh-CN": "上海", "zh-TW": "上海" },
  "Beijing": { en: "Beijing", "zh-CN": "北京", "zh-TW": "北京" },
  "Beijing, China": { en: "Beijing, China", "zh-CN": "北京", "zh-TW": "北京" },
  "Shenzhen": { en: "Shenzhen", "zh-CN": "深圳", "zh-TW": "深圳" },
  "Shenzhen, China": { en: "Shenzhen, China", "zh-CN": "深圳", "zh-TW": "深圳" },
};

// Company regulator translations
const regulatorTranslations: Record<string, Record<Locale, string>> = {
  "Insurance Authority (IA)": { en: "Insurance Authority (IA)", "zh-CN": "保险业监管局", "zh-TW": "保險業監管局" },
  "China Banking and Insurance Regulatory Commission (CBIRC)": { en: "China Banking and Insurance Regulatory Commission (CBIRC)", "zh-CN": "中国银行保险监督管理委员会", "zh-TW": "中國銀行保險監督管理委員會" },
  "National Financial Regulatory Administration (NFRA)": { en: "National Financial Regulatory Administration (NFRA)", "zh-CN": "国家金融监督管理总局", "zh-TW": "國家金融監督管理總局" },
};

// Tag translations
const tagTranslations: Record<string, Record<Locale, string>> = {
  "critical-illness": { en: "Critical Illness", "zh-CN": "重疾险", "zh-TW": "重疾險" },
  "savings": { en: "Savings", "zh-CN": "储蓄", "zh-TW": "儲蓄" },
  "multiple-claims": { en: "Multiple Claims", "zh-CN": "多次赔付", "zh-TW": "多次賠付" },
  "cancer-coverage": { en: "Cancer Coverage", "zh-CN": "癌症保障", "zh-TW": "癌症保障" },
  "education": { en: "Education", "zh-CN": "教育", "zh-TW": "教育" },
  "guaranteed": { en: "Guaranteed", "zh-CN": "保证", "zh-TW": "保證" },
  "endowment": { en: "Endowment", "zh-CN": "两全保险", "zh-TW": "兩全保險" },
  "retirement": { en: "Retirement", "zh-CN": "退休", "zh-TW": "退休" },
  "long-term": { en: "Long-term", "zh-CN": "长期", "zh-TW": "長期" },
  "wealth-transfer": { en: "Wealth Transfer", "zh-CN": "财富传承", "zh-TW": "財富傳承" },
  "legacy": { en: "Legacy", "zh-CN": "传承", "zh-TW": "傳承" },
  "premium": { en: "Premium", "zh-CN": "高端", "zh-TW": "高端" },
  "single-premium": { en: "Single Premium", "zh-CN": "一次性缴费", "zh-TW": "一次性繳費" },
  "guardian": { en: "Guardian", "zh-CN": "守护", "zh-TW": "守護" },
  "comprehensive": { en: "Comprehensive", "zh-CN": "全面", "zh-TW": "全面" },
  "participating": { en: "Participating", "zh-CN": "分红", "zh-TW": "分紅" },
  "extended-care": { en: "Extended Care", "zh-CN": "扩展保障", "zh-TW": "擴展保障" },
  "multi-currency": { en: "Multi-currency", "zh-CN": "多币种", "zh-TW": "多幣種" },
  "elite": { en: "Elite", "zh-CN": "精英", "zh-TW": "精英" },
  "cancer-multiple-claims": { en: "Cancer Multiple Claims", "zh-CN": "癌症多次赔付", "zh-TW": "癌症多次賠付" },
  "cancer": { en: "Cancer", "zh-CN": "癌症", "zh-TW": "癌症" },
  "affordable": { en: "Affordable", "zh-CN": "经济实惠", "zh-TW": "經濟實惠" },
  "58-conditions": { en: "58 Conditions", "zh-CN": "58种疾病", "zh-TW": "58種疾病" },
  "global": { en: "Global", "zh-CN": "全球", "zh-TW": "全球" },
  "flexible": { en: "Flexible", "zh-CN": "灵活", "zh-TW": "靈活" },
  "wealth": { en: "Wealth", "zh-CN": "财富", "zh-TW": "財富" },
  "income": { en: "Income", "zh-CN": "收入", "zh-TW": "收入" },
  "shield": { en: "Shield", "zh-CN": "保障", "zh-TW": "保障" },
  "bright-care": { en: "Bright Care", "zh-CN": "活耀人生", "zh-TW": "活耀人生" },
  "pro": { en: "Pro", "zh-CN": "专业版", "zh-TW": "專業版" },
};

export function translateTag(tag: string, locale: Locale): string {
  return tagTranslations[tag]?.[locale] || tagTranslations[tag]?.en || tag;
}

// Product name translations
const productNames: Record<string, Record<Locale, string>> = {
  "prudential-ci-plan": { en: "Prudential Critical Illness Plan", "zh-CN": "保诚重疾保障计划", "zh-TW": "保誠重疾保障計劃" },
  "aia-ci-elite": { en: "AIA Critical Illness Elite", "zh-CN": "友邦重疾精英计划", "zh-TW": "友邦重疾精英計劃" },
  "aia-savings-leader": { en: "AIA Savings Leader", "zh-CN": "友邦储蓄领先计划", "zh-TW": "友邦儲蓄領先計劃" },
  "fwd-noble-fortune": { en: "FWD Noble Fortune", "zh-CN": "富卫寰荟致富", "zh-TW": "富衛寰薈致富" },
  "manulife-manucentury": { en: "ManuCentury", "zh-CN": "宏利世纪传承保障计划", "zh-TW": "宏利世紀傳承保障計劃" },
  "manulife-incomeguard-ci": { en: "Manulife IncomeGuard CI", "zh-CN": "宏利宏健守护危疾入息保障", "zh-TW": "宏利宏健守護危疾入息保障" },
  "manulife-incomeshield-ci": { en: "Manulife IncomeShield CI", "zh-CN": "宏利IncomeShield危疾保", "zh-TW": "宏利IncomeShield危疾保" },
  "manulife-bright-care-pro": { en: "Manulife Bright Care Pro", "zh-CN": "宏利活耀人生危疾保", "zh-TW": "宏利活耀人生危疾保" },
  "manulife-prestige-achiever": { en: "Manulife Prestige Achiever", "zh-CN": "宏利Prestige Achiever储蓄", "zh-TW": "宏利Prestige Achiever儲蓄" },
  "fwd-crisis-one-master": { en: "FWD Crisis One Master", "zh-CN": "富卫危疾致尚保", "zh-TW": "富衛危疾緻尚保" },
  "fwd-crisis-u-supporter": { en: "FWD Crisis U Supporter", "zh-CN": "富卫危疾应援保", "zh-TW": "富衛危疾應援保" },
  "fwd-easycover-ci": { en: "FWD EasyCover CI Plan", "zh-CN": "富卫好易拣危疾保障", "zh-TW": "富衛好易揀危疾保障" },
  "fwd-maxfocus-legacy-ii": { en: "FWD MaxFocus Legacy II", "zh-CN": "富卫盈聚天下II", "zh-TW": "富衛盈聚天下II" },
  "fwd-wealthicon-supreme-iii": { en: "FWD WealthICON Supreme III", "zh-CN": "富卫智盈汇聚优越版III", "zh-TW": "富衛智盈匯聚優越版III" },
  "fwd-wealthicon-horizon": { en: "FWD WealthICON Horizon", "zh-CN": "富卫智盈超凡", "zh-TW": "富衛智盈超凡" },
  "aia-cancer-care": { en: "AIA Cancer Care Essence", "zh-CN": "友邦智护癌症保", "zh-TW": "友邦智護癌症保" },
  "aia-executive-care-pro-2": { en: "AIA Executive Care Pro 2", "zh-CN": "友邦泰然安心保2", "zh-TW": "友邦泰然安心保2" },
  "aia-essence-on-your-side": { en: "AIA Essence On Your Side", "zh-CN": "友邦简致·爱伴航", "zh-TW": "友邦簡緻·愛伴航" },
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
  "ping-an-shengshi-jinyue-premium": { en: "Ping An Shengshi Jinyue (Premium)", "zh-CN": "平安盛世金越（尊享版）终身寿险", "zh-TW": "平安盛世金越（尊享版）終身壽險" },
  "pingan-ruyi-quanneng-ci": { en: "Ping An Ruyi Quanneng CI Rider", "zh-CN": "平安附加如意全能提前给付重大疾病保险", "zh-TW": "平安附加如意全能提前給付重大疾病保險" },
  "taikang-zengduoduo": { en: "Taikang Zengduoduo", "zh-CN": "泰康增多多", "zh-TW": "泰康增多多" },
  "taikang-zunxiang-shijia-zeng-e": { en: "Taikang Zunxiang Shijia (Increasing)", "zh-CN": "泰康尊享世家（增额版）", "zh-TW": "泰康尊享世家（增額版）" },
  "taikang-zunxiang-shijia-flagship": { en: "Taikang Zunxiang Shijia (Flagship)", "zh-CN": "泰康尊享世家（旗舰版）", "zh-TW": "泰康尊享世家（旗艦版）" },
  "taikang-lexiangjiankang-2026": { en: "Taikang Lexiang Jiankang 2026", "zh-CN": "泰康乐享健康2026", "zh-TW": "泰康樂享健康2026" },
  "cpic-evergreen-whole-life": { en: "CPIC Evergreen Whole Life", "zh-CN": "太平洋常青终身寿", "zh-TW": "太平洋常青終身壽" },
  "cpic-xiangbanzhizun-2024s": { en: "CPIC Xiangban Zhizun 2024S", "zh-CN": "太保长相伴（至尊2024S）", "zh-TW": "太保長相伴（至尊2024S）" },
  "cpic-jinshengwuyou-kids": { en: "CPIC Jinsheng Wuyou Kids", "zh-CN": "太保金生无忧（少儿版）", "zh-TW": "太保金生無憂（少兒版）" },
  "cpic-wenyingjinsheng-ci": { en: "CPIC Wenying Jinsheng CI", "zh-CN": "太保稳赢金生重疾", "zh-TW": "太保穩贏金生重疾" },
  // New products from cleanup
  "taikang-lexiangjiankang-kids": { en: "Taikang Lexiang Jiankang (Kids B)", "zh-CN": "泰康乐享健康（少儿B款）", "zh-TW": "泰康樂享健康（少兒B款）" },
  "new-china-life-rongyao-xinxiang": { en: "New China Life Rongyao Xinxiang", "zh-CN": "新华荣耀鑫享庆典版", "zh-TW": "新華榮耀鑫享慶典版" },
  "new-china-life-rongyao-shijia": { en: "New China Life Rongyao Shijia", "zh-CN": "新华荣耀世家终身寿险（分红型）", "zh-TW": "新華榮耀世家終身壽險（分紅型）" },
  "new-china-life-jiankang-wuyou": { en: "New China Life Jiankang Wuyou", "zh-CN": "新华健康无忧卓越版", "zh-TW": "新華健康無憂卓越版" },
  "manulife-genesis-centurion": { en: "Genesis Centurion Insurance Plan", "zh-CN": "宏利Genesis Centurion储蓄计划", "zh-TW": "宏利Genesis Centurion儲蓄計劃" },
  "axa-loving-care-ci-enhanced": { en: "AXA Loving Care CI (Enhanced)", "zh-CN": "安盛爱唯守危疾保障（升级版）", "zh-TW": "安盛愛唯守危疾保障（升級版）" },
  "axa-wealth-advance-savings-ii-ultimate": { en: "AXA Wealth Advance Savings II – Ultimate", "zh-CN": "安盛安进储蓄系列II-跃进", "zh-TW": "安盛安進儲蓄系列II-躍進" },
  // 24 selected V1 products (added 2026-06)
  "pingan-fuli-20-ci": { en: "Ping An Fu Li 20 Critical Illness Insurance", "zh-CN": "平安福20重大疾病保险", "zh-TW": "平安福20重大疾病保險" },
  "pingan-ruyi-quanneng-2025-ci": { en: "Ping An Ruyi Quanneng 2025 Critical Illness Insurance", "zh-CN": "平安附加如意全能（2025）提前给付重大疾病保险", "zh-TW": "平安附加如意全能（2025）提前給付重大疾病保險" },
"pingan-shengshi-jinyue-zunxiang-26II": { en: "Ping An Shengshi Jinyue (Zunxiang 26 II) Whole Life (Dividend)", "zh-CN": "平安盛世金越（尊享版26Ⅱ）终身寿险（分红型）", "zh-TW": "平安盛世金越（尊享版26Ⅱ）終身壽險（分紅型）" },
  "pingan-yuxiang-jinyue-2025": { en: "Ping An Yuxiang Jinyue 2025 Whole Life (Dividend)", "zh-CN": "平安御享金越（2025）终身寿险（分红型）", "zh-TW": "平安御享金越（2025）終身壽險（分紅型）" },
  "cpic-jinshengwuyou-2024-kids": { en: "CPIC Jinsheng Wuyou 2024 (Kids) Critical Illness Insurance", "zh-CN": "太保金生无忧2024（少儿版）重大疾病保险", "zh-TW": "太保金生無憂2024（少兒版）重大疾病保險" },
  "taikang-xinxingshijia-2026-qingdianban": { en: "Taikang Xinxing Shijia 2026 (Qingdian Ban) Whole Life (Dividend)", "zh-CN": "鑫享世家2026（庆典版）终身寿险（分红型）", "zh-TW": "鑫享世家2026（慶典版）終身壽險（分紅型）" },
"taikang-xinxingshijia-2026-zunxiangban-b": { en: "Taikang Xinxing Shijia 2026 (Zunxiang Ban B) Whole Life (Dividend)", "zh-CN": "鑫享世家2026（尊享版 B 款）终身寿险（分红型）", "zh-TW": "鑫享世家2026（尊享版 B 款）終身壽險（分紅型）" },
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

export function translateProductName(slug: string, locale: Locale, fallback?: string): string {
  return productNames[slug]?.[locale] || productNames[slug]?.en || fallback || slug;
}

export function translateRegion(region: string, locale: Locale): string {
  return regions[region]?.[locale] || region;
}

// Translate a company object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function translateCompany(company: any, locale: Locale) {
  if (!company) return company as any;
  return {
    ...company,
    displayName: translateCompanyName(company.slug, locale),
    region: translateRegion(company.region, locale),
    description: companyDescriptions[company.slug]?.[locale] || companyDescriptions[company.slug]?.en || company.description,
    headquarters: headquartersTranslations[company.headquarters]?.[locale] || company.headquarters,
    regulator: regulatorTranslations[company.regulator]?.[locale] || company.regulator,
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
  "fwd-wealthicon-supreme-iii": { en: "Premium participating savings plan with comprehensive wealth management features and competitive returns.", "zh-CN": "高端分红型储蓄计划，具备全面财富管理功能和具竞争力的回报。", "zh-TW": "高端分紅型儲蓄計劃，具備全面財富管理功能和具競爭力的回報。" },
  "fwd-wealthicon-horizon": { en: "Long-term wealth accumulation plan with horizon benefits and flexible premium options.", "zh-CN": "长期财富增值计划，提供灵活缴费选择和长期收益。", "zh-TW": "長期財富增值計劃，提供靈活繳費選擇和長期收益。" },
  "prudential-enlit-savings": { en: "A savings insurance series with guaranteed financial support for children's education and lifelong protection.", "zh-CN": "储蓄保险系列，为子女教育提供保证财务支持和终身保障。", "zh-TW": "儲蓄保險系列，為子女教育提供保證財務支援和終身保障。" },
  "prudential-evergreen-growth": { en: "Long-term savings for retirement, education or passing down wealth through the generations.", "zh-CN": "长期储蓄，用于退休、教育或代际财富传承。", "zh-TW": "長期儲蓄，用於退休、教育或代際財富傳承。" },
  "prudential-prime-ace": { en: "The accelerated path to get ahead, build your wealth, and craft a legacy with just 3 years of premiums.", "zh-CN": "仅需3年缴费，快速积累财富、打造传承。", "zh-TW": "僅需3年繳費，快速累積財富、打造傳承。" },
  "prudential-prime-eternity": { en: "Crafting Prime Eternity wealth begins with a single premium: seamlessly grow, access and pass on your wealth for generations.", "zh-CN": "一次性缴费，无缝增长、提取并传承财富。", "zh-TW": "一次性繳費，無縫增長、提取並傳承財富。" },
  "ping-an-shengshi-jinyue-premium": { en: "Premium edition increasing sum insured whole life product with guaranteed cash value growth.", "zh-CN": "增额终身寿险尊享版，保证现金价值增长，适合长期储蓄。", "zh-TW": "增額終身壽險尊享版，保證現金價值增長，適合長期儲蓄。" },
  "pingan-ruyi-quanneng-ci": { en: "Critical illness rider providing advance payment for major diseases.", "zh-CN": "提前给付重大疾病保险附加险，提供重疾保障。", "zh-TW": "提前給付重大疾病保險附加險，提供重疾保障。" },
  "pingan-ruyi-quanneng-main": { en: "Endowment insurance plan paired with critical illness coverage.", "zh-CN": "两全保险搭配重疾保障，提供全面保障。", "zh-TW": "兩全保險搭配重疾保障，提供全面保障。" },
  "taikang-zunxiang-shijia-zeng-e": { en: "Premium increasing sum insured whole life product for long-term wealth accumulation.", "zh-CN": "增额终身寿险高端版，适合长期财富积累。", "zh-TW": "增額終身壽險高端版，適合長期財富累積。" },
  "taikang-zunxiang-shijia-flagship": { en: "Flagship whole life product with comprehensive wealth management features.", "zh-CN": "旗舰版终身寿险，具备全面财富管理功能。", "zh-TW": "旗艦版終身壽險，具備全面財富管理功能。" },
  "taikang-lexiangjiankang-2026": { en: "Comprehensive critical illness insurance covering major and minor conditions with 2026 updates.", "zh-CN": "全面重疾保险，涵盖重大和轻度疾病，2026年更新版。", "zh-TW": "全面重疾保險，涵蓋重大和輕度疾病，2026年更新版。" },
  "cpic-xiangbanzhizun-2024s": { en: "Participating whole life savings plan with premium benefits and dividend distribution.", "zh-CN": "分红型终身寿险储蓄计划，具备高端权益和红利分配。", "zh-TW": "分紅型終身壽險儲蓄計劃，具備高端權益和紅利分配。" },
  "cpic-jinshengwuyou-kids": { en: "Children's critical illness insurance covering major and minor conditions.", "zh-CN": "少儿重疾保险，涵盖重大和轻度疾病。", "zh-TW": "少兒重疾保險，涵蓋重大和輕度疾病。" },
  "cpic-wenyingjinsheng-ci": { en: "Stable critical illness rider providing comprehensive coverage for major diseases.", "zh-CN": "稳赢金生重疾附加险，提供重大疾病全面保障。", "zh-TW": "穩贏金生重疾附加險，提供重大疾病全面保障。" },
  // Manulife product summaries
  "manulife-manucentury": { en: "Premium savings plan for wealth accumulation and intergenerational legacy planning.", "zh-CN": "高端储蓄计划，适合财富积累和代际传承规划。", "zh-TW": "高端儲蓄計劃，適合財富累積和代際傳承規劃。" },
  "manulife-incomeguard-ci": { en: "Critical illness protection with regular income benefit during recovery period.", "zh-CN": "重疾保障，康复期间提供定期收入补贴。", "zh-TW": "重疾保障，康復期間提供定期收入補貼。" },
  "manulife-incomeshield-ci": { en: "Comprehensive critical illness shield with income protection benefits.", "zh-CN": "全面重疾保障，附带收入保障权益。", "zh-TW": "全面重疾保障，附帶收入保障權益。" },
  "manulife-bright-care-pro": { en: "Professional-grade critical illness protection with comprehensive coverage.", "zh-CN": "专业级重疾保障，涵盖全面保障。", "zh-TW": "專業級重疾保障，涵蓋全面保障。" },
  "manulife-prestige-achiever": { en: "Prestigious savings plan for wealth achievement and long-term financial goals.", "zh-CN": "高端储蓄计划，适合财富增值和长期财务目标。", "zh-TW": "高端儲蓄計劃，適合財富增值和長期財務目標。" },
  // New AIA 2026 product summaries
  "aia-on-your-side-2": { en: "Participating critical illness plan providing comprehensive protection with loyalty benefits.", "zh-CN": "分红型重疾计划，提供全面保障和忠诚客户权益。", "zh-TW": "分紅型重疾計劃，提供全面保障和忠誠客戶權益。" },
  "aia-cancer-guardian-3": { en: "Comprehensive cancer protection plan with multiple claim benefits and recovery support.", "zh-CN": "全面癌症保障计划，多次赔付和康复支持。", "zh-TW": "全面癌症保障計劃，多次賠付和康復支援。" },
  "aia-globalflexi-savings": { en: "Global flexible savings plan with multi-currency options for international wealth management.", "zh-CN": "全球灵活储蓄计划，支持多币种，适合国际财富管理。", "zh-TW": "全球靈活儲蓄計劃，支援多幣種，適合國際財富管理。" },
  "aia-wealth-flexi-savings": { en: "Premium wealth savings plan with flexible withdrawal options and competitive returns.", "zh-CN": "高端财富储蓄计划，灵活提取选项和具竞争力的回报。", "zh-TW": "高端財富儲蓄計劃，靈活提取選項和具競爭力的回報。" },
  // New Prudential 2026 product summaries
  "pru-guardian-ci-series": { en: "Participating critical illness plan series offering comprehensive protection for the whole family.", "zh-CN": "分红型重疾保障系列，为全家提供全面保障。", "zh-TW": "分紅型重疾保障系列，為全家提供全面保障。" },
  "pru-ci-extended-care-iii": { en: "Extended critical illness care with multiple claims and comprehensive condition coverage.", "zh-CN": "扩展型重疾保障，多次赔付和全面疾病覆盖。", "zh-TW": "擴展型重疾保障，多次賠付和全面疾病覆蓋。" },
  "pru-entrust-multi-currency": { en: "Multi-currency savings plan for diversified wealth management and intergenerational transfer.", "zh-CN": "多币种储蓄计划，适合多元化财富管理和代际传承。", "zh-TW": "多幣種儲蓄計劃，適合多元化財富管理和代際傳承。" },
  "cpic-evergreen-whole-life": { en: "A whole life savings product with steady cash value growth and flexible withdrawal options.", "zh-CN": "终身寿险储蓄产品，现金价值稳步增长，提取方式灵活。", "zh-TW": "終身壽險儲蓄產品，現金價值穩步增長，提取方式靈活。" },
  // New products from cleanup
  "taikang-lexiangjiankang-kids": { en: "Children's critical illness insurance from Taikang covering major and minor conditions.", "zh-CN": "泰康少儿重疾保险，涵盖重大和轻度疾病。", "zh-TW": "泰康少兒重疾保險，涵蓋重大和輕度疾病。" },
  "new-china-life-rongyao-xinxiang": { en: "Whole life savings product from New China Life for long-term wealth accumulation.", "zh-CN": "新华终身寿险储蓄产品，适合长期财富积累。", "zh-TW": "新華終身壽險儲蓄產品，適合長期財富累積。" },
  "new-china-life-rongyao-shijia": { en: "Participating whole life savings plan from New China Life.", "zh-CN": "新华分红型终身寿险储蓄计划。", "zh-TW": "新華分紅型終身壽險儲蓄計劃。" },
  "new-china-life-jiankang-wuyou": { en: "Comprehensive critical illness insurance from New China Life.", "zh-CN": "新华全面重疾保险。", "zh-TW": "新華全面重疾保險。" },
  "manulife-genesis-centurion": { en: "A new-generation savings plan from Manulife for wealth accumulation and legacy planning.", "zh-CN": "宏利新一代储蓄计划，适合财富积累和传承规划。", "zh-TW": "宏利新一代儲蓄計劃，適合財富累積和傳承規劃。" },
  "axa-loving-care-ci-enhanced": { en: "Comprehensive critical illness protection plan from AXA Hong Kong.", "zh-CN": "安盛全面重疾保障计划。", "zh-TW": "安盛全面重疾保障計劃。" },
  "axa-wealth-advance-savings-ii-ultimate": { en: "Premium savings plan from AXA Hong Kong for wealth accumulation.", "zh-CN": "安盛高端储蓄计划，适合财富积累。", "zh-TW": "安盛高端儲蓄計劃，適合財富累積。" },

};

export function translateProductSummary(slug: string, locale: Locale): string {
  return productSummaries[slug]?.[locale] || productSummaries[slug]?.en || "";
}

// Translate a product object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function translateProduct(product: any, locale: Locale) {
  return {
    ...product,
    displayName: translateProductName(product.slug, locale, product.displayName),
    rawRegion: product.region,
    region: translateRegion(product.region, locale),
    summary: translateProductSummary(product.slug, locale) || product.summary,
    company: product.company ? translateCompany(product.company, locale) : product.company,
  };
}
