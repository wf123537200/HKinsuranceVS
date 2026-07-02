const fs = require("fs");

for (const f of ["components/Header.tsx", "components/Footer.tsx"]) {
  const t = fs.readFileSync(f, "utf8");
  console.log("=== " + f + " ===");
  const hrefs = [...t.matchAll(/href[:=]\s*["']([^"']+)["']/g)].map((m) => m[1]);
  const internal = [...new Set(hrefs.filter((h) => h.startsWith("/") && !h.startsWith("//")))];
  console.log("internal hrefs:", internal);
}
