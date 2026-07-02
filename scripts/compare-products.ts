import fs from 'fs';

const content = fs.readFileSync('prisma/seed.ts', 'utf-8');

// Extract all products
const regex = /companyId:\s*companies\[(\d+)\]\.id[\s\S]*?displayName:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?dataStatus:\s*"([^"]+)"/g;
const products = [];
let m;
while ((m = regex.exec(content)) !== null) {
  products.push({ companyIdx: parseInt(m[1]), displayName: m[2], category: m[3], dataStatus: m[4] });
}

const companySlugs = ['prudential-hk','aia-hk','manulife-hk','axa-hk','fwd-hk','ping-an','china-life','taikang-life','cpic-life','new-china-life'];

// Selected products from hot-discussed
const selected = [
  { company_slug: "aia-hk", product_name: "「爱伴航」保险计划 2", product_name_en: "On Your Side Insurance Plan 2", category: "critical_illness" },
  { company_slug: "prudential-hk", product_name: "「诚保一生」危疾保系列", product_name_en: "PRUHealth Guardian CI Plan Series", category: "critical_illness" },
  { company_slug: "manulife-hk", product_name: "宏健守护危疾入息保障", product_name_en: null, category: "critical_illness" },
  { company_slug: "manulife-hk", product_name: "活耀人生危疾保 2", product_name_en: "ManuBright Care 2", category: "critical_illness" },
  { company_slug: "fwd-hk", product_name: "危疾应援保", product_name_en: "Crisis U-Supporter Series", category: "critical_illness" },
  { company_slug: "axa-hk", product_name: "爱唯守危疾保障系列", product_name_en: "TotalAssure CI Plan Series", category: "critical_illness" },
  { company_slug: "aia-hk", product_name: "环宇盈活储蓄保险计划", product_name_en: "GlobalFlexi Savings", category: "savings" },
  { company_slug: "prudential-hk", product_name: "信守明天多元货币计划", product_name_en: "Entrust Multi-Currency", category: "savings" },
  { company_slug: "prudential-hk", product_name: "世誉财富", product_name_en: "Prime Eternity", category: "savings" },
  { company_slug: "manulife-hk", product_name: "宏挚传承保障计划", product_name_en: "Genesis Centurion", category: "savings" },
  { company_slug: "fwd-hk", product_name: "盈聚·天下 II", product_name_en: "MaxFocus Legacy II", category: "savings" },
  { company_slug: "axa-hk", product_name: "盛利 II 储蓄保险", product_name_en: "Wealth Elite II", category: "savings" },
  { company_slug: "pingan", product_name: "平安福系列", product_name_en: null, category: "critical_illness" },
  { company_slug: "pingan", product_name: "平安如意全能 2025", product_name_en: null, category: "critical_illness" },
  { company_slug: "cpic", product_name: "金生无忧系列", product_name_en: null, category: "critical_illness" },
  { company_slug: "taikang", product_name: "乐享健康系列", product_name_en: null, category: "critical_illness" },
  { company_slug: "new-china-life", product_name: "健康无忧系列", product_name_en: null, category: "critical_illness" },
  { company_slug: "pingan", product_name: "平安盛世金越系列", product_name_en: null, category: "savings" },
  { company_slug: "pingan", product_name: "平安御享金越 2025", product_name_en: null, category: "savings" },
  { company_slug: "cpic", product_name: "长相伴系列", product_name_en: null, category: "savings" },
  { company_slug: "cpic", product_name: "长相伴（至尊 2024S）终身寿险（分红型）", product_name_en: null, category: "savings" },
  { company_slug: "taikang", product_name: "鑫享世家系列", product_name_en: null, category: "savings" },
  { company_slug: "taikang", product_name: "鑫享世家 2026 尊享版", product_name_en: null, category: "savings" },
  { company_slug: "new-china-life", product_name: "荣耀鑫享系列", product_name_en: null, category: "savings" },
  { company_slug: "new-china-life", product_name: "宏耀世家终身寿险（分红型）", product_name_en: null, category: "savings" },
];

// Normalize company slugs for matching (system uses "ping-an", list uses "pingan"; system uses "cpic-life", list uses "cpic"; system uses "taikang-life", list uses "taikang")
function normalizeSlug(slug: string): string {
  const map: Record<string, string> = {
    'pingan': 'ping-an',
    'cpic': 'cpic-life',
    'taikang': 'taikang-life',
  };
  return map[slug] || slug;
}

// Match logic
for (const s of selected) {
  const sysSlug = normalizeSlug(s.company_slug);
  
  // Try to find matching product in system
  const match = products.find(p => {
    if (companySlugs[p.companyIdx] !== sysSlug) return false;
    if (p.category !== s.category.toUpperCase()) return false;
    // Name match: check if displayName contains key parts
    const dn = p.displayName.toLowerCase();
    const pn = s.product_name.toLowerCase();
    const en = (s.product_name_en || '').toLowerCase();
    return dn.includes(pn.substring(0, 4)) || (en && dn.includes(en.substring(0, 6)));
  });

  const status = match ? (match.dataStatus === 'manual_verified' ? '✅ 在库(manual_verified)' : match.dataStatus === 'candidate' ? '🔶 在库(candidate)' : '❌ 在库(' + match.dataStatus + ')') : '⬜ 不在库';
  const sysName = match ? match.displayName : '—';
  
  console.log(`| ${s.company_slug} | ${s.product_name} | ${sysName} | ${status} |`);
}
