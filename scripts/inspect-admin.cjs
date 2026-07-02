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
  const html = await getRaw("http://localhost:3000/admin");
  const m = html.match(/<meta[^>]+robots[^>]*>/i);
  console.log("admin robots meta:", m ? m[0] : "(none)");
  console.log("contains 'noindex':", html.includes("noindex"));
  console.log("\n<head> section:");
  const i = html.indexOf("<head>");
  if (i >= 0) console.log(html.substring(i, i + 1500));
})();
