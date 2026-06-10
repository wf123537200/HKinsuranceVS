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

// Search each company's product pages for PDF links
const searches = [
  // AIA - search CI and savings pages
  { 
    name: "AIA", 
    pages: [
      "https://www.aia.com.hk/zh-hk/products/health/critical-illness",
      "https://www.aia.com.hk/zh-hk/products/save",
    ]
  },
  // Prudential - search product pages
  { 
    name: "Prudential", 
    pages: [
      "https://www.prudential.com.hk/zh/products/protection",
      "https://www.prudential.com.hk/zh/products/savings",
    ]
  },
  // Manulife - search product pages
  { 
    name: "Manulife", 
    pages: [
      "https://www.manulife.com.hk/zh-hk/individual/products/protection.html",
      "https://www.manulife.com.hk/zh-hk/individual/products/save/savings.html",
    ]
  },
  // AXA - search downloads page
  { 
    name: "AXA", 
    pages: [
      "https://www.axa.com.hk/zh/downloads/life-and-savings",
      "https://www.axa.com.hk/zh/health-insurance",
    ]
  },
  // FWD - search product pages
  { 
    name: "FWD", 
    pages: [
      "https://www.fwd.com.hk/zh/products/insurance/critical-illness",
      "https://www.fwd.com.hk/zh/products/insurance/savings",
    ]
  },
  // Ping An
  { 
    name: "PingAn", 
    pages: [
      "https://baoxian.pingan.com/product/mingxing-product-list.shtml",
    ]
  },
  // CPIC
  { 
    name: "CPIC", 
    pages: [
      "https://www.cpic.com.cn/xrsbx/",
    ]
  },
  // Taikang
  { 
    name: "Taikang", 
    pages: [
      "https://www.taikanglife.com/productCenter/",
    ]
  },
  // New China Life
  { 
    name: "NCI", 
    pages: [
      "https://www.newchinalife.com/spage/cn/productCenterCode/index.html",
    ]
  },
];

const allPdfs = [];

for (const { name, pages } of searches) {
  for (const pageUrl of pages) {
    try {
      const page = await context.newPage();
      await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(3000);

      // Find all links with text containing brochure/product info keywords
      const links = await page.$$eval("a", (els) =>
        els
          .filter((el) => {
            const href = (el.href || "").toLowerCase();
            const text = (el.textContent || "").toLowerCase();
            return (
              href.includes(".pdf") ||
              href.includes("brochure") ||
              href.includes("leaflet") ||
              text.includes("產品簡介") ||
              text.includes("产品简介") ||
              text.includes("product brochure") ||
              text.includes("download brochure") ||
              text.includes("簡介") ||
              text.includes("手册")
            );
          })
          .map((el) => ({
            href: el.href,
            text: (el.textContent || "").trim().substring(0, 120),
          }))
      );

      const unique = [...new Map(links.map((l) => [l.href, l])).values()];

      if (unique.length > 0) {
        console.log(`${name} (${pageUrl.split("/").pop()}): Found ${unique.length} PDF links`);
        for (const link of unique.slice(0, 10)) {
          console.log(`  ${link.text.substring(0, 60)} => ${link.href.substring(0, 120)}`);
          allPdfs.push({ company: name, url: link.href, text: link.text });
        }
      } else {
        console.log(`${name} (${pageUrl.split("/").pop()}): No PDFs found`);
      }
      await page.close();
    } catch (e) {
      console.log(`${name}: FAIL - ${e.message.split("\n")[0]}`);
    }
  }
}

await browser.close();

fs.writeFileSync(
  path.join(__dirname, "all-pdf-links.json"),
  JSON.stringify(allPdfs, null, 2)
);
console.log(`\nTotal: ${allPdfs.length} PDF links found`);
