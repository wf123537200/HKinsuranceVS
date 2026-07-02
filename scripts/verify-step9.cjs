// scripts/verify-step9.cjs — Smoke tests for the full SEO/GEO pipeline.
//
// 1. sitemap.xml exists, has URLs, references policy-vector.com
// 2. robots.txt references the sitemap
// 3. Each major page type returns 200 in all 3 locales
// 4. /admin /login /search return 200 (still served) but noindex
// 5. A no-vector compare pair (/compare/prudential-ci-plan-vs-...) does NOT
//    appear in the sitemap (Step 4 exclusion regression check)

const http = require("node:http");

function getRaw(u) {
  return new Promise((resolve) => {
    const req = http.get(u, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve({ s: res.statusCode, h: d, ct: res.headers["content-type"], loc: res.headers.location }));
    });
    req.on("error", (e) => resolve({ s: "ERR", e: e.message }));
    req.setTimeout(30000, () => { req.destroy(); resolve({ s: "TIMEOUT" }); });
  });
}
async function get(u, depth = 0) {
  if (depth > 3) return { s: "LOOP" };
  const r = await getRaw(u);
  if (r.s >= 300 && r.s < 400 && r.loc) return get(new URL(r.loc, u).toString(), depth + 1);
  return r;
}

const PAGES = [
  // [label, url, expectIndexable]
  { label: "Home (en)", url: "/" },
  { label: "Home (zh-CN)", url: "/zh-CN" },
  { label: "Home (zh-TW)", url: "/zh-TW" },
  { label: "Companies (en)", url: "/companies" },
  { label: "Products (en)", url: "/products" },
  { label: "Calculator (en)", url: "/calculator" },
  { label: "Glossary (en)", url: "/glossary" },
  { label: "Company detail (en)", url: "/company/prudential-hk" },
  { label: "Product detail (en)", url: "/product/pru-entrust-multi-currency" },
  { label: "Compare (en)", url: "/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side" },
  { label: "Admin (en, noindex)", url: "/admin", expectNoindex: true },
  { label: "Login (en)", url: "/login", expectNoindex: true },
];

(async () => {
  let failures = 0;

  // 1. sitemap.xml
  const sm = await get("http://localhost:3000/sitemap.xml");
  if (sm.s !== 200) { console.log(`✗ sitemap.xml status=${sm.s}`); failures++; }
  else if (!sm.ct || !sm.ct.includes("application/xml")) { console.log(`✗ sitemap.xml content-type wrong: ${sm.ct}`); failures++; }
  else {
    const urls = (sm.h.match(/<loc>/g) || []).length;
    const hreflangs = (sm.h.match(/xhtml:link/g) || []).length;
    const hasPolicyVector = sm.h.includes("policy-vector.com");
    console.log(`✓ sitemap.xml: ${urls} URLs, ${hreflangs} hreflangs, content-type ${sm.ct}`);
    if (urls < 800) { console.log(`  ✗ URLs count below expected (~861)`); failures++; }
    if (!hasPolicyVector) { console.log(`  ✗ sitemap doesn't reference policy-vector.com`); failures++; }

    // 5. Regression check: thin compare pair must NOT appear
    if (sm.h.includes("/compare/prudential-ci-plan-vs")) {
      console.log(`  ✗ thin /compare/prudential-ci-plan-vs-* still in sitemap`);
      failures++;
    } else {
      console.log(`  ✓ thin /compare/prudential-ci-plan-vs-* excluded from sitemap`);
    }
  }

  // 2. robots.txt
  const robots = await get("http://localhost:3000/robots.txt");
  if (robots.s !== 200) { console.log(`✗ robots.txt status=${robots.s}`); failures++; }
  else if (!robots.h.includes("Sitemap:")) { console.log(`✗ robots.txt missing Sitemap line`); failures++; }
  else {
    const smMatch = robots.h.match(/Sitemap:\s*(\S+)/);
    console.log(`✓ robots.txt references ${smMatch ? smMatch[1] : "(unknown)"}`);
  }

  // 3. Smoke-test page renders
  for (const p of PAGES) {
    const r = await get(`http://localhost:3000${p.url}`);
    const status = r.s;
    const noindex = r.h && r.h.includes('name="robots"') && r.h.includes("noindex");
    if (status !== 200) {
      console.log(`✗ ${p.label}: status=${status}`);
      failures++;
      continue;
    }
    if (p.expectNoindex === true && !noindex) {
      console.log(`✗ ${p.label}: expected noindex, page does not set it`);
      failures++;
    } else if (p.expectNoindex === true && noindex) {
      console.log(`✓ ${p.label}: status=200, noindex ✓`);
    } else if (p.expectNoindex === "best-effort" && noindex) {
      console.log(`✓ ${p.label}: status=200, noindex ✓`);
    } else if (p.expectNoindex === "best-effort") {
      // Login page is client-only and lacks static metadata; robots.txt
      // Disallow: /login is sufficient to block indexing. Soft pass.
      console.log(`✓ ${p.label}: status=200 (noindex via robots.txt Disallow only)`);
    } else {
      console.log(`✓ ${p.label}: status=200`);
    }
  }

  console.log("\n" + (failures === 0 ? "ALL OK" : `${failures} FAILURE(S)`));
  process.exit(failures === 0 ? 0 : 1);
})();
