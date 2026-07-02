// scripts/find-off-list-products.ts
// 直接从 SQLite 数据库查询所有产品，然后与 selected 列表做匹配
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";

const root = process.cwd();
const dbPath = path.join(root, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    include: { company: { select: { slug: true, displayName: true } } },
    orderBy: [{ company: { slug: "asc" } }, { slug: "asc" }],
  });

  console.log(`DB 产品总数: ${products.length}\n`);

  // 从 hot-discussed-products.ts 读 selected 列表
  const hotText = fs.readFileSync(
    path.join(root, "data", "hot-discussed-products.ts"),
    "utf8"
  );
  const startIdx = hotText.indexOf("selectedHotDiscussedInsuranceProducts");
  const arrayStart = hotText.indexOf("[", startIdx);
  const arrayEnd =
    hotText.indexOf("\n];\n", arrayStart) >= 0
      ? hotText.indexOf("\n];\n", arrayStart)
      : hotText.length;
  const selectedBlock = hotText.substring(arrayStart, arrayEnd);

  // 提取 selected 列表的 product_name (中文) 和 product_name_en (英文)
  const productNameRe = /\{\s*([\s\S]*?)\}/g;
  const selectedItems: { cn: string; en: string | null; slug: string }[] = [];
  let itemMatch: RegExpExecArray | null;
  while ((itemMatch = productNameRe.exec(selectedBlock)) !== null) {
    const body = itemMatch[1];
    const cn = (body.match(/product_name:\s*"([^"]+)"/) || [])[1] || null;
    const enRaw = (body.match(/product_name_en:\s*"([^"]+)"/) || [])[1] || null;
    const en = enRaw === "null" || !enRaw ? null : enRaw;
    const slug = (body.match(/company_slug:\s*"([^"]+)"/) || [])[1] || "";
    if (cn) selectedItems.push({ cn, en, slug });
  }
  console.log(`Selected 列表产品数: ${selectedItems.length}\n`);

  function matches(p: any): { cn: string; en: string | null } | null {
    const dbName = p.name || "";
    const dbDisplay = p.displayName || "";
    const dbSlug = p.company?.slug || "";

    // 通用 token 化：把中文和英文都按"非中文且非数字"分割；中文按字切分太细，改用关键词窗口
    const norm = (s: string) =>
      s
        .replace(/[「」（）()【】\[\]『』"']/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const dbNameLow = norm(dbName);
    const dbDisplayLow = norm(dbDisplay);

    for (const sel of selectedItems) {
      // 1) 公司必须匹配
      if (sel.slug !== dbSlug) continue;

      const selCn = sel.cn;
      const selEnLow = sel.en ? norm(sel.en) : "";

      // 2) 英文名子串匹配
      if (selEnLow && (dbNameLow.includes(selEnLow) || selEnLow.includes(dbNameLow))) {
        return sel;
      }

      // 3) 中文名子串匹配
      if (selCn && (dbName.includes(selCn) || selCn.includes(dbName))) return sel;

      // 4) 关键词窗口匹配：把 selected 中文按"明显分隔符 + 标点"切成关键词，
      //    要求至少一个 ≥3 字符的关键词同时出现在 dbName 或 dbDisplay 中
      const kws = selCn
        .split(/[「」（）()【】\[\]『』"'\s·、,，\.。!！?？:：]+/)
        .filter((k) => k.length >= 3);
      if (kws.length === 0) continue;
      const hitKw = kws.find(
        (k) => dbName.includes(k) || dbDisplay.includes(k)
      );
      if (hitKw) return sel;
    }
    return null;
  }

  const inList: any[] = [];
  const offList: any[] = [];
  for (const p of products) {
    const hit = matches(p);
    if (hit) inList.push({ ...p, matched: hit });
    else offList.push(p);
  }

  console.log(`=== 在 selected 列表中的产品 ${inList.length} ===`);
  for (const p of inList) {
    const icon =
      p.dataStatus === "manual_verified" ? "✅" : p.dataStatus === "candidate" ? "🔶" : "❓";
    console.log(
      `${icon} [${p.dataStatus}] ${p.company.slug} | ${p.name}  ->  [${p.matched.cn}] ${p.matched.en || ""}`
    );
  }

  console.log(`\n=== 离群产品（不在 selected 列表中）${offList.length} ===`);
  for (const p of offList) {
    const icon =
      p.dataStatus === "manual_verified"
        ? "✅"
        : p.dataStatus === "candidate"
        ? "🔶"
        : p.dataStatus === "needs_verification"
        ? "⚠️"
        : p.dataStatus === "out_of_scope"
        ? "⛔"
        : p.dataStatus === "published"
        ? "🚀"
        : "❓";
    console.log(
      `${icon} [${p.dataStatus || "n/a"}] ${p.company.slug} | ${p.name}  (${p.category})`
    );
    if (p.displayName && p.displayName !== p.name) {
      console.log(`     displayName: ${p.displayName}`);
    }
  }

  // 反向：selected 列表中有但 DB 没有的产品
  const matchedSelectedCns = new Set(inList.map((x) => x.matched.cn));
  const missingFromDb = selectedItems.filter(
    (s) => !matchedSelectedCns.has(s.cn)
  );
  console.log(`\n=== selected 列表有但 DB 没有的 ${missingFromDb.length} ===`);
  for (const m of missingFromDb) {
    console.log(`  ${m.slug} | ${m.cn}  (${m.en || "无 EN"})`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
