// scripts/dump-glossary.cjs — extract slugs from JSON-LD DefinedTermSet.
const http = require("node:http");
function get(u) {
  return new Promise((resolve) => {
    const req = http.get(u, { timeout: 30000 }, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve({ s: res.statusCode, h: d, loc: res.headers.location }));
    });
    req.on("timeout", () => { req.destroy(); resolve({ s: "TIMEOUT" }); });
    req.on("error", (e) => resolve({ s: "ERR", e: e.message }));
  });
}
async function go(u, depth = 0) {
  if (depth > 5) return { s: "LOOP", h: "" };
  const r = await get(u);
  if (r.s >= 300 && r.s < 400 && r.loc) return go(new URL(r.loc, u).toString(), depth + 1);
  return r;
}
(async () => {
  // Use sitemap to find glossary URLs
  const sm = await get("http://127.0.0.1:8765/sitemap.xml");
  if (sm.s === 200 && sm.h) {
    const hrefs = [...sm.h.matchAll(/<loc>(https:\/\/policy-vector\.com\/[^<]*glossary\/[^<]+)<\/loc>/g)].map((m) => m[1]);
    const u = [...new Set(hrefs.map((h) => h.split("/").pop()))];
    console.log("glossary slugs from sitemap:", u.length);
    u.forEach((s) => console.log("  -", s));
  } else {
    console.log("sitemap status:", sm.s);
  }
  process.exit(0);
})();
