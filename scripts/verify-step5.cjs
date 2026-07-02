const http = require("node:http");

function get(u) {
  return new Promise((resolve) => {
    http
      .get(u, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ s: res.statusCode, h: d }));
      })
      .on("error", (e) => resolve({ s: "ERR", e: e.message }));
  });
}

const PAGES = [
  // [path, expected breadcrumb item count >= 2 ]
  { url: "/company/prudential-hk", minItems: 2, label: "Company (en)" },
  { url: "/zh-CN/company/prudential-hk", minItems: 2, label: "Company (zh-CN)" },
  { url: "/zh-TW/company/prudential-hk", minItems: 2, label: "Company (zh-TW)" },
  { url: "/product/pru-entrust-multi-currency", minItems: 3, label: "Product (en)" },
  { url: "/zh-CN/product/pru-entrust-multi-currency", minItems: 3, label: "Product (zh-CN)" },
  { url: "/zh-TW/product/pru-entrust-multi-currency", minItems: 3, label: "Product (zh-TW)" },
  // Indexable compare pair (per Step 4)
  { url: "/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side", minItems: 2, label: "Compare (en)" },
  { url: "/zh-CN/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side", minItems: 2, label: "Compare (zh-CN)" },
  { url: "/zh-TW/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side", minItems: 2, label: "Compare (zh-TW)" },
];

(async () => {
  let failures = 0;
  for (const p of PAGES) {
    const r = await get(`http://localhost:3000${p.url}`);
    if (r.s !== 200) {
      console.log(`✗ ${p.label}: status ${r.s}`);
      failures++;
      continue;
    }
    // Pull out the JSON-LD block(s)
    const ldMatches = [...r.h.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
    const breadcrumbLd = ldMatches
      .map((m) => {
        try { return JSON.parse(m[1]); } catch { return null; }
      })
      .filter((j) => j && j["@type"] === "BreadcrumbList");
    const visibleNav = (r.h.match(/aria-label="Breadcrumb"/g) || []).length;
    if (breadcrumbLd.length === 0) {
      console.log(`✗ ${p.label}: BreadcrumbList JSON-LD MISSING`);
      failures++;
      continue;
    }
    const items = breadcrumbLd[0].itemListElement || [];
    const itemCount = items.length;
    const absUrls = items.every((it) => it.item && it.item.startsWith("https://policy-vector.com"));
    if (itemCount < p.minItems) {
      console.log(`✗ ${p.label}: only ${itemCount} items (expected >= ${p.minItems})`);
      failures++;
      continue;
    }
    if (!absUrls) {
      console.log(`✗ ${p.label}: items don't have absolute URLs`);
      failures++;
      continue;
    }
    if (visibleNav !== 1) {
      console.log(`✗ ${p.label}: visible <nav aria-label="Breadcrumb"> count=${visibleNav} (expected 1)`);
      failures++;
      continue;
    }
    // Print the items compactly
    const trail = items.map((it) => `${it.position}.${it.name}→${it.item.replace("https://policy-vector.com", "")}`).join(" | ");
    console.log(`✓ ${p.label}: ${itemCount} items | ${trail}`);
  }
  console.log("\n" + (failures === 0 ? "ALL OK" : `${failures} FAILURE(S)`));
  process.exit(failures === 0 ? 0 : 1);
})();
