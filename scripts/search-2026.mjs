import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, "..", "public", "pdfs");

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Users\\12353\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe",
});

const context = await browser.newContext();

// Search Bing for 2026 product brochures
const queries = [
  "site:prudential.com.hk 2026 product brochure PDF",
  "site:aia.com.hk 2026 product brochure PDF",
  "site:manulife.com.hk 2026 product brochure PDF",
  "site:axa.com.hk 2026 product brochure PDF",
  "site:fwd.com.hk 2026 product brochure PDF",
  "site:pingan.com 2026 产品手册 PDF",
  "site:chinalife.com.cn 2026 产品手册 PDF",
  "site:taikang.com 2026 产品说明书 PDF",
  "site:cpic.com.cn 2026 产品说明书 PDF",
  "site:newchinalife.com 2026 产品说明书 PDF",
];

const allResults = [];

for (const query of queries) {
  try {
    const page = await context.newPage();
    const searchUrl = "https://www.bing.com/search?q=" + encodeURIComponent(query);
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Find all links
    const links = await page.$$eval("a", (els) =>
      els.map((el) => ({
        href: el.href || "",
        text: (el.textContent || "").trim().substring(0, 120),
      }))
    );

    // Filter for PDF links
    const pdfLinks = links.filter((l) => {
      const h = l.href.toLowerCase();
      return h.includes(".pdf") && !h.includes("bing.com");
    });

    const unique = [...new Set(pdfLinks.map((l) => l.href))];

    if (unique.length > 0) {
      console.log(`${query.split(" ")[0].replace("site:", "")}: Found ${unique.length} PDFs`);
      for (const link of unique.slice(0, 5)) {
        console.log(`  ${link.substring(0, 120)}`);
        allResults.push({ query: query.split(" ")[0], url: link });
      }
    } else {
      console.log(`${query.split(" ")[0].replace("site:", "")}: No PDFs found`);
    }
    await page.close();
  } catch (e) {
    console.log(`${query.split(" ")[0]}: FAIL - ${e.message.split("\n")[0]}`);
  }
}

await browser.close();

fs.writeFileSync(
  path.join(__dirname, "search-results-2026.json"),
  JSON.stringify(allResults, null, 2)
);
console.log(`\nTotal: ${allResults.length} PDFs found`);
