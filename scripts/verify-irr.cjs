const http = require("node:http");
const u = "http://localhost:3000/zh-CN/compare/manulife-genesis-centurion-vs-pru-entrust-multi-currency";
http
  .get(u, (res) => {
    console.log("status:", res.statusCode);
    let d = "";
    res.on("data", (c) => (d += c));
    res.on("end", () => {
      console.log("len:", d.length);
      const rows = [...d.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => m[1]);
      console.log("rows:", rows.length);
      rows.slice(0, 35).forEach((tr) => {
        const cells = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) =>
          m[1].replace(/<[^>]+>/g, "").trim()
        );
        if (cells.length >= 3) console.log(" ", cells.join(" | ").slice(0, 250));
      });
    });
  })
  .on("error", (e) => console.log("ERR", e.message));
