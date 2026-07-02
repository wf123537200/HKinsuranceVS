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
  for (const u of ["/admin", "/login"]) {
    const d = await getRaw(`http://localhost:3000${u}`);
    const hasRobots = d.includes('name="robots"');
    const hasNoindex = d.includes("noindex");
    const match = d.match(/<meta[^>]+robots[^>]*>/i);
    console.log(`${u}: hasRobots=${hasRobots} hasNoindex=${hasNoindex} match=${match ? match[0] : "(none)"}`);
  }
})();
