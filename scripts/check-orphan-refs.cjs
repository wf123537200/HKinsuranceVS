// scripts/check-orphan-refs.cjs
// Cascade-delete DB products that have no matching vector file. Plan:
//   1. Snapshot orphan product ids (no matching vector on disk).
//   2. Find every comparison row that references those ids (either side).
//   3. Delete in this order inside a single transaction:
//        - comparisons (no FK cascade; explicit delete)
//        - critical_illness_details, savings_details, product_sources
//          (FK is Cascade in schema; explicit anyway so the audit log
//          shows what was cleaned)
//        - products (root rows)
//
// Default mode is dry-run (prints the plan, makes no writes). Pass
// --apply to actually delete. Always wraps writes in a single SQLite
// transaction with journal_mode = WAL so a crash mid-script rolls back.

const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const vectorsDir = "data/vectors";
const dbPath = process.env.DATABASE_PATH || "dev.db";
const apply = process.argv.includes("--apply");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// 1. Snapshot vector slugs.
const vectorSlugs = new Set();
for (const co of fs.readdirSync(vectorsDir)) {
  const dir = path.join(vectorsDir, co);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".vector.json")) vectorSlugs.add(f.replace(/\.vector\.json$/, ""));
  }
}

// 2. Find DB products with no matching vector.
const orphans = db
  .prepare("select id, slug, isPublished, dataStatus from products where slug not in (select value from json_each(?))")
  .all(JSON.stringify([...vectorSlugs]));

console.log("Mode: " + (apply ? "APPLY (writes)" : "DRY-RUN (no writes)"));
console.log("DB: " + path.resolve(dbPath));
console.log("Vector slugs on disk: " + vectorSlugs.size);
console.log("DB products without vector (delete candidates): " + orphans.length);

if (orphans.length === 0) {
  console.log("Nothing to do.");
  db.close();
  process.exit(0);
}

const orphanIds = orphans.map((o) => o.id);
const placeholders = orphanIds.map(() => "?").join(",");

// 3. Audit inbound references per orphan.
const refByProduct = new Map();
function bump(productId, slot, n) {
  const m = refByProduct.get(productId) || { ci: 0, sv: 0, src: 0, compA: 0, compB: 0 };
  m[slot] += n;
  refByProduct.set(productId, m);
}
const detailCI = db.prepare(
  "select productId, count(*) as c from critical_illness_details where productId in (" + placeholders + ") group by productId"
).all(...orphanIds);
const detailSV = db.prepare(
  "select productId, count(*) as c from savings_details where productId in (" + placeholders + ") group by productId"
).all(...orphanIds);
const sources = db.prepare(
  "select productId, count(*) as c from product_sources where productId in (" + placeholders + ") group by productId"
).all(...orphanIds);
const compA = db.prepare(
  "select productAId as pid, count(*) as c from comparisons where productAId in (" + placeholders + ") group by productAId"
).all(...orphanIds);
const compB = db.prepare(
  "select productBId as pid, count(*) as c from comparisons where productBId in (" + placeholders + ") group by productBId"
).all(...orphanIds);

detailCI.forEach((r) => bump(r.productId, "ci", r.c));
detailSV.forEach((r) => bump(r.productId, "sv", r.c));
sources.forEach((r) => bump(r.productId, "src", r.c));
compA.forEach((r) => bump(r.pid, "compA", r.c));
compB.forEach((r) => bump(r.pid, "compB", r.c));

const orphanTouchedComparisons = db.prepare(
  "select count(*) as c from comparisons where productAId in (" + placeholders + ") or productBId in (" + placeholders + ")"
).get(...orphanIds, ...orphanIds).c;

console.log("");
console.log("Per-orphan reference audit:");
console.log("Slug                                    CI   SV   Src  CompA CompB");
console.log("-------------------------------------------------------------------");
for (const o of orphans) {
  const r = refByProduct.get(o.id) || { ci: 0, sv: 0, src: 0, compA: 0, compB: 0 };
  console.log(
    o.slug.padEnd(40) +
    String(r.ci).padEnd(4) +
    String(r.sv).padEnd(4) +
    String(r.src).padEnd(5) +
    String(r.compA).padEnd(6) +
    String(r.compB)
  );
}

console.log("");
console.log("Plan:");
console.log("  orphan products:           " + orphans.length);
console.log("  detail rows (CI):          " + detailCI.reduce((s, r) => s + r.c, 0));
console.log("  detail rows (SV):          " + detailSV.reduce((s, r) => s + r.c, 0));
console.log("  product_sources rows:      " + sources.reduce((s, r) => s + r.c, 0));
console.log("  comparison rows touched:   " + orphanTouchedComparisons);
console.log("");

if (!apply) {
  console.log("Run with --apply to actually execute.");
  db.close();
  process.exit(0);
}

// 4. Apply: one transaction, deletes in dependency order.
console.log("Applying in a single transaction...");
const tx = db.transaction(() => {
  const compDeleted = db.prepare(
    "delete from comparisons where productAId in (" + placeholders + ") or productBId in (" + placeholders + ")"
  ).run(...orphanIds, ...orphanIds).changes;

  const ciDeleted = db.prepare(
    "delete from critical_illness_details where productId in (" + placeholders + ")"
  ).run(...orphanIds).changes;

  const svDeleted = db.prepare(
    "delete from savings_details where productId in (" + placeholders + ")"
  ).run(...orphanIds).changes;

  const srcDeleted = db.prepare(
    "delete from product_sources where productId in (" + placeholders + ")"
  ).run(...orphanIds).changes;

  const prodDeleted = db.prepare(
    "delete from products where id in (" + placeholders + ")"
  ).run(...orphanIds).changes;

  return { compDeleted, ciDeleted, svDeleted, srcDeleted, prodDeleted };
});

const r = tx();
console.log("  comparisons rows deleted:  " + r.compDeleted);
console.log("  critical_illness_details:  " + r.ciDeleted);
console.log("  savings_details:           " + r.svDeleted);
console.log("  product_sources:           " + r.srcDeleted);
console.log("  products rows deleted:     " + r.prodDeleted);
console.log("");
console.log("Done. Orphan slugs removed:");
for (const o of orphans) console.log("  - " + o.slug);

db.close();