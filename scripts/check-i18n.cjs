const fs = require('fs');
const files = [
  'app/[locale]/company/[slug]/page.tsx',
  'app/[locale]/product/[slug]/page.tsx',
  'app/[locale]/compare/[slug]/page.tsx',
  'app/[locale]/companies/page.tsx',
  'app/[locale]/products/page.tsx',
  'app/[locale]/products/critical-illness/page.tsx',
  'app/[locale]/products/savings/page.tsx',
  'app/[locale]/compare/page.tsx',
  'app/[locale]/rankings/page.tsx',
  'app/[locale]/glossary/page.tsx',
  'app/[locale]/search/page.tsx',
  'app/[locale]/login/page.tsx',
  'app/[locale]/sitemap/page.tsx',
  'app/[locale]/page.tsx',
  'components/Header.tsx',
  'components/Footer.tsx',
  'components/CompareTable.tsx',
  'components/CompareAIButton.tsx',
  'components/Disclaimer.tsx',
  'components/IRRCalculatorClient.tsx',
  'components/SearchBar.tsx',
];

for (const f of files) {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      
      // Check for hardcoded Chinese
      if (/[\u4e00-\u9fff]/.test(l) && !l.includes('getTranslations') && !l.includes('useTranslations') && !l.includes('import ')) {
        issues.push(`L${i+1} [CN]: ${l.trim().substring(0, 120)}`);
      }
      
      // Check for hardcoded English in JSX content (between > and <)
      const textMatch = l.match(/>([^<{]+?)</g);
      if (textMatch) {
        for (const m of textMatch) {
          const text = m.slice(1, -1).trim();
          if (text.length > 2 && /^[A-Z]/.test(text) && !text.includes('Insurance Atlas') && !text.includes('©')) {
            // Skip if it's inside a translation call
            if (!l.includes('{t(') && !l.includes('{ts(') && !l.includes('{tc(') && !l.includes('{tCommon(') && !l.includes('getTranslations') && !l.includes('useTranslations')) {
              issues.push(`L${i+1} [EN]: "${text}"`);
            }
          }
        }
      }
    }
    
    if (issues.length > 0) {
      console.log(`\n=== ${f} ===`);
      issues.forEach(i => console.log(`  ${i}`));
    }
  } catch(e) {}
}
