/**
 * 热门讨论保险产品清单
 * 
 * 数据来源：10Life 榜单、知乎港险重疾对比、各大保险公司官网、港险测评文章
 * 最后更新：2026-06-15
 * 
 * market_attention 等级：
 *   hot_discussed          — 当前高频讨论
 *   discussed              — 有讨论但热度次之
 *   historically_hot_discussed — 历史热度高，当前在售状态需确认
 */

export interface HotDiscussedProduct {
  company_slug: string;
  company_name: string;
  product_name: string;
  product_name_en: string | null;
  category: 'critical_illness' | 'savings';
  market_attention: 'hot_discussed' | 'discussed' | 'historically_hot_discussed';
  priority: number;
  notes: string;
}

export const hotDiscussedInsuranceProducts: HotDiscussedProduct[] = [
  // =========================
  // AIA Hong Kong / 友邦香港
  // =========================
  {
    company_slug: "aia-hk",
    company_name: "友邦香港",
    product_name: "「爱伴航」保险计划 2",
    product_name_en: "On Your Side Insurance Plan 2",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "香港重疾险高频讨论产品，10Life 热卖重疾横评和知乎港险重疾对比中均出现。"
  },
  {
    company_slug: "aia-hk",
    company_name: "友邦香港",
    product_name: "「简致·爱伴航」保险计划",
    product_name_en: "Essence – On Your Side Insurance Plan",
    category: "critical_illness",
    market_attention: "discussed",
    priority: 2,
    notes: "作为爱伴航系列的简化版本，可作为第二重疾候选。"
  },
  {
    company_slug: "aia-hk",
    company_name: "友邦香港",
    product_name: "环宇盈活储蓄保险计划",
    product_name_en: "GlobalFlexi Savings Insurance Plan",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "10Life 热门多元货币储蓄保险比较中出现，AIA 官网同类产品区也有热门标识。"
  },
  {
    company_slug: "aia-hk",
    company_name: "友邦香港",
    product_name: "盈御多元货币计划 3",
    product_name_en: "Wealth Flexi 3 / Wealth Flexi Savings related product",
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "AIA 多元货币储蓄线产品，官网同类推荐中热度较高，具体英文名和 PDF 需再锁定。"
  },
  {
    company_slug: "aia-hk",
    company_name: "友邦香港",
    product_name: "充裕未来计划 2",
    product_name_en: "Bonus Power Plan 2",
    category: "savings",
    market_attention: "discussed",
    priority: 3,
    notes: "AIA 传统储蓄/分红产品线，讨论热度次于 GlobalFlexi。"
  },

  // =========================
  // Prudential Hong Kong / 保诚香港
  // =========================
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "「诚保一生」危疾保系列",
    product_name_en: "PRUHealth Guardian Critical Illness Plan Series",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "保诚香港重疾高频讨论产品，10Life 热卖重疾横评与知乎港险重疾对比中均出现；官网确认产品存在。"
  },
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "危疾加护保 III",
    product_name_en: "PRUHealth Critical Illness Extended Care III",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 2,
    notes: "保诚危疾产品中讨论量较高，经常与爱伴航、诚保一生一起被比较。"
  },
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "信守明天多元货币计划",
    product_name_en: "Prudential Entrust Multi-Currency Plan",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "保诚储蓄/多元货币产品中讨论较多，适合作为当前储蓄产品候选。"
  },
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "世誉财富",
    product_name_en: "Prime Eternity",
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "保诚高端传承/储蓄类产品，官网和测评文章中均有出现。"
  },
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "Prime Ace Insurance Plan",
    product_name_en: "Prime Ace Insurance Plan",
    category: "savings",
    market_attention: "discussed",
    priority: 3,
    notes: "保诚储蓄型保险产品，讨论热度低于信守明天和 Prime Eternity。"
  },
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "隽富多元货币计划",
    product_name_en: "PRUWealth Multicurrency Plan",
    category: "savings",
    market_attention: "historically_hot_discussed",
    priority: 4,
    notes: "历史讨论热度高，但存在停售线索；适合保留为历史高热产品，不建议直接作为当前在售产品。"
  },

  // =========================
  // Manulife Hong Kong / 宏利香港
  // =========================
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "宏健守护危疾入息保障",
    product_name_en: "ManuBright Care / ManuGuard Medical? Need exact official English name",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "10Life 热卖重疾横评中用于代表宏利的重疾产品；英文名和官网 PDF 需再锁定。"
  },
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "活耀人生危疾保 2",
    product_name_en: "ManuBright Care 2",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 2,
    notes: "宏利重疾产品线中讨论较多，且已有 PDF 向量抽取基础。"
  },
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "守护一生危疾保",
    product_name_en: "ManuPrimo Care",
    category: "critical_illness",
    market_attention: "discussed",
    priority: 3,
    notes: "宏利危疾产品候选，讨论热度低于前两者。"
  },
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "宏挚传承保障计划",
    product_name_en: "Genesis / Genesis Centurion Insurance Plan",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "10Life 热门多元货币储蓄保险比较中出现，宏利储蓄/传承产品线高频讨论。"
  },
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "世纪传承保障计划",
    product_name_en: "ManuCentury",
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "宏利传承/储蓄型产品，港险测评文章中常见。"
  },
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "财挚宏耀保险计划",
    product_name_en: "Prestige Achiever Insurance Plan",
    category: "savings",
    market_attention: "discussed",
    priority: 3,
    notes: "宏利较新的分红储蓄产品，作为储蓄候选保留。"
  },

  // =========================
  // FWD Hong Kong / 富卫香港
  // =========================
  {
    company_slug: "fwd-hk",
    company_name: "富卫香港",
    product_name: "危疾应援保",
    product_name_en: "Crisis U-Supporter Series",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "10Life 终身危疾榜单和多篇港险测评中出现，富卫重疾高频讨论产品。"
  },
  {
    company_slug: "fwd-hk",
    company_name: "富卫香港",
    product_name: "危疾緻尚保",
    product_name_en: "Crisis OneMaster Series",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 2,
    notes: "富卫危疾产品中讨论热度较高，常与 Crisis U-Supporter 一起出现。"
  },
  {
    company_slug: "fwd-hk",
    company_name: "富卫香港",
    product_name: "好易拣危疾保障计划",
    product_name_en: "EasyCover Critical Illness Protection Plan",
    category: "critical_illness",
    market_attention: "discussed",
    priority: 3,
    notes: "富卫简化型危疾候选，讨论热度低于前两者。"
  },
  {
    company_slug: "fwd-hk",
    company_name: "富卫香港",
    product_name: "盈聚·天下 II",
    product_name_en: "MaxFocus Legacy II Insurance Plan",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "10Life 热门多元货币储蓄保险比较中出现，港险储蓄测评高频产品。"
  },
  {
    company_slug: "fwd-hk",
    company_name: "富卫香港",
    product_name: "智盈汇聚（优越版）III",
    product_name_en: "Wealth ICON Supreme III Insurance Plan",
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "富卫储蓄寿险产品，官网和测评文章中常见。"
  },
  {
    company_slug: "fwd-hk",
    company_name: "富卫香港",
    product_name: "智盈·超凡",
    product_name_en: "Wealth ICON Horizon",
    category: "savings",
    market_attention: "discussed",
    priority: 3,
    notes: "富卫储蓄/财富传承候选产品。"
  },

  // =========================
  // AXA Hong Kong / 安盛香港
  // =========================
  {
    company_slug: "axa-hk",
    company_name: "安盛香港",
    product_name: "爱唯守危疾保障（升级版）/ TotalAssure Plus Critical Illness Plan",
    product_name_en: "TotalAssure Plus Critical Illness Plan",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "10Life 终身危疾榜单和港险测评中常见。官方 PDF: https://www.axa.com.hk/total-assure-plus-critical-illness-pb-zh"
  },
  {
    company_slug: "axa-hk",
    company_name: "安盛香港",
    product_name: "TotalAssure Plus Critical Illness Plan",
    product_name_en: "TotalAssure Plus Critical Illness Plan",
    category: "critical_illness",
    market_attention: "discussed",
    priority: 2,
    notes: "AXA 危疾产品线候选，常与 TotalAssure 一起出现。"
  },
  {
    company_slug: "axa-hk",
    company_name: "安盛香港",
    product_name: "盛利 II 储蓄保险",
    product_name_en: "Wealth Elite II",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "港险储蓄横评和 10Life 相关榜单中常见。"
  },
  {
    company_slug: "axa-hk",
    company_name: "安盛香港",
    product_name: "挚汇储蓄计划",
    product_name_en: "Wealth Advance Savings Series II",
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "AXA 多元货币/储蓄型产品候选，讨论热度较高。"
  },
  {
    company_slug: "axa-hk",
    company_name: "安盛香港",
    product_name: "Wealth Ultra Savings Plan",
    product_name_en: "Wealth Ultra Savings Plan",
    category: "savings",
    market_attention: "discussed",
    priority: 3,
    notes: "AXA 储蓄型产品候选。"
  },

  // =========================
  // Ping An / 中国平安
  // =========================
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安福20重大疾病保险",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "historically_hot_discussed",
    priority: 1,
    notes: "大陆重疾险历史讨论量极高，长期高保有量产品；PDF 镜像: https://file.shenlanbao.com/2020/03/26/120032616035448801.pdf （非平安官网直链，是历史产品 PDF 镜像）"
  },
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安盛世福",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 2,
    notes: "平安重疾产品线候选，讨论热度次于平安福。"
  },
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安附加如意全能（2025）提前给付重大疾病保险",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 3,
    notes: "当前新版本产品讨论开始增加，可作为当前产品候选。官方 PDF: https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1770&versionNo=1770-1"
  },
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安盛世金越（尊享版26Ⅱ）终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "大陆终身寿/分红寿险测评中高频出现，适合作为平安储蓄线核心候选。官方 PDF: https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1846&versionNo=1846-1"
  },
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安御享金越（2025）终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "平安储蓄/终身寿当前候选，用于补充盛世金越系列。官方 PDF: https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1790&versionNo=1790-1"
  },
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安盛世金越（尊享版 26Ⅱ）终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 3,
    notes: "平安当前分红型终身寿产品候选，需锁定官方 PDF。"
  },

  // =========================
  // CPIC / 中国太保
  // =========================
  {
    company_slug: "cpic-life",
    company_name: "中国太保",
    product_name: "太保金生无忧2024（少儿版）重大疾病保险",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "太保重疾讨论主要集中在金生无忧系列。官方 PDF（少儿版）: https://www.cpic.com.cn/upload/resources/file/2024/09/10/82230.pdf （成人版暂未锁定）"
  },
  {
    company_slug: "cpic-life",
    company_name: "中国太保",
    product_name: "金生无忧 2024 成人版",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 2,
    notes: "金生无忧系列当前版本候选，需确认官方产品说明书。成人版暂未锁定 PDF。"
  },
  {
    company_slug: "cpic-life",
    company_name: "中国太保",
    product_name: "金生无忧 2024 少儿版",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 3,
    notes: "太保少儿重疾候选。"
  },
  {
    company_slug: "cpic-life",
    company_name: "中国太保",
    product_name: "长相伴系列",
    product_name_en: null,
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "太保终身寿/储蓄型产品中讨论较多，常见于增额寿、分红寿测评。"
  },
  {
    company_slug: "cpic-life",
    company_name: "中国太保",
    product_name: "长相伴（至尊 2024S）终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "太保当前分红型终身寿候选，适合后续下载 PDF 抽向量。"
  },

  // =========================
  // Taikang / 泰康保险
  // =========================
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "泰康乐享健康2026重大疾病保险",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "泰康重疾讨论主要集中在乐享健康系列。官方 PDF: https://m.taikanglife.com/mobile/uploader/pubProductFile/2025/09/12/ff1fff61-1fbe-4790-b560-d48fb581a55a.pdf"
  },
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "乐享健康 2026",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 2,
    notes: "泰康当前重疾产品候选，需锁定官方 PDF。"
  },
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "乐享健康少儿版",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 3,
    notes: "泰康少儿重疾候选。"
  },
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "鑫享世家2026终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "泰康储蓄/终身寿讨论主要集中在鑫享世家系列。暂未锁定直链；先从泰康产品披露页搜索“鑫享世家2026 终身寿险 分红型 产品说明书”。不要误用乐享健康2026 PDF。"
  },
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "鑫享世家2026（尊享版）终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "泰康当前储蓄/分红寿产品候选。暂未锁定直链；先从泰康产品披露页搜索“鑫享世家2026 尊享版 产品说明书”。必须锁定“尊享版”，不要用普通版冒充。"
  },
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "尊享世家系列",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 3,
    notes: "泰康终身寿/储蓄候选产品线。"
  },

  // =========================
  // New China Life / 新华保险
  // =========================
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "健康无忧卓越版重大疾病保险",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "新华重疾讨论主要集中在健康无忧系列。官网产品页: https://www.newchinalife.com/spage/cn/266/62834.html （未找到直接 PDF；可先抓页面结构或继续找 PDF）"
  },
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "健康无忧卓越版",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 2,
    notes: "新华当前重疾候选，需确认官方产品说明书。"
  },
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "安心保臻选版定期重大疾病保险",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 3,
    notes: "新华定期重疾候选，讨论热度低于健康无忧。"
  },
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "荣耀鑫享智赢版终身寿险",
    product_name_en: null,
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    notes: "新华终身寿/储蓄产品中讨论较多。官方 PDF: https://static-cdn.newchinalife.com/ncl/pdf/20240912/d93fa785-d054-47d4-88e5-e02f1e791378.pdf （注意已有停售公告，标 historical/current_status_check）"
  },
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "荣耀鑫享智赢版终身寿险",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    notes: "新华当前储蓄/终身寿候选，有媒体和渠道讨论线索。"
  },
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "宏耀世家终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 3,
    notes: "新华银代/分红寿险候选。邮储渠道 PDF: https://www.psbc.com/cn/grfw/tzlc/bx/hlwbxxxpl/cpfwgg/202410/P020241023511457652534.pdf （邮储渠道 PDF，可直接下载；新华官网分红实现率页可辅助确认）"
  },
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "盛世荣耀智赢版终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 4,
    notes: "新华分红寿候选，需确认当前在售状态。"
  },
];

