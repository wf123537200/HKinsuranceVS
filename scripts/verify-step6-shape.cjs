const http = require("node:http");

function getRaw(u) {
  return new Promise((resolve) => {
    http
      .get(u, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(d));
      })
      .on("error", () => resolve(""));
  });
}

(async () => {
  const html = await getRaw("http://localhost:3000/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side");
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]));
  console.log("total JSON-LD blocks on compare page:", blocks.length);
  blocks.forEach((b, i) => {
    if (b["@graph"]) {
      console.log(`block ${i}: @graph with ${b["@graph"].length} items`);
      b["@graph"].forEach((g, j) => {
        console.log(`  [${j}] @type=${g["@type"]} name=${g.name || "(no name)"} url=${g.url || "(no url)"}`);
        if (g["@type"] === "WebPage") {
          console.log(`     mainEntity.itemListElement.length =`, g.mainEntity?.itemListElement?.length);
        }
      });
    } else {
      console.log(`block ${i}: @type=${b["@type"]} name=${b.name || ""}`);
    }
  });
})();
