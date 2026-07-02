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
  if (r.s >= 300 && r.s < 400 && r.loc) {
    const next = new URL(r.loc, u).toString();
    return get(next, depth + 1);
  }
  return r;
}

const CHECKS = [
  { label: "Home (en)", url: "/", expectTypes: ["WebSite", "Organization"] },
  { label: "Home (zh-CN)", url: "/zh-CN/", expectTypes: ["WebSite", "Organization"] },
  { label: "Companies (en)", url: "/companies", expectTypes: ["ItemList"], expectNonEmptyItemList: true },
  { label: "Companies (zh-TW)", url: "/zh-TW/companies", expectTypes: ["ItemList"], expectNonEmptyItemList: true },
  { label: "Company (en)", url: "/company/prudential-hk", expectTypes: ["Organization"], expectNameMatch: "Prudential Hong Kong" },
  { label: "Company (zh-CN)", url: "/zh-CN/company/prudential-hk", expectTypes: ["Organization"], expectNameMatch: "保诚香港" },
  { label: "Product (en)", url: "/product/pru-entrust-multi-currency", expectTypes: ["FinancialProduct", "BreadcrumbList"], expectNameMatch: "Prudential Entrust" },
  { label: "Product (zh-TW)", url: "/zh-TW/product/pru-entrust-multi-currency", expectTypes: ["FinancialProduct", "BreadcrumbList"], expectNameMatch: "保誠" },
  { label: "Compare (en)", url: "/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side", expectTypes: ["FinancialProduct", "WebPage", "BreadcrumbList"], minFinancialProducts: 2 },
  { label: "Compare (zh-CN)", url: "/zh-CN/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side", expectTypes: ["FinancialProduct", "WebPage", "BreadcrumbList"], minFinancialProducts: 2 },
];

(async () => {
  let failures = 0;
  for (const c of CHECKS) {
    const r = await get(`http://localhost:3000${c.url}`);
    if (r.s !== 200 || !r.h) {
      console.log(`✗ ${c.label}: status=${r.s}`);
      failures++;
      continue;
    }
    const blocks = [...r.h.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => { try { return JSON.parse(m[1]); } catch { return null; } })
      .filter(Boolean);

    const flat = [];
    for (const b of blocks) {
      if (Array.isArray(b["@graph"])) flat.push(...b["@graph"]);
      else flat.push(b);
    }
    const typesFound = new Set();
    let fpCount = 0;
    let itemListCount = 0;
    for (const f of flat) {
      const t = f["@type"];
      if (Array.isArray(t)) t.forEach((x) => typesFound.add(x));
      else if (t) typesFound.add(t);
      if (t === "FinancialProduct") fpCount++;
      if (t === "ItemList") itemListCount++;
    }
    const missing = c.expectTypes.filter((t) => !typesFound.has(t));
    const nameOk = !c.expectNameMatch || flat.some((f) => JSON.stringify(f).includes(c.expectNameMatch));
    const fpOk = !c.minFinancialProducts || fpCount >= c.minFinancialProducts;
    const ilOk = !c.expectNonEmptyItemList || itemListCount > 0;
    const ok = missing.length === 0 && nameOk && fpOk && ilOk;
    if (!ok) {
      console.log(`✗ ${c.label}`);
      console.log(`    types seen: ${[...typesFound].join(", ")}`);
      if (missing.length) console.log(`    missing: ${missing.join(", ")}`);
      if (!nameOk) console.log(`    missing name fragment: "${c.expectNameMatch}"`);
      if (!fpOk) console.log(`    FinancialProduct count=${fpCount} (need ${c.minFinancialProducts})`);
      if (!ilOk) console.log(`    ItemList count=${itemListCount}`);
      failures++;
    } else {
      console.log(`✓ ${c.label}  [${[...typesFound].join(", ")}]`);
    }
  }
  console.log("\n" + (failures === 0 ? "ALL OK" : `${failures} FAILURE(S)`));
  process.exit(failures === 0 ? 0 : 1);
})();
