// Smoke test - read vector files directly, validate count
const fs = require('fs');
const path = require('path');

const vectorsDir = path.join(__dirname, '..', 'data', 'vectors');
const selectedDir = path.join(__dirname, '..', 'data', 'vectors-selected');

function loadDir(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const company of fs.readdirSync(dir)) {
    const sub = path.join(dir, company);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const file of fs.readdirSync(sub)) {
      if (!file.endsWith('.vector.json')) continue;
      try {
        const data = JSON.parse(fs.readFileSync(path.join(sub, file), 'utf8'));
        out.push(data);
      } catch (e) {
        console.warn('  parse fail:', company + '/' + file, e.message);
      }
    }
  }
  return out;
}

const all = loadDir(vectorsDir);
const sel = loadDir(selectedDir);

console.log('=== /data/vectors/ ===');
console.log('Total products:', all.length);
console.log('Hot products (is_hot_discussed=true):', all.filter(v => v.base.is_hot_discussed).length);
console.log('Hot products (market_attention=hot_discussed):', all.filter(v => v.base.market_attention === 'hot_discussed').length);
console.log('CI:', all.filter(v => v.base.category === 'critical_illness').length);
console.log('SV:', all.filter(v => v.base.category === 'savings').length);
console.log('Unique companies:', new Set(all.map(v => v.base.company_slug)).size);

console.log('\n=== /data/vectors-selected/ ===');
console.log('Total in selected:', sel.length, '(if 0, fall back to is_hot_discussed filter)');

console.log('\n=== by company ===');
const byCo = {};
all.forEach(v => {
  byCo[v.base.company_name] = (byCo[v.base.company_name] || 0) + 1;
});
Object.entries(byCo).sort((a, b) => b[1] - a[1]).forEach(([n, c]) => console.log('  ', n, '=', c));

console.log('\n=== sample base (aia-on-your-side-2) ===');
const sample = all.find(v => v.base.slug === 'aia-on-your-side-2');
if (sample) {
  console.log('slug:', sample.base.slug);
  console.log('product_name (raw):', JSON.stringify(sample.base.product_name));
  console.log('product_name_en:', sample.base.product_name_en);
  console.log('company:', sample.base.company_name);
  console.log('category:', sample.base.category);
  console.log('is_hot_discussed:', sample.base.is_hot_discussed);
  console.log('market_attention:', sample.base.market_attention);
  console.log('local_pdf_path:', sample.base.local_pdf_path);
  console.log('policy_term:', sample.base.policy_term);
  console.log('premium_term:', JSON.stringify(sample.base.premium_term));
  console.log('policy_currency:', JSON.stringify(sample.base.policy_currency));
  console.log('product_features count:', (sample.product_features || []).length);
  console.log('feature_tags:', JSON.stringify(sample.feature_tags));
  console.log('source_trace keys:', sample.source_trace ? Object.keys(sample.source_trace) : 'NONE');
}

console.log('\n=== schema check ===');
console.log('Missing base.slug:', all.filter(v => !v.base?.slug).length);
console.log('Missing product_features:', all.filter(v => !v.product_features || v.product_features.length === 0).length);
console.log('Missing compare_profile:', all.filter(v => !v.compare_profile).length);
console.log('Missing core:', all.filter(v => !v.core).length);
console.log('Missing local_pdf_path:', all.filter(v => !v.base.local_pdf_path).length);

console.log('\n=== registry ===');
const regPath = path.join(__dirname, '..', 'data', 'compare-field-registry-v2.4.json');
if (fs.existsSync(regPath)) {
  const r = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  console.log('Registry keys:', Object.keys(r));
  console.log('savings_fields:', (r.savings_fields || []).length);
  console.log('critical_illness_fields:', (r.critical_illness_fields || []).length);
  if (r.critical_illness_fields && r.critical_illness_fields[0]) {
    console.log('Sample CI field:', JSON.stringify(r.critical_illness_fields[0]));
  }
  if (r.savings_fields && r.savings_fields[0]) {
    console.log('Sample SV field:', JSON.stringify(r.savings_fields[0]));
  }
}
