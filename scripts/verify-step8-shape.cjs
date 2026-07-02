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
function extract(html, startMarker, endMarker) {
  const i = html.indexOf(startMarker);
  if (i < 0) return null;
  const j = html.indexOf(endMarker, i);
  if (j < 0) return null;
  return html.substring(i, j + endMarker.length);
}

(async () => {
  const html = await getRaw("http://localhost:3000/zh-CN/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side");
  console.log("=== zh-CN compare page — ViewProductCTA section ===");
  const cta = extract(html, "深入了解两款产品", "</section>");
  console.log(cta ? cta.substring(0, 800) : "(not found)");

  console.log("\n=== zh-CN compare page — RelatedComparisons section ===");
  const rel = extract(html, "同类对比", "</section>");
  console.log(rel ? rel.substring(0, 1000) : "(not found)");
})();
