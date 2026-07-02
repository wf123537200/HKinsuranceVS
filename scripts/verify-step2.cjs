const http = require("node:http");
http.get("http://localhost:3000/zh-CN", (res) => {
  let d = "";
  res.on("data", (c) => (d += c));
  res.on("end", () => {
    const idx = d.indexOf("<title>");
    console.log("First <title>:", d.substring(idx, idx + 200));
    const idx2 = d.indexOf("og:title");
    console.log("og:title area:", d.substring(idx2 - 5, idx2 + 250));
  });
});
