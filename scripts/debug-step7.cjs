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
  const html = await getRaw("http://localhost:3000/product/pru-entrust-multi-currency");
  // find the sr-only div
  const m = html.match(/<div[^>]+sr-only[^>]*>([\s\S]*?)<\/div>/);
  if (!m) { console.log("no sr-only found"); return; }
  console.log("sr-only length:", m[1].length);
  console.log("first 1500 chars of sr-only:");
  console.log(m[1].substring(0, 1500));
})();
