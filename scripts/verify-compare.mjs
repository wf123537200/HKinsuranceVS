import http from "node:http";

const urls = [
  ["CI-zhCN", "http://localhost:3000/zh-CN/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side"],
  ["CI-zhTW", "http://localhost:3000/zh-TW/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side"],
  ["SV-zhCN", "http://localhost:3000/zh-CN/compare/prudential-enlit-savings-vs-aia-globalflexi-savings"],
  ["SV-zhTW", "http://localhost:3000/zh-TW/compare/prudential-enlit-savings-vs-aia-globalflexi-savings"],
];

function get(u) {
  return new Promise((resolve) => {
    http
      .get(u, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ url: u, status: res.statusCode, html: d }));
      })
      .on("error", () => resolve({ url: u, status: "ERR", html: "" }));
  });
}

(async () => {
  for (const [label, u] of urls) {
    const r = await get(u);
    if (r.status !== 200) {
      console.log(`${label}: ${r.status}`);
      continue;
    }
    const html = r.html;
    const sectionHeaders = (html.match(/<h2[^>]*>([^<]+)<\/h2>/g) || []).filter(
      (h) => !h.includes("产品特色对比")
    );
    const sectionNames = sectionHeaders.map((h) => h.replace(/<[^>]+>/g, "").trim());
    const tbodyRows = (html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/g) || []).reduce(
      (acc, tb) => acc + (tb.match(/<tr\b/g) || []).length,
      0
    );
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const hasHideBtn = html.includes("隐藏相同项");
    const hasExpandBtn = html.includes("展开");
    console.log(`${label} ${u}`);
    console.log(`  title: ${titleMatch ? titleMatch[1] : "?"}`);
    console.log(`  sections (${sectionNames.length}): ${sectionNames.join(" / ")}`);
    console.log(`  total <tr> rows: ${tbodyRows}`);
    console.log(`  hide-same btn: ${hasHideBtn}, expand btn: ${hasExpandBtn}`);
    console.log();
  }
})();