// =========================
// 精选产品清单
// 从 hotDiscussedInsuranceProducts 中筛选出的 V1 重点产品
// =========================

export interface SelectedProduct {
  company_slug: string;
  company_name: string;
  product_name: string;
  product_name_en: string | null;
  category: 'critical_illness' | 'savings';
  market_attention: 'hot_discussed' | 'discussed' | 'historically_hot_discussed';
  priority: number;
  selected_reason: string;
  /** 补充信息（可空）— 比如产品下载链接、状态等 */
  notes?: string;
  /** DB 中对应的 product.slug（V1 项目基底，指向具体产品）；空字符串表示需新增 */
  db_slug: string;
  /** PDF 归档文件名（public/pdfs-by-company/{company}/...） */
  pdf_path: string;
}

export const selectedHotDiscussedInsuranceProducts: SelectedProduct[] = [
  // =========================
  // Hong Kong - Critical Illness
  // =========================
  {
    company_slug: "aia-hk",
    company_name: "友邦香港",
    product_name: "「爱伴航」保险计划 2",
    product_name_en: "On Your Side Insurance Plan 2",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "友邦香港重疾险代表产品，10Life 热卖重疾横评中出现。",
    db_slug: "aia-on-your-side-2",
    pdf_path: "public/pdfs-by-company/aia-hk/aia-on-your-side-2.pdf",
  },
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "「诚保一生」危疾保系列",
    product_name_en: "PRUHealth Guardian Critical Illness Plan Series",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "保诚香港重疾险高频讨论产品，10Life 热卖重疾横评中出现，官网也有产品页。",
    db_slug: "pru-guardian-ci-series",
    pdf_path: "public/pdfs-by-company/prudential-hk/pru-guardian-ci-series.pdf",
  },
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "宏利荟健危疾保 / IncomeGuard Critical Illness Protector",
    product_name_en: "IncomeGuard Critical Illness Protector",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "10Life 友邦、保诚、宏利热卖重疾横评中用于代表宏利的产品。",
    notes: "官方 PDF: https://www.manulife.com.hk/content/dam/insurance/hk/zh-hk/documents/products/health/incomeguard-critical-illness-protector.pdf （注：宏利官网 DAM 限制直链下载，需浏览器访问）",
    db_slug: "manulife-incomeguard-ci",
    pdf_path: "public/pdfs-by-company/manulife-hk/incomeguard-critical-illness-protector.pdf",
  },
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "活耀人生危疾保 2",
    product_name_en: "ManuBright Care 2",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 2,
    selected_reason: "宏利重疾线高频产品，且目前已经有 PDF 和向量基础，可作为宏利重疾备选。",
    db_slug: "manulife-bright-care-pro",
    pdf_path: "public/pdfs-by-company/manulife-hk/manulife-bright-care-pro.pdf",
  },
  {
    company_slug: "fwd-hk",
    company_name: "富卫香港",
    product_name: "危疾应援保",
    product_name_en: "Crisis U-Supporter Series",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "富卫重疾险高频讨论产品，10Life 终身危疾榜单和港险测评中常见。",
    db_slug: "fwd-crisis-u-supporter",
    pdf_path: "public/pdfs-by-company/fwd-hk/fwd-crisis-u-supporter.pdf",
  },
  {
    company_slug: "axa-hk",
    company_name: "安盛香港",
    product_name: "爱唯守危疾保障（升级版）/ TotalAssure Plus Critical Illness Plan",
    product_name_en: "TotalAssure Plus Critical Illness Plan",
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "AXA 香港重疾险代表产品，10Life 终身危疾榜单和港险测评中常见。官方 PDF: https://www.axa.com.hk/total-assure-plus-critical-illness-pb-zh",
    db_slug: "axa-loving-care-ci-enhanced",
    pdf_path: "public/pdfs-by-company/axa-hk/axa-total-assure-plus-ci.pdf",
  },

  // =========================
  // Hong Kong - Savings
  // =========================
  {
    company_slug: "aia-hk",
    company_name: "友邦香港",
    product_name: "环宇盈活储蓄保险计划",
    product_name_en: "GlobalFlexi Savings Insurance Plan",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "10Life 热门多元货币储蓄保险比较中出现，AIA 官网同类产品区域也有热门标识。",
    db_slug: "aia-globalflexi-savings",
    pdf_path: "public/pdfs-by-company/aia-hk/aia-globalflexi-savings.pdf",
  },
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "信守明天多元货币计划",
    product_name_en: "Prudential Entrust Multi-Currency Plan",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "保诚当前多元货币储蓄产品中讨论较多，适合作为保诚储蓄主产品。",
    db_slug: "pru-entrust-multi-currency",
    pdf_path: "public/pdfs-by-company/prudential-hk/pru-entrust-multi-currency.pdf",
  },
  {
    company_slug: "prudential-hk",
    company_name: "保诚香港",
    product_name: "世誉财富",
    product_name_en: "Prime Eternity",
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    selected_reason: "保诚高端传承/储蓄产品，适合作为保诚储蓄备选。",
    db_slug: "prudential-prime-eternity",
    pdf_path: "public/pdfs-by-company/prudential-hk/prime-eternity-en.pdf",
  },
  {
    company_slug: "manulife-hk",
    company_name: "宏利香港",
    product_name: "宏挚传承保障计划",
    product_name_en: "Genesis / Genesis Centurion Insurance Plan",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "10Life 热门多元货币储蓄保险比较中出现，宏利储蓄/传承线高频产品。",
    db_slug: "manulife-genesis-centurion",
    pdf_path: "public/pdfs-by-company/manulife-hk/genesis-centurion.pdf",
  },
  {
    company_slug: "fwd-hk",
    company_name: "富卫香港",
    product_name: "盈聚·天下 II",
    product_name_en: "MaxFocus Legacy II Insurance Plan",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "10Life 热门多元货币储蓄保险比较中出现，港险储蓄测评高频产品。",
    db_slug: "fwd-maxfocus-legacy-ii",
    pdf_path: "public/pdfs-by-company/fwd-hk/fwd-maxfocus-legacy-ii.pdf",
  },
  {
    company_slug: "axa-hk",
    company_name: "安盛香港",
    product_name: "盛利 II 储蓄保险 – 至尊（2年缴） / WealthAhead II Savings Insurance - Supreme 2 Pay",
    product_name_en: "WealthAhead II Savings Insurance - Supreme 2 Pay",
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "AXA 储蓄线高频测评产品，常见于港险储蓄横评。",
    notes: "官方 PDF: https://www.axa.com.hk/wealth-ahead-ii-savings-insurance-2-pay-product-brochure-supreme-zh",
    db_slug: "axa-wealth-advance-savings-ii-ultimate",
    pdf_path: "public/pdfs-by-company/axa-hk/axa-wealth-ahead-ii-supreme-2pay.pdf",
  },

  // =========================
  // Mainland China - Critical Illness
  // =========================
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安福20重大疾病保险",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "historically_hot_discussed",
    priority: 1,
    selected_reason: "大陆重疾险历史讨论量极高，适合作为历史高热度产品；当前在售状态需另行确认。PDF 镜像: https://file.shenlanbao.com/2020/03/26/120032616035448801.pdf",
    db_slug: "pingan-fuli-20-ci",
    pdf_path: "public/pdfs-by-company/ping-an/pingan-fuli-20-ci-平安福20重大疾病保险.pdf",
  },
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安如意全能 2025",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "discussed",
    priority: 2,
    selected_reason: "平安当前重疾候选产品，用于补足当前在售方向。",
    db_slug: "pingan-ruyi-quanneng-2025-ci",
    pdf_path: "public/pdfs-by-company/ping-an/pingan-ruyi-quanneng-2025-ci-平安如意全能2025.pdf",
  },
  {
    company_slug: "cpic-life",
    company_name: "中国太保",
    product_name: "金生无忧系列",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "太保重疾讨论主要集中在金生无忧系列。",
    db_slug: "cpic-jinshengwuyou-2024-kids",
    pdf_path: "public/pdfs-by-company/cpic-life/cpic-jinshengwuyou-2024-kids-金生无忧系列.pdf",
  },
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "乐享健康系列",
    product_name_en: null,
    category: "critical_illness",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "泰康重疾讨论主要集中在乐享健康系列。",
    db_slug: "taikang-lexiangjiankang-2026",
    pdf_path: "public/pdfs-by-company/taikang-life/taikang-lexiangjiankang-2026-泰康乐享健康2026重大疾病保险.pdf",
  },

  // =========================
  // Mainland China - Savings / Whole Life
  // =========================
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安盛世金越系列",
    product_name_en: null,
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "大陆终身寿/分红寿险测评中高频出现，新华网等公开报道也有盛世金越相关信息。",
    db_slug: "pingan-shengshi-jinyue-zunxiang-26II",
    pdf_path: "public/pdfs-by-company/ping-an/pingan-shengshi-jinyue-zunxiang-26II-平安盛世金越系列.pdf",
  },
  {
    company_slug: "ping-an",
    company_name: "中国平安",
    product_name: "平安御享金越 2025",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    selected_reason: "平安储蓄/终身寿当前候选，用于补充盛世金越系列。",
    db_slug: "pingan-yuxiang-jinyue-2025",
    pdf_path: "public/pdfs-by-company/ping-an/pingan-yuxiang-jinyue-2025-平安御享金越2025.pdf",
  },
  {
    company_slug: "cpic-life",
    company_name: "中国太保",
    product_name: "长相伴系列",
    product_name_en: null,
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "太保终身寿/储蓄型产品中讨论较多，常见于增额寿、分红寿测评。",
    db_slug: "cpic-xiangbanzhizun-2024s",
    pdf_path: "public/pdfs-by-company/cpic-life/cpic-xiangbanzhizun-2024s-长相伴系列-长相伴（至尊2024S）终身寿险（分红型）.pdf",
  },
  {
    company_slug: "cpic-life",
    company_name: "中国太保",
    product_name: "长相伴（至尊 2024S）终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    selected_reason: "太保当前分红型终身寿候选，适合后续锁 PDF。",
    db_slug: "cpic-xiangbanzhizun-2024s",
    pdf_path: "public/pdfs-by-company/cpic-life/cpic-xiangbanzhizun-2024s-长相伴系列-长相伴（至尊2024S）终身寿险（分红型）.pdf",
  },
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "鑫享世家2026（庆典版）终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "泰康储蓄/终身寿讨论主要集中在鑫享世家系列。",
    notes: "已补充 PDF: pdfs-by-company/taikang-life/泰康鑫享世家 2026（庆典版）终身寿险（分红型）.pdf",
    db_slug: "taikang-xinxingshijia-2026-qingdianban",
    pdf_path: "public/pdfs-by-company/taikang-life/泰康鑫享世家 2026（庆典版）终身寿险（分红型）.pdf",
  },
  {
    company_slug: "taikang-life",
    company_name: "泰康保险",
    product_name: "鑫享世家2026（尊享版 B 款）终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    selected_reason: "标准化名称：泰康鑫享世家 2026（尊享版 B 款）终身寿险（分红型）。",
    notes: "已补充 PDF: pdfs-by-company/taikang-life/泰康鑫享世家 2026（尊享版 B 款）终身寿险（分红型）.pdf",
    db_slug: "taikang-xinxingshijia-2026-zunxiangban-b",
    pdf_path: "public/pdfs-by-company/taikang-life/泰康鑫享世家 2026（尊享版 B 款）终身寿险（分红型）.pdf",
  },
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "荣耀鑫享系列",
    product_name_en: null,
    category: "savings",
    market_attention: "hot_discussed",
    priority: 1,
    selected_reason: "新华终身寿/储蓄产品中讨论较多。",
    db_slug: "new-china-life-rongyao-xinxiang",
    pdf_path: "public/pdfs-by-company/new-china-life/ncl-rongyao-xinxiang-zhiyingban-荣耀鑫享系列.pdf",
  },
  {
    company_slug: "new-china-life",
    company_name: "新华保险",
    product_name: "宏耀世家终身寿险（分红型）",
    product_name_en: null,
    category: "savings",
    market_attention: "discussed",
    priority: 2,
    selected_reason: "新华银代/分红寿险候选，适合后续锁 PDF。",
    db_slug: "new-china-life-rongyao-shijia",
    pdf_path: "public/pdfs-by-company/new-china-life/ncl-hongyao-shijia-宏耀世家终身寿险（分红型）.pdf",
  },
];


