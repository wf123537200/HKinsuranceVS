// scripts/plan-db-slug-map.ts
// 为每个 selected 产品选择"最匹配"的 DB slug
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { selectedHotDiscussedInsuranceProducts } from "../data/hot-discussed-products";
import path from "path";

const root = process.cwd();
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(root, "dev.db")}` });
const prisma = new PrismaClient({ adapter });

// 手工指定映射：selected 标准化名 → DB slug
// 选最贴近的官方产品 slug（人工判断，不是脚本判断）
const manualMap: Record<string, string> = {
  // Hong Kong CI
  "aia-hk|「爱伴航」保险计划 2": "aia-on-your-side-2",
  "aia-hk|「简致·爱伴航」保险计划": "aia-essence-on-your-side",
  "aia-hk|环宇盈活储蓄保险计划": "aia-globalflexi-savings",
  "prudential-hk|「诚保一生」危疾保系列": "pru-guardian-ci-series",
  "prudential-hk|危疾加护保 III": "pru-ci-extended-care-iii",
  "manulife-hk|宏利荟健危疾保 / IncomeGuard Critical Illness Protector": "manulife-incomeguard-ci",
  "manulife-hk|活耀人生危疾保 2": "manulife-bright-care-pro",
  "fwd-hk|危疾应援保": "fwd-crisis-u-supporter",
  "axa-hk|爱唯守危疾保障（升级版）/ TotalAssure Plus Critical Illness Plan": "axa-loving-care-ci-enhanced",
  // HK Savings
  "prudential-hk|信守明天多元货币计划": "pru-entrust-multi-currency",
  "prudential-hk|世誉财富": "prudential-prime-eternity",
  "manulife-hk|宏挚传承保障计划": "manulife-genesis-centurion",
  "fwd-hk|盈聚·天下 II": "fwd-maxfocus-legacy-ii",
  "axa-hk|盛利 II 储蓄保险 – 至尊（2年缴） / WealthAhead II Savings Insurance - Supreme 2 Pay": "axa-wealth-advance-savings-ii-ultimate",
  // Mainland CI
  "pingan|平安福20重大疾病保险": "", // 新增
  "pingan|平安如意全能 2025": "", // 新增
  "cpic|金生无忧系列": "cpic-jinshengwuyou-2024-kids",
  "taikang|乐享健康系列": "taikang-lexiangjiankang-2026",
  // Mainland Savings
  "pingan|平安盛世金越系列": "", // 新增
  "pingan|平安御享金越 2025": "", // 新增
  "cpic|长相伴系列": "cpic-xiangbanzhizun-2024s",
  "cpic|长相伴（至尊 2024S）终身寿险（分红型）": "cpic-xiangbanzhizun-2024s",
  "taikang|鑫享世家2026（庆典版）终身寿险（分红型）": "", // 新增
  "taikang|鑫享世家2026（尊享版 B 款）终身寿险（分红型）": "", // 新增
  "new-china-life|荣耀鑫享系列": "new-china-life-rongyao-xinxiang",
  "new-china-life|宏耀世家终身寿险（分红型）": "new-china-life-rongyao-shijia",
};

async function main() {
  const dbSlugs = new Set(
    (await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug)
  );

  console.log("\n=== selected 24 个产品 → DB slug 映射 ===\n");
  for (const sel of selectedHotDiscussedInsuranceProducts) {
    const key = `${sel.company_slug}|${sel.product_name}`;
    const slug = manualMap[key] ?? "❌ 未映射";
    const exists = slug && dbSlugs.has(slug);
    const icon = exists ? "✅" : slug ? "❌" : "🆕";
    console.log(`${icon} [${sel.category}] ${sel.product_name}`);
    console.log(`   DB slug: ${slug || "(需新增)"}`);
  }
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
