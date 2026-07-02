const http = require("node:http");

function get(u) {
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
  const html = await get("http://localhost:3000/zh-CN/product/pru-entrust-multi-currency");
  const m = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/);
  if (!m) { console.log("no JSON-LD found"); process.exit(1); }
  const parsed = JSON.parse(m[1]);
  console.log("@context:", parsed["@context"]);
  console.log("@type:", parsed["@type"]);
  console.log("position continuity:", parsed.itemListElement.map(x => x.position).join(","));
  // Verify the JSON.parse succeeds and the structure conforms to schema.org
  const ok =
    parsed["@context"] === "https://schema.org" &&
    parsed["@type"] === "BreadcrumbList" &&
    Array.isArray(parsed.itemListElement) &&
    parsed.itemListElement.every((x, i) =>
      x["@type"] === "ListItem" &&
      x.position === i + 1 &&
      typeof x.name === "string" &&
      x.item && x.item.startsWith("https://")
    );
  console.log("schema.org conformance:", ok ? "PASS ✓" : "FAIL ✗");
  // Show that no <script injection is possible from arbitrary strings
  console.log("\nraw JSON-LD payload:");
  console.log(m[1]);
})();
