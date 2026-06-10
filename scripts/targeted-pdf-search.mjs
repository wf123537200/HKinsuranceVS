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

// More targeted search - look for specific product pages with brochures
const searches = [
  // AIA - we know the brochure page
  { 
    name: "AIA", 
    page: "https://www.aia.com.hk/zh-hk/help-and-support/product-brochures-individuals",
    keywords: ["危疾", "儲蓄", "savings", "critical illness", "ci"]
  },
  // Prudential - search product pages
  { 
    name: "Prudential", 
    page: "https://www.prudential.com.hk/zh/products/protection/pruactive-care",
    keywords: ["危疾", "產品簡介", "brochure", "pdf"]
  },
  // Manulife - search product pages
  { 
    name: "Manulife", 
    page: "https://www.manulife.com.hk/zh-hk/individual/products/protection/critical-care-series.html",
    keywords: ["危疾", "產品簡介", "brochure", "pdf"]
  },
  // AXA - search specific product pages
  { 
    name: "AXA", 
    page: "https://www.axa.com.hk/zh/wealth-ultra-savings-plan",
    keywords: ["儲蓄", "產品簡介", "brochure", "pdf"]
  },
  // FWD - search product pages
  { 
    name: "FWD", 
    page: "https://www.fwd.com.hk/zh/products/insurance/savings/",
    keywords: ["儲蓄", "產品簡介", "brochure", "pdf"]
  },
];

const results = [];

for (const { name, page: pageUrl, keywords } of searches) {
  try {
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);

    // Find all links
    const allLinks = await page.$$eval("a", (els) =>
      els.map((el) => ({
        href: el.href || "",
        text: (el.textContent || "").trim().substring(0, 150),
      }))
    );

    // Filter for PDF links
    const pdfLinks = allLinks.filter((l) => {
      const h = l.href.toLowerCase();
      const t = l.text.toLowerCase();
      return (
        h.includes(".pdf") ||
        t.includes("產品簡介") ||
        t.includes("产品简介") ||
        t.includes("brochure") ||
        t.includes("leaflet") ||
        t.includes("download")
      );
    });

    const unique = [...new Map(pdfLinks.map((l) => [l.href, l])).values()];

    if (unique.length > 0) {
      console.log(`${name}: Found ${unique.length} links`);
      for (const link of unique.slice(0, 10)) {
        console.log(`  ${link.text.substring(0, 60)} => ${link.href.substring(0, 120)}`);
        results.push({ company: name, url: link.href, text: link.text });
      }
    } else {
      console.log(`${name}: No PDF links found`);
    }
    await page.close();
  } catch (e) {
    console.log(`${name}: FAIL - ${e.message.split("\n")[0]}`);
  }
}

await browser.close();

fs.writeFileSync(
  path.join(__dirname, "targeted-pdf-links.json"),
  JSON.stringify(results, null, 2)
);
console.log(`\nTotal: ${results.length} links found`);
