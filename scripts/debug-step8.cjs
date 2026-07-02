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
  const html = await getRaw("http://localhost:3000/zh-CN/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side");
  // Look for the ViewProductCTA section
  const markers = ["Explore each product", "深入了解兩款產品", "深入了解两款产品", "View full profile", "查看完整档案", "查看完整檔案"];
  for (const m of markers) {
    const i = html.indexOf(m);
    console.log(`'${m}' at index: ${i}`);
    if (i >= 0) {
      const start = Math.max(0, i - 100);
      console.log(html.substring(start, i + 500));
      console.log("---");
    }
  }
  // Now list /product/ and /company/ hrefs
  const allHrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const productHrefs = allHrefs.filter((h) => h.includes("/product/"));
  const companyHrefs = allHrefs.filter((h) => h.includes("/company/"));
  console.log("\n/product/ hrefs:");
  productHrefs.forEach((h) => console.log("  ", h));
  console.log("\n/company/ hrefs:");
  companyHrefs.forEach((h) => console.log("  ", h));
})();
