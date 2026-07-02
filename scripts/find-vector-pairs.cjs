const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const db = new Database("dev.db");

function hasVector(companySlug, productSlug) {
  const dir = `data/vectors/${companySlug}`;
  if (!fs.existsSync(dir)) return false;
  return fs.existsSync(path.join(dir, `${productSlug}.vector.json`));
}

const rows = db
  .prepare(
    `SELECT c.slug as slug, pa.slug as a_slug, pb.slug as b_slug,
       (SELECT slug FROM companies WHERE id = pa.companyId) as a_co,
       (SELECT slug FROM companies WHERE id = pb.companyId) as b_co,
       c.viewCount as vc
     FROM comparisons c
     JOIN products pa ON c.productAId = pa.id
     JOIN products pb ON c.productBId = pb.id
     WHERE pa.category = 'SAVINGS' AND pb.category = 'SAVINGS'
     ORDER BY c.viewCount DESC`
  )
  .all();

const svBoth = rows.filter(
  (r) => hasVector(r.a_co, r.a_slug) && hasVector(r.b_co, r.b_slug)
);
console.log("SV with both vectors:", svBoth.length);
svBoth.slice(0, 5).forEach((r) => console.log(" ", r.slug, "vc=", r.vc));
db.close();
