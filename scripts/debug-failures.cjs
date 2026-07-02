const http = require("node:http");

function get(u) {
  return new Promise((resolve) => {
    http
      .get(u, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ s: res.statusCode, h: d, ct: res.headers["content-type"] }));
      })
      .on("error", () => resolve({ s: "ERR" }));
  });
}

(async () => {
  for (const u of [
    "http://localhost:3000/zh-CN/",
    "http://localhost:3000/zh-CN/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side",
  ]) {
    const r = await get(u);
    console.log(u, "->", r.s, r.ct || "");
    if (r.s !== 200) console.log("  body head:", r.h.substring(0, 200));
  }
})();
