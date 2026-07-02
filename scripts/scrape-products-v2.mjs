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

const searches = [
  // AIA - specific product pages with brochure links
  { company: "AIA", url: "https://www.aia.com.hk/zh-hk/products/health/critical-illness", type: "CI" },
  { company: "AIA", url: "https://www.aia.com.hk/zh-hk/products/save/savings", type: "Savings" },
  // Prudential
  { company: "Prudential", url: "https://www.prudential.com.hk/tc/products/health/critical-illness/", type: "CI" },
  { company: "Prudential", url: "https://www.prudential.com.hk/tc/products/save/", type: "Savings" },
  // Manulife
  { company: "Manulife", url: "https://www.manulife.com.hk/zh-hk/individual/products/protection.html", type: "CI" },
  { company: "Manulife", url: "https://www.manulife.com.hk/zh-hk/individual/products/save/savings.html", type: "Savings" },
  // AXA
  { company: "AXA", url: "https://www.axa.com.hk/zh/health-insurance", type: "CI" },
  { company: "AXA", url: "https://www.axa.com.hk/zh/savings-plans", type: "Savings" },
  // FWD
  { company: "FWD", url: "https://www.fwd.com.hk/zh/products/insurance/critical-illness", type: "CI" },
  { company: "FWD", url: "https://www.fwd.com.hk/zh/products/insurance/savings", type: "Savings" },
];

const allProducts = [];

for (const { company, url, type } of searches) {
  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(5000);

    // Extract product cards with title, link, and PDF
    const products = await page.evaluate(() => {
      const results = [];
      // Find all product card links
      const cards = document.querySelectorAll(
        'a[href*="/product"], a[href*="/zh-hk/product"], [class*="product"] a, [class*="card"] a'
      );
      for (const card of cards) {
        const href = card.getAttribute("href") || "";
        const text = (card.textContent || "").trim();
        // Find PDF links within or near the card
        const pdfLinks = card.querySelectorAll('a[href*=".pdf"]');
        const pdfs = Array.from(pdfLinks).map((a) => a.getAttribute("href"));
        // Also check parent for PDF links
        const parent = card.closest('[class*="product"], [class*="card"]');
        if (parent) {
          parent.querySelectorAll('a[href*=".pdf"]').forEach((a) => {
            const h = a.getAttribute("href");
            if (h && !pdfs.includes(h)) pdfs.push(h);
          });
        }
        if (text.length > 3 && text.length < 100 && href.length > 10) {
          results.push({
            name: text.substring(0, 80),
            href: href,
            pdfs: pdfs,
          });
        }
      }
      return results;
    });

    // Deduplicate
    const unique = [...new Map(products.map((p) => [p.name, p])).values()];

    if (unique.length > 0) {
      console.log(`\n${company} (${type}): Found ${unique.length} products`);
      for (const p of unique.slice(0, 15)) {
        const pdfInfo = p.pdfs.length > 0 ? ` [PDF: ${p.pdfs[0].substring(0, 60)}]` : "";
        console.log(`  ${p.name.substring(0, 60)}${pdfInfo}`);
        allProducts.push({ company, type, ...p });
      }
    } else {
      console.log(`\n${company} (${type}): No products found`);
    }
    await page.close();
  } catch (e) {
    console.log(`\n${company} (${type}): FAIL - ${e.message.split("\n")[0]}`);
  }
}

await browser.close();

fs.writeFileSync(
  path.join(__dirname, "product-list-2026.json"),
  JSON.stringify(allProducts, null, 2)
);
console.log(`\n\nTotal: ${allProducts.length} products found`);
