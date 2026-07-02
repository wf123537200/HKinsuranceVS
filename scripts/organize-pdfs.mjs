import fs from 'fs';
import path from 'path';

const PDF_DIR = 'public/pdfs';
const OUT_DIR = 'public/pdfs-by-company';

// Map: company slug -> [{product slug, pdf filename, dataStatus}]
const companyProducts = {
  'prudential-hk': [
    { slug: 'prudential-evergreen-growth', pdf: 'evergreen-growth-saver-plus-ii-en.pdf', status: 'manual_verified' },
    { slug: 'prudential-enlit-savings', pdf: 'enlit-product-brochure-en.pdf', status: 'manual_verified' },
    { slug: 'prudential-prime-ace', pdf: 'pace-product-brochure-en.pdf', status: 'manual_verified' },
    { slug: 'prudential-prime-eternity', pdf: 'prime-eternity-en.pdf', status: 'manual_verified' },
    { slug: 'pru-entrust-multi-currency', pdf: 'pru-entrust-multi-currency.pdf', status: 'manual_verified' },
    { slug: 'pru-ci-extended-care-iii', pdf: 'pru-ci-extended-care-iii.pdf', status: 'manual_verified' },
  ],
  'aia-hk': [
    { slug: 'aia-globalflexi-savings', pdf: 'aia-globalflexi-savings.pdf', status: 'manual_verified' },
    { slug: 'aia-essence-on-your-side', pdf: 'aia-essence-on-your-side.pdf', status: 'candidate' },
    { slug: 'aia-on-your-side-2', pdf: 'aia-on-your-side-2.pdf', status: 'candidate' },
  ],
  'manulife-hk': [
    { slug: 'manulife-manucentury', pdf: 'genesis-centurion.pdf', status: 'manual_verified' },
    { slug: 'manulife-bright-care-pro', pdf: 'manulife-bright-care-pro.pdf', status: 'manual_verified' },
    { slug: 'manulife-incomeshield-ci', pdf: 'incomeshield-critical-illness-protector.pdf', status: 'manual_verified' },
    { slug: 'manulife-prestige-achiever', pdf: 'prestige-achiever.pdf', status: 'manual_verified' },
    { slug: 'manulife-genesis-centurion', pdf: null, status: 'candidate' },
  ],
  'axa-hk': [
    { slug: 'axa-loving-care-ci-enhanced', pdf: null, status: 'candidate' },
    { slug: 'axa-wealth-advance-savings-ii-ultimate', pdf: null, status: 'candidate' },
  ],
  'fwd-hk': [
    { slug: 'fwd-maxfocus-legacy-ii', pdf: 'fwd-maxfocus-legacy-ii.pdf', status: 'manual_verified' },
    { slug: 'fwd-wealthicon-supreme-iii', pdf: 'fwd-wealthicon-supreme-iii.pdf', status: 'manual_verified' },
    { slug: 'fwd-wealthicon-horizon', pdf: 'fwd-wealthicon-horizon.pdf', status: 'manual_verified' },
    { slug: 'fwd-noble-fortune', pdf: 'fwd-noble-fortune.pdf', status: 'manual_verified' },
    { slug: 'fwd-crisis-one-master', pdf: 'fwd-crisis-one-master.pdf', status: 'manual_verified' },
    { slug: 'fwd-crisis-u-supporter', pdf: 'fwd-crisis-u-supporter.pdf', status: 'manual_verified' },
    { slug: 'fwd-easycover-ci', pdf: 'fwd-easycover-ci.pdf', status: 'manual_verified' },
  ],
  'ping-an': [
    { slug: 'ping-an-shengshi-jinyue-premium', pdf: 'pingan-shengshi-jinyue-zunxiang.pdf', status: 'manual_verified' },
    { slug: 'pingan-ruyi-quanneng-ci', pdf: 'pingan-ruyi-quanneng-2025-ci.pdf', status: 'manual_verified' },
  ],
  'taikang-life': [
    { slug: 'taikang-zunxiang-shijia-zeng-e', pdf: 'taikang-zunxiang-shijia-zeng-e.pdf', status: 'manual_verified' },
    { slug: 'taikang-zunxiang-shijia-flagship', pdf: 'taikang-zunxiang-shijia-flagship.pdf', status: 'manual_verified' },
    { slug: 'taikang-lexiangjiankang-2026', pdf: 'taikang-lexiangjiankang-2026.pdf', status: 'manual_verified' },
    { slug: 'taikang-lexiangjiankang-kids', pdf: 'taikang-lexiangjiankang-kids.pdf', status: 'manual_verified' },
  ],
  'cpic-life': [
    { slug: 'cpic-xiangbanzhizun-2024s', pdf: 'cpic-xiangbanzhizun-2024s.pdf', status: 'manual_verified' },
    { slug: 'cpic-jinshengwuyou-kids', pdf: 'cpic-jinshengwuyou-kids.pdf', status: 'manual_verified' },
    { slug: 'cpic-wenyingjinsheng-ci', pdf: 'cpic-wenyingjinsheng-ci.pdf', status: 'manual_verified' },
  ],
  'new-china-life': [
    { slug: 'new-china-life-rongyao-xinxiang', pdf: null, status: 'candidate' },
    { slug: 'new-china-life-rongyao-shijia', pdf: null, status: 'candidate' },
    { slug: 'new-china-life-jiankang-wuyou', pdf: null, status: 'candidate' },
  ],
};

// Create output directory
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let copied = 0;
let skipped = 0;
let missing = 0;

for (const [companySlug, products] of Object.entries(companyProducts)) {
  const companyDir = path.join(OUT_DIR, companySlug);
  if (!fs.existsSync(companyDir)) fs.mkdirSync(companyDir, { recursive: true });

  // Write manifest.json for each company
  const manifest = {
    company: companySlug,
    products: products.map(p => ({
      slug: p.slug,
      status: p.status,
      pdf: p.pdf,
      hasPdf: p.pdf ? fs.existsSync(path.join(PDF_DIR, p.pdf)) : false,
    })),
  };
  fs.writeFileSync(path.join(companyDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  for (const p of products) {
    if (!p.pdf) {
      skipped++;
      continue;
    }
    const src = path.join(PDF_DIR, p.pdf);
    const dst = path.join(companyDir, p.pdf);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      copied++;
    } else {
      console.log(`MISSING: ${src}`);
      missing++;
    }
  }
}

console.log(`\nDone! Copied: ${copied}, Skipped (no PDF): ${skipped}, Missing: ${missing}`);
console.log(`Output: ${OUT_DIR}/`);

// Print summary table
console.log('\n--- Summary ---');
for (const [companySlug, products] of Object.entries(companyProducts)) {
  const withPdf = products.filter(p => p.pdf).length;
  const total = products.length;
  console.log(`${companySlug}: ${withPdf}/${total} products with PDF`);
}
