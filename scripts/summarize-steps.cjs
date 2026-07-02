const fs = require("fs");
const path = require("path");

const steps = {
  "Step 2: SEO Metadata": [
    "lib/seo.ts",
    ".env.example",
  ],
  "Step 3: robots + noindex": [
    "app/robots.ts",
    "app/[locale]/company/[slug]/page.tsx",
    "app/[locale]/product/[slug]/page.tsx",
    "app/[locale]/compare/[slug]/page.tsx",
    "app/[locale]/compare/page.tsx",
    "app/[locale]/compare/critical-illness/page.tsx",
    "app/[locale]/compare/savings/page.tsx",
  ],
  "Step 4: sitemap.xml": [
    "app/sitemap.ts",
  ],
  "Step 5: Breadcrumb + BreadcrumbList": [
    "components/Breadcrumb.tsx",
    "app/[locale]/company/[slug]/page.tsx",
    "app/[locale]/product/[slug]/page.tsx",
    "app/[locale]/compare/[slug]/page.tsx",
    "messages/en.json",
    "messages/zh-CN.json",
    "messages/zh-TW.json",
  ],
  "Step 6: JSON-LD": [
    "lib/jsonld.ts",
    "components/JsonLd.tsx",
    "app/[locale]/page.tsx",
    "app/[locale]/companies/page.tsx",
    "app/[locale]/company/[slug]/page.tsx",
    "app/[locale]/product/[slug]/page.tsx",
    "app/[locale]/compare/[slug]/page.tsx",
  ],
  "Step 7: GEO/AEO modules": [
    "components/GeoBlocks.tsx",
    "lib/pdf-utils.ts",
    "app/[locale]/page.tsx",
    "app/[locale]/company/[slug]/page.tsx",
    "app/[locale]/product/[slug]/page.tsx",
    "app/[locale]/compare/[slug]/page.tsx",
    "app/[locale]/glossary/page.tsx",
    "messages/en.json",
    "messages/zh-CN.json",
    "messages/zh-TW.json",
  ],
  "Step 8: Internal links": [
    "components/RelatedComparisons.tsx",
    "components/RelatedProductsByCategory.tsx",
    "components/ViewProductCTA.tsx",
    "app/[locale]/compare/[slug]/page.tsx",
    "app/[locale]/product/[slug]/page.tsx",
    "app/[locale]/company/[slug]/page.tsx",
    "messages/en.json",
    "messages/zh-CN.json",
    "messages/zh-TW.json",
  ],
  "Step 9: Final gate": [
    "app/[locale]/login/layout.tsx",
  ],
};

console.log("=== Step-by-step file summary ===\n");
for (const [step, files] of Object.entries(steps)) {
  console.log(`${step} (${files.length} files)`);
  for (const f of files) {
    if (fs.existsSync(f)) {
      const size = fs.statSync(f).size;
      console.log(`  EXISTS  ${f}  (${size} bytes)`);
    } else {
      console.log(`  MISSING ${f}`);
    }
  }
  console.log("");
}
