// scripts/sync-vectors-to-db.cjs
//
// Reconcile `data/vectors/<company>/<slug>.vector.json` into Prisma's
// `companies` and `products` tables. Vectors are the single source of
// truth — anything in DB without a matching vector is left alone (could
// be a related-product row referenced by comparisons), and any vector
// without a matching DB product is INSERTED.
//
//   - Dry-run (default): print the plan, do nothing.
//   - Apply:  node scripts/sync-vectors-to-db.cjs --apply
//
// Idempotent: re-running does not duplicate rows, only updates.

const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const vectorsDir = "data/vectors";
const dbPath = process.env.DATABASE_PATH || "dev.db";
const apply = process.argv.includes("--apply");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ---------- load DB state ----------
const companies = new Map(
  db.prepare("select id, slug, name, displayName, region, country from companies").all()
    .map((c) => [c.slug, c])
);
const products = new Map(
  db.prepare(
    "select id, companyId, slug, name, displayName, category, region, country, isPublished, dataStatus from products"
  ).all().map((p) => [p.slug, p])
);

console.log("Mode: " + (apply ? "APPLY (writes)" : "DRY-RUN (no writes)"));
console.log("DB: " + path.resolve(dbPath));
console.log("Vector dir: " + path.resolve(vectorsDir));
console.log("DB companies: " + companies.size + "  DB products: " + products.size);

// ---------- walk vectors ----------
let insertedProduct = 0;
let updatedProduct = 0;
let insertedCompany = 0;
const failed = [];

function getRegion(cat) {
  // Vector `base.region` is locale-aware Chinese; DB `region` column
  // stores canonical English ("Hong Kong" / "Mainland China"). We map
  // from the company slug ending instead, which is reliable.
  return null; // set per-company below
}

function deriveRegionFromSlug(slug) {
  if (slug.endsWith("-hk")) return "Hong Kong";
  // Taikang, New China Life, CPIC, Ping An are Mainland China insurers.
  // Manulife HK is the only manulife-hk variant we ship.
  return "Mainland China";
}

function deriveCountryFromRegion(region) {
  return region === "Hong Kong" ? "HK" : "CN";
}

function deriveCategoryEnum(vCat) {
  if (vCat === "critical_illness") return "CRITICAL_ILLNESS";
  if (vCat === "savings") return "SAVINGS";
  return null;
}

function displayNameForLocale(base, locale) {
  if (locale === "zh-CN" && base.product_name_zh_cn) return base.product_name_zh_cn;
  if (locale === "zh-TW" && base.product_name_zh_tw) return base.product_name_zh_tw;
  if (locale === "en" && base.product_name_en) return base.product_name_en;
  return base.product_name || base.slug;
}

const seenVectorSlugs = new Set();

const insertCompany = db.prepare(
  "insert into companies (id, slug, name, displayName, region, country, createdAt, updatedAt) values (?, ?, ?, ?, ?, ?, ?, ?)"
);
const insertProduct = db.prepare(
  "insert into products (id, companyId, slug, name, displayName, category, region, country, isPublished, dataStatus, sourceStatus, createdAt, updatedAt) values (?, ?, ?, ?, ?, ?, ?, ?, 1, 'verified', 'vector_sync', ?, ?)"
);
const updateProductFromVector = db.prepare(
  "update products set companyId = ?, name = ?, displayName = ?, category = ?, region = ?, country = ?, isPublished = 1, dataStatus = 'verified', sourceStatus = 'vector_sync', updatedAt = ? where id = ?"
);

function cuid() {
  // Tiny cuid-like id; we don't depend on @paralleldrive/cuid2 here.
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 14);
}

