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
  // Find the GeoBlocks sr-only opening, then find the matching closing
  // by counting <div vs </div>
  const start = html.indexOf('<div class="sr-only"');
  if (start < 0) { console.log("not found"); return; }
  let depth = 0;
  let i = start;
  let divOpen = /<div[\s>]/g;
  let divClose = /<\/div>/g;
  // crude bracket match
  while (i < html.length) {
    const openM = html.substring(i).match(/^<div[\s>]/);
    const closeM = html.substring(i).match(/^<\/div>/);
    if (openM) { depth++; i += openM[0].length; }
    else if (closeM) { depth--; i += closeM[0].length; if (depth === 0) break; }
    else { i++; }
  }
  const block = html.substring(start, i);
  console.log("sr-only block length:", block.length);
  console.log("first 2000 chars:");
  console.log(block.substring(0, 2000));
})();
