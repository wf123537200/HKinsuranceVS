// scripts/reorganize-pdfs.ts
// One-shot PDF reorganization:
// 1. Move 45 unused PDFs -> public/other-pdf/  (kept in public for safekeeping, not referenced by DB)
// 2. Copy 38 active PDFs -> docs/product-vectors/pdfs/{slug}.pdf  (renamed, for ChatGPT extraction)
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import fs from "fs";

const ad = new PrismaBetterSqlite3({ url: `file:${path.join(process.cwd(), "dev.db")}` });
const p = new PrismaClient({ adapter: ad });

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OTHER_PDF_DIR = path.join(PUBLIC_DIR, "other-pdf");
const VECTORS_DIR = path.join(process.cwd(), "docs", "product-vectors", "pdfs");
const VECTORS_EXTRACTIONS_DIR = path.join(process.cwd(), "docs", "product-vectors", "extractions");

async function main() {
  // 1. Ensure dirs exist
  fs.mkdirSync(OTHER_PDF_DIR, { recursive: true });
  fs.mkdirSync(VECTORS_DIR, { recursive: true });
  fs.mkdirSync(VECTORS_EXTRACTIONS_DIR, { recursive: true });
  console.log("Created directories");

  // 2. Collect all PDFs under public/ (excluding destination other-pdf/)
  const allPdfs: string[] = [];
  function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "other-pdf") continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.toLowerCase().endsWith(".pdf")) allPdfs.push(full);
    }
  }
  walk(PUBLIC_DIR);
  console.log(`Found ${allPdfs.length} PDFs under public/`);

  // 3. Get active products
  const products = await p.product.findMany({
    where: { dataStatus: { in: ["manual_verified", "candidate"] }, localPdfPath: { not: null } },
    select: { slug: true, localPdfPath: true },
  });
  console.log(`Active products with PDF: ${products.length}`);

  // 4. Build map: current pdf path -> product slug
  const usedByProduct = new Map<string, string>();
  for (const prod of products) {
    const abs = path.join(PUBLIC_DIR, prod.localPdfPath!.replace(/^\//, ""));
    usedByProduct.set(abs, prod.slug);
  }

  // 5. Move/copy each PDF
  let activeCopied = 0;
  let unusedMoved = 0;
  for (const abs of allPdfs) {
    if (usedByProduct.has(abs)) {
      const slug = usedByProduct.get(abs)!;
      const dest = path.join(VECTORS_DIR, `${slug}.pdf`);
      fs.copyFileSync(abs, dest);
      activeCopied++;
    } else {
      const filename = path.basename(abs);
      let dest = path.join(OTHER_PDF_DIR, filename);
      if (fs.existsSync(dest)) {
        const ext = path.extname(filename);
        const stem = path.basename(filename, ext);
        let counter = 1;
        while (fs.existsSync(path.join(OTHER_PDF_DIR, `${stem}-${counter}${ext}`))) counter++;
        dest = path.join(OTHER_PDF_DIR, `${stem}-${counter}${ext}`);
      }
      fs.renameSync(abs, dest);
      unusedMoved++;
    }
  }

  console.log(`\nDone:`);
  console.log(`  Copied ${activeCopied} active PDFs to ${VECTORS_DIR}`);
  console.log(`  Moved ${unusedMoved} unused PDFs to ${OTHER_PDF_DIR}`);

  // 6. Verify DB paths still resolve
  let broken = 0;
  for (const prod of products) {
    const abs = path.join(PUBLIC_DIR, prod.localPdfPath!.replace(/^\//, ""));
    if (!fs.existsSync(abs)) {
      console.log(`  BROKEN: ${prod.slug} -> ${prod.localPdfPath}`);
      broken++;
    }
  }
  console.log(`  ${broken === 0 ? "All" : broken + " broken of " + products.length} 38 product PDF paths still resolve`);

  await p.$disconnect();
}
main();