// scripts/selected-with-pdf.ts
// 输出 selectedHotDiscussedInsuranceProducts 中"有 PDF"的产品的表格
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";
import { hotDiscussedInsuranceProducts, selectedHotDiscussedInsuranceProducts } from "../data/hot-discussed-products";

const root = process.cwd();
const dbPath = path.join(root, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

// 1) 把 selected 列表里的 product_name 都查一遍 DB，按 company_slug 限定
async function main() {
  const dbProducts = await prisma.product.findMany({
    include: { company: { select: { slug: true, displayName: true } } },
  });

  // 给每个 selected 找出所有可能命中的 DB 产品（按公司 + 名匹配）
  function findDbMatches(sel: { company_slug: string; product_name: string; product_name_en: string | null }) {
    const selCn = sel.product_name;
    const selEnLow = (sel.product_name_en || "").toLowerCase().replace(/[「」（）()【】\[\]『』"']/g, "");
    const norm = (s: string) =>
      s
        .replace(/[「」（）()【】\[\]『』"']/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    return dbProducts.filter((p) => {
      if (p.company.slug !== sel.company_slug) return false;
      const dbName = p.name || "";
      const dbDisplay = p.displayName || "";
      // 1) 英文名子串
      if (selEnLow) {
        if (norm(dbName).includes(selEnLow) || selEnLow.includes(norm(dbName))) return true;
      }
      // 2) 中文名子串
      if (dbName.includes(selCn) || selCn.includes(dbName)) return true;
      // 3) 关键词（>=3 字符）
      const kws = selCn
        .split(/[「」（）()【】\[\]『』"'\s·、,，\.。!！?？:：]+/)
        .filter((k) => k.length >= 3);
      if (kws.some((k) => dbName.includes(k) || dbDisplay.includes(k))) return true;
      return false;
    });
  }

  // 检查 PDF 是否真的存在于磁盘
  // localPdfPath 形如 "/pdfs/xxx.pdf"，相对路径以 public/ 为根
  function pdfExists(p: { localPdfPath: string | null; dataStatus: string | null; manualDownloadVerified: boolean }): { has: boolean; path: string | null; absPath: string | null } {
    if (!p.localPdfPath) return { has: false, path: null, absPath: null };
    // 去掉前导斜杠
    const rel = p.localPdfPath.replace(/^\/+/, "");
    const candidates = [
      path.join(root, "public", rel),
      path.join(root, rel),
    ];
    for (const abs of candidates) {
      if (fs.existsSync(abs)) return { has: true, path: p.localPdfPath, absPath: abs };
    }
    return { has: false, path: p.localPdfPath, absPath: candidates[0] };
  }

  console.log("\n=== selected 列表 26 个产品 × PDF 状态 ===\n");
  const rows: Array<{
    idx: number;
    company: string;
    product: string;
    en: string;
    cat: string;
    attention: string;
    priority: number;
    matchedDb: string;
    dbStatus: string;
    pdfPath: string;
    pdfExists: string;
    manualVerified: string;
  }> = [];

  let i = 1;
  for (const sel of selectedHotDiscussedInsuranceProducts) {
    const matches = findDbMatches(sel);
    if (matches.length === 0) {
      rows.push({
        idx: i++,
        company: sel.company_name,
        product: sel.product_name,
        en: sel.product_name_en || "—",
        cat: sel.category,
        attention: sel.market_attention,
        priority: sel.priority,
        matchedDb: "❌ 未在 DB 中找到",
        dbStatus: "—",
        pdfPath: "—",
        pdfExists: "—",
        manualVerified: "—",
      });
      continue;
    }
    for (const m of matches) {
      const pdf = pdfExists(m);
      rows.push({
        idx: i++,
        company: m.company.displayName,
        product: sel.product_name,
        en: sel.product_name_en || "—",
        cat: sel.category,
        attention: sel.market_attention,
        priority: sel.priority,
        matchedDb: `${m.name} (${m.company.slug})`,
        dbStatus: m.dataStatus || "—",
        pdfPath: pdf.path || "—",
        pdfExists: pdf.has ? "✅ 存在" : "❌ 不存在",
        manualVerified: m.manualDownloadVerified ? "✅" : "—",
      });
    }
    // 多个匹配也要算 i
  }

  // 排序：有 PDF 的排前面
  rows.sort((a, b) => {
    const aHas = a.pdfExists.includes("✅") ? 0 : 1;
    const bHas = b.pdfExists.includes("✅") ? 0 : 1;
    if (aHas !== bHas) return aHas - bHas;
    return a.idx - b.idx;
  });

  // 输出 markdown 表格
  console.log("| # | 公司 | 产品 | 类别 | 热度 | 优先级 | DB 匹配 | dataStatus | localPdfPath | 文件存在 | 人工验证 |");
  console.log("|---|---|---|---|---|---|---|---|---|---|---|");
  for (const r of rows) {
    console.log(
      `| ${r.idx} | ${r.company} | ${r.product}<br/>EN: ${r.en} | ${r.cat} | ${r.attention} | ${r.priority} | ${r.matchedDb} | ${r.dbStatus} | \`${r.pdfPath}\` | ${r.pdfExists} | ${r.manualVerified} |`
    );
  }

  // 单独汇总
  const withPdf = rows.filter((r) => r.pdfExists.includes("✅"));
  const noPdf = rows.filter((r) => !r.pdfExists.includes("✅") && r.matchedDb !== "❌ 未在 DB 中找到");
  const missing = rows.filter((r) => r.matchedDb === "❌ 未在 DB 中找到");

  console.log(`\n=== 汇总 ===`);
  console.log(`selected 列表总数: ${selectedHotDiscussedInsuranceProducts.length}`);
  console.log(`有 PDF 文件存在: ${withPdf.length}`);
  console.log(`在 DB 但无 PDF / PDF 不存在: ${noPdf.length}`);
  console.log(`未在 DB 中找到: ${missing.length}`);

  console.log(`\n--- 有 PDF 的 ${withPdf.length} 个 ---`);
  for (const r of withPdf) {
    console.log(`✅ ${r.company} | ${r.product}  →  ${r.pdfPath}`);
  }

  console.log(`\n--- DB 有但 PDF 不存在 / 无 path 的 ${noPdf.length} 个 ---`);
  for (const r of noPdf) {
    console.log(`⚠️ ${r.company} | ${r.product}  →  ${r.matchedDb}  status=${r.dbStatus}`);
  }

  console.log(`\n--- DB 里完全没找到的 ${missing.length} 个 ---`);
  for (const r of missing) {
    console.log(`❌ ${r.company} | ${r.product}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
