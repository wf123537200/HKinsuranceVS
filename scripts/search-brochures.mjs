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

// Search each company's site for brochure/product info pages
const searches = [
  // Prudential - try multiple URLs
  { company: "prudential", product: "ci-plan", urls: [
    "https://www.prudential.com.hk/zh/products/protection",
    "https://www.prudential.com.hk/zh/claims-and-support",
    "https://www.prudential.com.hk/zh/products",
  ]},
  { company: "prudential", product: "savings-plan", urls: [
    "https://www.prudential.com.hk/zh/products/savings",
  ]},
  // Manulife
  { company: "manulife", product: "ci-plus", urls: [
    "https://www.manulife.com.hk/zh-hk/individual/products/protection.html",
    "https://www.manulife.com.hk/zh-hk/individual/products.html",
  ]},
  // AXA
  { company: "axa", product: "health-shield", urls: [
    "https://www.axa.com.hk/zh/health-insurance",
    "https://www.axa.com.hk/zh/life-insurance-savings",
  ]},
  // FWD
  { company: "fwd", product: "ci-defender", urls: [
    "https://www.fwd.com.hk/zh/products/insurance",
    "https://www.fwd.com.hk/zh/products/insurance/critical-illness",
  ]},
];

const results = [];

for (const { company, product, urls } of searches) {
  for (const url of urls) {
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(3000);

      // Find all links with text containing brochure/product info keywords
      const links = await page.$$eval("a", (els) =>
        els
          .filter((el) => {
            const text = (el.textContent || "").toLowerCase();
            const href = (el.href || "").toLowerCase();
            return (
              href.includes(".pdf") ||
              href.includes("brochure") ||
              href.includes("leaflet") ||
              text.includes("產品簡介") ||
              text.includes("产品简介") ||
              text.includes("product brochure") ||
              text.includes("download brochure") ||
              text.includes("下載") && href.includes("pdf")
            );
          })
          .map((el) => ({
            href: el.href,
            text: (el.textContent || "").trim().substring(0, 120),
          }))
      );

      const unique = [...new Map(links.map((l) => [l.href, l])).values()];

      if (unique.length > 0) {
        console.log(company + "/" + product + " (" + url.split("/").pop() + "): Found " + unique.length);
        for (const link of unique.slice(0, 5)) {
          console.log("  " + link.text.substring(0, 60) + " => " + link.href.substring(0, 120));
          results.push({ company, product, url: link.href, text: link.text });
        }
      } else {
        console.log(company + "/" + product + " (" + url.split("/").pop() + "): No links found");
      }
      await page.close();
    } catch (e) {
      console.log(company + "/" + product + ": FAIL - " + e.message.split("\n")[0]);
    }
  }
}

fs.writeFileSync(
  path.join(__dirname, "brochure-search-results.json"),
  JSON.stringify(results, null, 2)
);

await browser.close();
console.log("\nTotal: " + results.length + " brochure links found");
