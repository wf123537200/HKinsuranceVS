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
  // Prudential
  {
    company: "Prudential",
    urls: [
      "https://www.prudential.com.hk/zh/products/protection",
      "https://www.prudential.com.hk/zh/products/savings",
      "https://www.prudential.com.hk/tc/products/protection",
      "https://www.prudential.com.hk/tc/products/savings",
    ],
  },
  // AIA
  {
    company: "AIA",
    urls: [
      "https://www.aia.com.hk/zh-hk/products/health",
      "https://www.aia.com.hk/zh-hk/products/save",
      "https://www.aia.com.hk/zh-hk/products/life",
      "https://www.aia.com.hk/zh-hk/help-and-support/product-brochures-individuals",
    ],
  },
  // Manulife
  {
    company: "Manulife",
    urls: [
      "https://www.manulife.com.hk/zh-hk/individual/products/protection.html",
      "https://www.manulife.com.hk/zh-hk/individual/products/save/savings.html",
      "https://www.manulife.com.hk/zh-hk/individual/products/life/life-protection.html",
    ],
  },
  // AXA
  {
    company: "AXA",
    urls: [
      "https://www.axa.com.hk/zh/health-insurance",
      "https://www.axa.com.hk/zh/life-insurance-savings",
      "https://www.axa.com.hk/zh/savings-plans",
      "https://www.axa.com.hk/zh/downloads/life-and-savings",
    ],
  },
  // FWD
  {
    company: "FWD",
    urls: [
      "https://www.fwd.com.hk/zh/products/insurance/critical-illness",
      "https://www.fwd.com.hk/zh/products/insurance/savings",
      "https://www.fwd.com.hk/zh/products/insurance/life",
    ],
  },
  // Ping An
  {
    company: "PingAn",
    urls: [
      "https://baoxian.pingan.com/product/mingxing-product-list.shtml",
      "https://life.pingan.com/product/product-list.html",
    ],
  },
  // China Life
  {
    company: "ChinaLife",
    urls: [
      "https://www.chinalife.com.cn/chinalife/xrsbx/",
    ],
  },
  // Taikang
  {
    company: "Taikang",
    urls: [
      "https://www.taikanglife.com/productCenter/",
      "https://www.taikanglife.com/productCenter/lifeInsurance",
      "https://www.taikanglife.com/productCenter/healthInsurance",
    ],
  },
  // CPIC
  {
    company: "CPIC",
    urls: [
      "https://www.cpic.com.cn/xrsbx/",
      "https://www.cpic.com.cn/xrsbx/chanpin/",
    ],
  },
  // New China Life
  {
    company: "NCI",
    urls: [
      "https://www.newchinalife.com/spage/cn/productCenterCode/index.html",
    ],
  },
];

const allResults = [];

for (const { company, urls } of searches) {
  console.log(`\n=== ${company} ===`);
  for (const url of urls) {
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(3000);

      // Extract product names and links
      const products = await page.$$eval("a", (els) =>
        els
          .filter((el) => {
            const text = (el.textContent || "").trim();
            const href = (el.href || "").toLowerCase();
            // Filter for product-related links
            return (
              text.length > 3 &&
              text.length < 80 &&
              !href.includes("login") &&
              !href.includes("search") &&
              !href.includes("contact") &&
              !href.includes("about") &&
              !href.includes("career") &&
              (href.includes("/product") ||
                href.includes("/insurance") ||
                href.includes("/protection") ||
                href.includes("/savings") ||
                href.includes("/life") ||
                href.includes("/health") ||
                href.includes("/critical"))
            );
          })
          .map((el) => ({
            name: (el.textContent || "").trim().substring(0, 80),
            href: el.href,
          }))
          .filter((p) => p.name.length > 3 && p.name.length < 80)
      );

      // Get unique products
      const unique = [...new Map(products.map((p) => [p.name, p])).values()];

      if (unique.length > 0) {
        console.log(`  ${url.split("/").pop()}: Found ${unique.length} products`);
        for (const p of unique.slice(0, 20)) {
          console.log(`    ${p.name} => ${p.href}`);
          allResults.push({ company, name: p.name, url: p.href, source: url });
        }
      } else {
        console.log(`  ${url.split("/").pop()}: No products found`);
      }
      await page.close();
    } catch (e) {
      console.log(`  ${url.split("/").pop()}: FAIL - ${e.message.split("\n")[0]}`);
    }
  }
}

await browser.close();

fs.writeFileSync(
  path.join(__dirname, "product-list-2026.json"),
  JSON.stringify(allResults, null, 2)
);
console.log(`\nTotal: ${allResults.length} products found`);
