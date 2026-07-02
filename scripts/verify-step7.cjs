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
  // [label, url, expectLdTypes, expectGeoHeadings:[] ]
  { label: "Home en", url: "/", expectLdTypes: ["WebSite", "Organization"], expectGeoHeadings: ["What is Policy Vector?", "Sources", "Methodology"] },
  { label: "Home zh-CN", url: "/zh-CN/", expectLdTypes: ["WebSite", "Organization"], expectGeoHeadings: ["Policy Vector 是什么？", "参考资料", "数据来源与方法"] },
  { label: "Company en", url: "/company/prudential-hk", expectLdTypes: ["Organization"], expectGeoHeadings: ["What products does Prudential Hong Kong offer?", "Sources"] },
  { label: "Company zh-TW", url: "/zh-TW/company/prudential-hk", expectLdTypes: ["Organization"], expectGeoHeadings: ["保誠香港", "參考資料"] },
  { label: "Product en", url: "/product/pru-entrust-multi-currency", expectLdTypes: ["FinancialProduct", "FAQPage", "BreadcrumbList"], expectGeoHeadings: ["What is Prudential Entrust", "FAQ", "Sources", "Methodology"], expectFaqMin: 3 },
  { label: "Product zh-CN", url: "/zh-CN/product/pru-entrust-multi-currency", expectLdTypes: ["FinancialProduct", "FAQPage", "BreadcrumbList"], expectGeoHeadings: ["保诚信守明天", "FAQ", "参考资料", "数据来源"], expectFaqMin: 3 },
  { label: "Compare en", url: "/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side", expectLdTypes: ["FinancialProduct", "WebPage", "FAQPage", "BreadcrumbList"], expectGeoHeadings: ["What is the difference", "FAQ", "Sources"], expectFaqMin: 3 },
  { label: "Compare zh-TW", url: "/zh-TW/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side", expectLdTypes: ["FinancialProduct", "WebPage", "FAQPage", "BreadcrumbList"], expectGeoHeadings: ["保誠", "FAQ", "參考資料"], expectFaqMin: 3 },
  { label: "Glossary en", url: "/glossary", expectLdTypes: ["DefinedTermSet", "DefinedTerm"], expectGeoHeadings: [] },
  { label: "Glossary zh-CN", url: "/zh-CN/glossary", expectLdTypes: ["DefinedTermSet", "DefinedTerm"], expectGeoHeadings: [] },
];

(async () => {
  let failures = 0;
  for (const p of PAGES) {
    const r = await get(`http://localhost:3000${p.url}`);
    if (r.s !== 200 || !r.h) {
      console.log(`✗ ${p.label}: status=${r.s}`);
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
    let faqCount = 0;
    let definedTermCount = 0;
    for (const f of flat) {
      const t = f["@type"];
      if (Array.isArray(t)) t.forEach((x) => typesFound.add(x));
      else if (t) typesFound.add(t);
      if (t === "FAQPage" && Array.isArray(f.mainEntity)) faqCount = f.mainEntity.length;
      if (t === "DefinedTerm") definedTermCount++;
    }
    const missingTypes = p.expectLdTypes.filter((x) => !typesFound.has(x));
    // sr-only detection
    const srOnlyHtml = r.h.match(/<div[^>]+class="[^"]*sr-only[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<section|<nav|<div [^>]*class="max-w|$)/i);
    const srOnlyContent = srOnlyHtml ? srOnlyHtml[1] : "";
    const headingsFound = p.expectGeoHeadings.filter((h) =>
      srOnlyContent.includes(h) || (srOnlyContent === "" && r.h.includes(h))
    );
    const allHeadingsPresent = p.expectGeoHeadings.every((h) =>
      srOnlyContent.includes(h) || r.h.includes(h)
    );
    const ok = missingTypes.length === 0
      && allHeadingsPresent
      && (!p.expectFaqMin || faqCount >= p.expectFaqMin)
      && (p.label.startsWith("Glossary") ? definedTermCount > 0 : true);

    if (!ok) {
      console.log(`✗ ${p.label}`);
      console.log(`    types seen: ${[...typesFound].join(", ")}`);
      if (missingTypes.length) console.log(`    missing types: ${missingTypes.join(", ")}`);
      if (!allHeadingsPresent) {
        const missing = p.expectGeoHeadings.filter((h) => !srOnlyContent.includes(h) && !r.h.includes(h));
        console.log(`    missing headings: ${missing.join(" | ")}`);
      }
      if (p.expectFaqMin && faqCount < p.expectFaqMin) {
        console.log(`    FAQPage mainEntity count=${faqCount} (need >= ${p.expectFaqMin})`);
      }
      if (p.label.startsWith("Glossary") && definedTermCount === 0) {
        console.log(`    DefinedTerm count=0`);
      }
      failures++;
    } else {
      const dtExtra = p.label.startsWith("Glossary") ? `, ${definedTermCount} terms` : "";
      const faqExtra = p.expectFaqMin ? `, ${faqCount} FAQs` : "";
      console.log(`✓ ${p.label}  [${[...typesFound].join(", ")}${faqExtra}${dtExtra}]`);
    }
  }
  console.log("\n" + (failures === 0 ? "ALL OK" : `${failures} FAILURE(S)`));
  process.exit(failures === 0 ? 0 : 1);
})();
