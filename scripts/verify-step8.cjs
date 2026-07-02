const http = require("node:http");

function getRaw(u) {
  return new Promise((resolve) => {
    http
      .get(u, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ s: res.statusCode, h: d, loc: res.headers.location }));
      })
      .on("error", () => resolve({ s: "ERR", h: "" }));
  });
}
async function get(u, depth = 0) {
  if (depth > 3) return { s: "LOOP", h: "" };
  const r = await getRaw(u);
  if (r.s >= 300 && r.s < 400 && r.loc) return get(new URL(r.loc, u).toString(), depth + 1);
  return r;
}

const PAGES = [
  {
    label: "Compare en",
    url: "/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side",
    checks: {
      viewCta: /Explore each product/i,
      viewCtaLinks: ["/product/pru-guardian-ci-series", "/product/aia-essence-on-your-side", "/company/prudential-hk", "/company/aia-hk"],
      relatedCompsHeading: /Other comparisons in this category/i,
      relatedCompsCount: 4,
      relatedCompsDistinct: true,
    },
  },
  {
    label: "Compare zh-CN",
    url: "/zh-CN/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side",
    checks: {
      viewCta: /深入了解两款产品/,
      viewCtaLinks: ["/zh-CN/product/pru-guardian-ci-series", "/zh-CN/product/aia-essence-on-your-side"],
      relatedCompsHeading: /同类对比/,
      relatedCompsCount: 4,
      relatedCompsDistinct: true,
    },
  },
  {
    label: "Compare zh-TW",
    url: "/zh-TW/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side",
    checks: {
      viewCta: /深入了解兩款產品/,
      relatedCompsHeading: /同類對比/,
      relatedCompsCount: 4,
      relatedCompsDistinct: true,
    },
  },
  {
    label: "Product en (savings)",
    url: "/product/pru-entrust-multi-currency",
    checks: {
      relatedByCategoryHeading: /Other .*Savings.* products/i,
      relatedByCategoryCount: 4,
      // Must NOT include current product slug
      notInRelated: ["/product/pru-entrust-multi-currency"],
    },
  },
  {
    label: "Product zh-CN (savings)",
    url: "/zh-CN/product/pru-entrust-multi-currency",
    checks: {
      relatedByCategoryHeading: /其他.*储蓄险.*产品/,
      relatedByCategoryCount: 4,
    },
  },
  {
    label: "Product en (CI)",
    url: "/product/pru-guardian-ci-series",
    checks: {
      relatedByCategoryHeading: /Other .*Critical Illness.* products/i,
      relatedByCategoryCount: 4,
    },
  },
  {
    label: "Company en",
    url: "/company/prudential-hk",
    checks: {
      categoryCtaLinks: ["/products/critical-illness", "/products/savings"],
      categoryCtaText: /View all/,
    },
  },
  {
    label: "Company zh-TW",
    url: "/zh-TW/company/prudential-hk",
    checks: {
      categoryCtaLinks: ["/zh-TW/products/critical-illness", "/zh-TW/products/savings"],
      categoryCtaText: /查看全部/,
    },
  },
];

function collectHrefs(html, basePath) {
  // Find all /<basePath>/<slug> links on the page
  const prefix = basePath.replace(/\/$/, "");
  const re = new RegExp(`href="(${prefix.replace(/\//g, "\\/")}\\/[^"]+)"`, "g");
  const out = new Set();
  let m;
  while ((m = re.exec(html))) out.add(m[1]);
  return out;
}

(async () => {
  let failures = 0;
  for (const p of PAGES) {
    const r = await get(`http://localhost:3000${p.url}`);
    if (r.s !== 200 || !r.h) {
      console.log(`✗ ${p.label}: status=${r.s}`);
      failures++;
      continue;
    }
    const issues = [];

    if (p.checks.viewCta && !p.checks.viewCta.test(r.h)) {
      issues.push(`viewCta heading not found (regex: ${p.checks.viewCta})`);
    }
    if (p.checks.viewCtaLinks) {
      for (const link of p.checks.viewCtaLinks) {
        if (!r.h.includes(`href="${link}"`)) issues.push(`missing link ${link}`);
      }
    }

    if (p.checks.relatedCompsHeading && !p.checks.relatedCompsHeading.test(r.h)) {
      issues.push(`relatedComps heading not found`);
    }
    if (p.checks.relatedCompsCount != null) {
      // Find hrefs to /compare/{slug} (with optional locale prefix) that are NOT the current pair.
      const compareHrefs = [...r.h.matchAll(/href="((?:\/(?:en|zh-CN|zh-TW))?\/compare\/[^"]+)"/g)].map((m) => m[1]);
      const currentPair = p.url.match(/\/compare\/([^/?#]+)/);
      const currentSlug = currentPair ? currentPair[1] : "";
      const others = compareHrefs.filter((h) => !h.endsWith("/" + currentSlug) && !h.endsWith(currentSlug));
      if (others.length < p.checks.relatedCompsCount) {
        issues.push(`expected ≥${p.checks.relatedCompsCount} related /compare/ links, got ${others.length}`);
      }
      if (p.checks.relatedCompsDistinct) {
        const unique = new Set(others);
        if (unique.size !== others.length) {
          issues.push(`related /compare/ links not unique (${others.length} but ${unique.size} unique)`);
        }
      }
    }

    if (p.checks.relatedByCategoryHeading && !p.checks.relatedByCategoryHeading.test(r.h)) {
      issues.push(`relatedByCategory heading not found`);
    }
    if (p.checks.relatedByCategoryCount != null) {
      // Find /product/ links (with optional locale prefix) excluding the current product.
      const productHrefs = [...r.h.matchAll(/href="((?:\/(?:en|zh-CN|zh-TW))?\/product\/[^"]+)"/g)].map((m) => m[1]);
      const currentProduct = p.url.match(/\/product\/([^/?#]+)/);
      const currentSlug = currentProduct ? currentProduct[1] : "";
      const others = productHrefs.filter((h) => !h.endsWith("/" + currentSlug) && !h.endsWith(currentSlug));
      if (others.length < p.checks.relatedByCategoryCount) {
        issues.push(`expected ≥${p.checks.relatedByCategoryCount} related /product/ links, got ${others.length}`);
      }
    }
    if (p.checks.notInRelated) {
      for (const excluded of p.checks.notInRelated) {
        if (r.h.includes(`href="${excluded}"`)) {
          issues.push(`excluded link ${excluded} present in page`);
        }
      }
    }

    if (p.checks.categoryCtaLinks) {
      for (const link of p.checks.categoryCtaLinks) {
        if (!r.h.includes(`href="${link}"`)) issues.push(`category CTA missing ${link}`);
      }
    }
    if (p.checks.categoryCtaText && !p.checks.categoryCtaText.test(r.h)) {
      issues.push(`category CTA text not found (regex: ${p.checks.categoryCtaText})`);
    }

    if (issues.length === 0) {
      console.log(`✓ ${p.label}`);
    } else {
      console.log(`✗ ${p.label}`);
      for (const i of issues) console.log(`    - ${i}`);
      failures++;
    }
  }
  console.log("\n" + (failures === 0 ? "ALL OK" : `${failures} PAGE FAILURE(S)`));
  process.exit(failures === 0 ? 0 : 1);
})();
