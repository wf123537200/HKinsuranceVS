// scripts/audit-selected-vs-db.ts
// 用 db_slug 字段精准比对 selected 与 DB
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { selectedHotDiscussedInsuranceProducts } from "../data/hot-discussed-products";
import path from "path";

const root = process.cwd();
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(root, "dev.db")}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const companies = await prisma.company.findMany({
    select: { id: true, slug: true, displayName: true },
  });
  const companyBySlug = new Map(companies.map((c) => [c.slug, c]));

  // 收集所有 selected 的 db_slug
  const allDbSlugs = selectedHotDiscussedInsuranceProducts
    .map((s) => s.db_slug)
    .filter((s) => s);
  const dbProducts = await prisma.product.findMany({
    where: { slug: { in: allDbSlugs } },
    select: { slug: true, name: true, companyId: true, category: true, dataStatus: true, localPdfPath: true },
  });
  const dbBySlug = new Map(dbProducts.map((p) => [p.slug, p]));

  console.log("=== selected 24 项精确对照 ===\n");
  console.log("| # | 公司 | 产品 | DB slug | DB 状态 | PDF path |");
  console.log("|---|---|---|---|---|---|");
  let i = 0;
  for (const sel of selectedHotDiscussedInsuranceProducts) {
    i++;
    const db = dbBySlug.get(sel.db_slug);
    if (db) {
      console.log(
        `| ${i} | ${sel.company_name} | ${sel.product_name} | ${db.slug} | ${db.dataStatus} | ${db.localPdfPath ?? "—"} |`
      );
    } else {
      console.log(`| ${i} | ${sel.company_name} | ${sel.product_name} | ❌ 缺失 | — | — |`);
    }
  }

  // 统计
  const missing = selectedHotDiscussedInsuranceProducts.filter((s) => !dbBySlug.has(s.db_slug));
  console.log(`\n=== 统计 ===`);
  console.log(`selected 总数: ${selectedHotDiscussedInsuranceProducts.length}`);
  console.log(`已入库: ${selectedHotDiscussedInsuranceProducts.length - missing.length}`);
  console.log(`待入库: ${missing.length}`);

  // 按公司统计
  console.log(`\n=== 各公司 selected 状态 ===`);
  const byCompany = new Map<string, { selected: number; inDb: number; ci: number; savings: number; missing: string[] }>();
  for (const sel of selectedHotDiscussedInsuranceProducts) {
    const c = sel.company_slug;
    if (!byCompany.has(c)) byCompany.set(c, { selected: 0, inDb: 0, ci: 0, savings: 0, missing: [] });
    const s = byCompany.get(c)!;
    s.selected++;
    if (sel.category === "critical_illness") s.ci++;
    else s.savings++;
    if (dbBySlug.has(sel.db_slug)) s.inDb++;
    else s.missing.push(sel.db_slug);
  }
  for (const [c, v] of byCompany) {
    console.log(`  ${c}: ${v.selected} selected (${v.ci} CI + ${v.savings} Savings) | ${v.inDb} in DB | ${v.missing.length} missing`);
    if (v.missing.length) console.log(`    missing: ${v.missing.join(", ")}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
