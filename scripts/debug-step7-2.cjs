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
  // find the sr-only div more leniently — match any opening div with sr-only
  const m = html.match(/<div[^>]*sr-only[^>]*>([\s\S]*?)<\/div>/);
  if (!m) { console.log("no sr-only found"); return; }
  console.log("sr-only length:", m[1].length);
  console.log("first 800 chars:");
  console.log(m[1].substring(0, 800));
  console.log("---");
  console.log("Looking for 'What is':", m[1].includes("What is"));
  console.log("Looking for 'What is Prudential':", m[1].includes("What is Prudential"));
})();
