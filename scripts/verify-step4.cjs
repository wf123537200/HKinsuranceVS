const http = require("node:http");

function get(u) {
  return new Promise((r) => {
    http
      .get(u, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => r({ s: res.statusCode, h: d, ct: res.headers["content-type"] }));
      })
      .on("error", (e) => r({ s: "ERR", e: e.message }));
  });
}

(async () => {
  const r = await get("http://localhost:3000/sitemap.xml");
  console.log("status:", r.s, "content-type:", r.ct);
  console.log("size:", r.h.length, "bytes");
  console.log("--- first 40 lines ---");
  console.log(r.h.split("\n").slice(0, 40).join("\n"));
  // Quick stats
  const urls = (r.h.match(/<loc>/g) || []).length;
  const alternates = (r.h.match(/xhtml:link/g) || []).length;
  const compExcluded = !r.h.includes("/compare/prudential-ci-plan-vs");
  console.log("\n--- stats ---");
  console.log("total URLs:", urls);
  console.log("total hreflang alternates:", alternates);
  console.log("prudential-ci-plan (no-vector) excluded:", compExcluded);
})();
