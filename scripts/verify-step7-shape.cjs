const http = require("node:http");
function getRaw(u) {
  return new Promise((resolve) => {
    http.get(u, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve(d));
    });
  });
}
(async () => {
  const html = await getRaw("http://localhost:3000/zh-CN/product/pru-entrust-multi-currency");
  const start = html.indexOf('<div class="sr-only"');
  let depth = 0; let i = start;
  while (i < html.length) {
    const openM = html.substring(i).match(/^<div[\s>]/);
    const closeM = html.substring(i).match(/^<\/div>/);
    if (openM) { depth++; i += openM[0].length; }
    else if (closeM) { depth--; i += closeM[0].length; if (depth === 0) break; }
    else { i++; }
  }
  console.log(html.substring(start, i));
  console.log("\n--- FAQPage JSON-LD ---");
  const ldMatches = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  for (const m of ldMatches) {
    try {
      const o = JSON.parse(m[1]);
      if (o["@type"] === "FAQPage") console.log(JSON.stringify(o, null, 2));
    } catch {}
  }
})();