const tx = db.transaction(() => {
  for (const companySlug of fs.readdirSync(vectorsDir).sort()) {
    const dir = path.join(vectorsDir, companySlug);
    if (!fs.statSync(dir).isDirectory()) continue;
    let company = companies.get(companySlug);
    if (!company) {
      const region = deriveRegionFromSlug(companySlug);
      const country = deriveCountryFromRegion(region);
      const id = cuid();
      const name = companySlug;
      const displayName = companySlug;
      if (apply) {
        insertCompany.run(id, companySlug, name, displayName, region, country, new Date().toISOString(), new Date().toISOString());
      }
      insertedCompany++;
      console.log("[+] company INSERT " + companySlug + " (region=" + region + ")");
      company = { id, slug: companySlug, name, displayName, region, country };
      companies.set(companySlug, company);
    }

    const region = company.region;
    const country = company.country;

    for (const file of fs.readdirSync(dir).sort()) {
      if (!file.endsWith(".vector.json")) continue;
      const slug = file.replace(/\.vector\.json$/, "");
      const vec = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const base = vec?.base || {};
      const vCat = base.category;
      const catEnum = deriveCategoryEnum(vCat);
      if (!catEnum) {
        failed.push({ companySlug, slug, reason: "unknown category " + vCat });
        continue;
      }
      const name = base.product_name || slug;
      const displayName = name;

      seenVectorSlugs.add(slug);
      const existing = products.get(slug);
      if (existing) {
        if (apply) {
          updateProductFromVector.run(
            company.id,
            name,
            displayName,
            catEnum,
            region,
            country,
            new Date().toISOString(),
            existing.id
          );
        }
        updatedProduct++;
      } else {
        if (apply) {
          insertProduct.run(
            cuid(),
            company.id,
            slug,
            name,
            displayName,
            catEnum,
            region,
            country,
            new Date().toISOString(),
            new Date().toISOString()
          );
        }
        insertedProduct++;
        console.log("[+] product INSERT " + companySlug + "/" + slug);
      }
    }
  }
});

if (apply) {
  tx();
} else {
  // For dry-run, just walk through to print the plan but don't transact.
  for (const companySlug of fs.readdirSync(vectorsDir).sort()) {
    const dir = path.join(vectorsDir, companySlug);
    if (!fs.statSync(dir).isDirectory()) continue;
    let company = companies.get(companySlug);
    if (!company) {
      const region = deriveRegionFromSlug(companySlug);
      const country = deriveCountryFromRegion(region);
      const name = companySlug;
      const displayName = companySlug;
      insertedCompany++;
      console.log("[plan] company INSERT " + companySlug + " (region=" + region + ")");
      company = { id: "DRY", slug: companySlug, name, displayName, region, country };
      companies.set(companySlug, company);
    }
    for (const file of fs.readdirSync(dir).sort()) {
      if (!file.endsWith(".vector.json")) continue;
      const slug = file.replace(/\.vector\.json$/, "");
      seenVectorSlugs.add(slug);
      const vec = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const vCat = vec?.base?.category;
      const catEnum = deriveCategoryEnum(vCat);
      if (!catEnum) { failed.push({ companySlug, slug, reason: "unknown category " + vCat }); continue; }
      const existing = products.get(slug);
      if (existing) {
        updatedProduct++;
      } else {
        insertedProduct++;
        console.log("[plan] product INSERT " + companySlug + "/" + slug);
      }
    }
  }
}

// Orphan vectors (in DB but no vector file) — informational only.
const orphanDbProducts = [];
for (const [slug, p] of products.entries()) {
  if (!seenVectorSlugs.has(slug)) orphanDbProducts.push(slug);
}

console.log("\nSummary:");
console.log("  Companies to insert: " + insertedCompany);
console.log("  Products to insert:  " + insertedProduct);
console.log("  Products to update:  " + updatedProduct);
console.log("  DB products without vector (left alone): " + orphanDbProducts.length);
for (const s of orphanDbProducts) console.log("    - " + s);
if (failed.length) {
  console.log("\nFailed vectors (skipped):");
  for (const f of failed) console.log("  - " + f.companySlug + "/" + f.slug + ": " + f.reason);
}

db.close();