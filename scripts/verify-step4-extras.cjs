const http = require("node:http");

http.get("http://localhost:3000/sitemap.xml", (res) => {
  let d = "";
  res.on("data", (c) => (d += c));
  res.on("end", () => {
    const tests = [
      // Should be present
      "/company/prudential-hk",
      "/product/pru-entrust-multi-currency",
      "/compare/pru-guardian-ci-series-vs-aia-essence-on-your-side",
      "/compare/pru-entrust-multi-currency-vs-aia-globalflexi-savings",
      // Should be excluded
      "/compare/prudential-ci-plan-vs-aia-essence-on-your-side",
      "/admin",
      "/login",
      "/search",
      "/rankings",
      "/compare",  // hub list, noindex
    ];
    console.log("--- inclusion audit ---");
    for (const t of tests) {
      const present = d.includes(t);
      const expect = !t.startsWith("/admin") && !t.startsWith("/login") && !t.startsWith("/search") && !t.startsWith("/rankings") && t !== "/compare" && !t.includes("prudential-ci-plan");
      const ok = present === expect;
      console.log(`  ${expect ? "EXPECT present" : "EXPECT absent"}: ${t} -> ${present ? "present" : "absent"} ${ok ? "✓" : "✗"}`);
    }
  });
});
