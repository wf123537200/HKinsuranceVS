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
  // Find ALL sr-only occurrences
  const matches = [...html.matchAll(/<div[^>]*sr-only[^>]*>([\s\S]*?)<\/div>/g)];
  console.log(`Found ${matches.length} sr-only div(s):`);
  matches.forEach((m, i) => {
    console.log(`--- div ${i} (length ${m[1].length}) ---`);
    console.log(m[1].substring(0, 1500));
  });
})();
