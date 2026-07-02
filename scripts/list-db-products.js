const Database = require('better-sqlite3');
const db = new Database('dev.db', { readonly: true });
const cols = db.prepare('PRAGMA table_info(products)').all();
console.log('COLUMNS:');
cols.forEach((c) => console.log('  ', c.name, c.type));
console.log('---');
const rows = db.prepare(
  "SELECT * FROM products WHERE localPdfPath IS NOT NULL OR dataStatus IN ('manual_verified','candidate') ORDER BY slug"
).all();
rows.forEach((r) => {
  console.log(
    (r.slug || '').padEnd(48) +
      ' | ' +
      (r.dataStatus || '-').padEnd(16) +
      ' | ' +
      (r.localPdfPath || '(null)').padEnd(60) +
      ' | ' +
      (r.displayName || '') +
      ' | ' +
      (r.englishName || r.nameEn || '') +
      ' | cat=' +
      (r.category || '-')
  );
});
console.log('TOTAL: ' + rows.length);
