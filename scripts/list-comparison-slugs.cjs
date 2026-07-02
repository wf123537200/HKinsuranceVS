const Database = require("better-sqlite3");
const db = new Database("dev.db");
const rows = db
  .prepare(
    `SELECT c.slug as slug, pa.slug as a_slug, pa.category as a_cat, pb.slug as b_slug, pb.category as b_cat
     FROM comparisons c
     JOIN products pa ON c.productAId = pa.id
     JOIN products pb ON c.productBId = pb.id
     ORDER BY c.viewCount DESC
     LIMIT 8`
  )
  .all();
console.log(JSON.stringify(rows, null, 2));
db.close();
