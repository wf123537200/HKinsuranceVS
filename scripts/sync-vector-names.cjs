// scripts/sync-vector-names.cjs
// Sync each vector's product_name_* fields from the canonical PRODUCT_NAMES
// table in lib/vector-i18n.ts. Out-of-scope fields (en, etc.) left untouched
// unless explicitly listed.
//
// Run from project root: `node scripts/sync-vector-names.cjs`
// This script reads the table directly out of lib/vector-i18n.ts so it
// stays in sync with the source of truth.

const fs = require("fs");

const SRC = "lib/vector-i18n.ts";
let txt;
try {
  txt = fs.readFileSync(SRC, "utf8");
} catch (e) {
  console.error("cannot read lib/vector-i18n.ts:", e.message);
  process.exit(1);
}

// Extract PRODUCT_NAMES object literal between the first `=` after
// `export const PRODUCT_NAMES` and the matching `};`. We use a simple
// brace-counting parser.
const marker = "export const PRODUCT_NAMES";
const start = txt.indexOf(marker);
if (start < 0) { console.error("PRODUCT_NAMES not found"); process.exit(1); }
const eq = txt.indexOf("=", start);
if (eq < 0) { console.error("PRODUCT_NAMES = not found"); process.exit(1); }
const open = txt.indexOf("{", eq);
if (open < 0) { console.error("PRODUCT_NAMES { not found"); process.exit(1); }
let depth = 1;
let close = open + 1;
while (close < txt.length && depth > 0) {
  const c = txt[close];
  if (c === "{") depth++;
  else if (c === "}") depth--;
  close++;
}
const block = txt.substring(open, close);

// Parse: "slug": { "zh-CN": "...", "zh-TW": "...", en: "..." }
const entryRe = /"([^"\\]+)"\s*:\s*\{([\s\S]*?)\}/g;
const PRODUCT_NAMES = {};
let m;
while ((m = entryRe.exec(block)) !== null) {
  const slug = m[1];
  const inner = m[2];
  const names = {};
  const kvRe = /"([^"\\]+)"\s*:\s*"([^"\\]*)"/g;
  let kv;
  while ((kv = kvRe.exec(inner)) !== null) {
    names[kv[1]] = kv[2];
  }
  PRODUCT_NAMES[slug] = names;
}

console.log(`Loaded ${Object.keys(PRODUCT_NAMES).length} entries from PRODUCT_NAMES`);

function* walkVectors(d) {
  for (const f of fs.readdirSync(d)) {
    const full = `${d}/${f}`;
    const s = fs.statSync(full);
    if (s.isDirectory()) yield* walkVectors(full);
    else if (f.endsWith(".vector.json")) yield full;
  }
}

const LOCALES = ["zh-CN", "zh-TW"];
let updated = 0;
let total = 0;
let missing = 0;
for (const file of walkVectors("data")) {
  total++;
  const o = JSON.parse(fs.readFileSync(file, "utf8"));
  const slug = o?.base?.slug || o?.slug;
  const wanted = PRODUCT_NAMES[slug];
  if (!wanted) { missing++; continue; }
  let changed = false;
  for (const loc of LOCALES) {
    if (wanted[loc] !== undefined) {
      const key = `product_name_${loc.toLowerCase().replace("-", "_")}`;
      const cur = o.base?.[key];
      if (cur !== wanted[loc]) {
        o.base = o.base || {};
        o.base[key] = wanted[loc];
        // also top-level product_name for backwards compat
        if (loc === "zh-CN" || loc === "zh-TW") {
          if (o.product_name !== wanted[loc] && !o.base.product_name) o.product_name = wanted[loc];
        }
        changed = true;
      }
    }
  }
  // Also: top-level product_name for backwards compat = zh-CN when zh-CN is set
  if (wanted["zh-CN"] && o.product_name !== wanted["zh-CN"] && (!o.base || o.base.product_name !== wanted["zh-CN"])) {
    o.product_name = wanted["zh-CN"];
    changed = true;
  }
  // Sync base.product_name (used as final fallback) to zh-CN
  if (o.base && wanted["zh-CN"] && o.base.product_name !== wanted["zh-CN"]) {
    o.base.product_name = wanted["zh-CN"];
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(o, null, 2) + "\n", "utf8");
    updated++;
    console.log(`✓ ${slug} (${file})`);
  }
}

console.log(`\nScanned: ${total}, Updated: ${updated}, No-table-entry: ${missing}`);
