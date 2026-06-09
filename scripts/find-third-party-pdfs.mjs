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

const context = await browser.newContext({ acceptDownloads: true });

// Search queries for each product on 10Life and other platforms
const searches = [
  // Prudential
  { company: "prudential", product: "ci-plan", query: "site:10life.com prudential 危疾" },
  { company: "prudential", product: "savings-plan", query: "site:10life.com prudential 儲蓄" },
  // Manulife
  { company: "manulife", product: "ci-plus", query: "site:10life.com manulife 危疾" },
  { company: "manulife", product: "savings", query: "site:10life.com manulife 儲蓄" },
  // AXA
  { company: "axa", product: "health-shield", query: "site:10life.com axa 危疾" },
  // FWD
  { company: "fwd", product: "ci-defender", query: "site:10life.com fwd 危疾" },
];

// First, let's search 10Life for product brochures
console.log("=== Searching 10Life ===\n");

// 10Life product pages
const tenLifeSearches = [
  { company: "prudential", product: "ci-plan", url: "https://www.10life.com/zh/insurance/critical-illness/prudential" },
  { company: "aia", product: "ci-elite", url: "https://www.10life.com/zh/insurance/critical-illness/aia" },
  { company: "manulife", product: "ci-plus", url: "https://www.10life.com/zh/insurance/critical-illness/manulife" },
  { company: "axa", product: "health-shield", url: "https://www.10life.com/zh/insurance/critical-illness/axa" },
  { company: "fwd", product: "ci-defender", url: "https://www.10life.com/zh/insurance/critical-illness/fwd" },
];

const results = [];

for (const { company, product, url } of tenLifeSearches) {
  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Find PDF links
    const pdfLinks = await page.$$eval("a", (els) =>
      els
        .filter((el) => {
          const href = (el.href || "").toLowerCase();
          return href.includes(".pdf");
        })
        .map((el) => ({
          href: el.href,
          text: (el.textContent || "").trim().substring(0, 120),
        }))
    );

    if (pdfLinks.length > 0) {
      console.log(company + "/" + product + ": Found " + pdfLinks.length + " PDFs on 10Life");
      for (const link of pdfLinks.slice(0, 3)) {
        console.log("  " + link.text.substring(0, 60) + " => " + link.href.substring(0, 120));
        results.push({ company, product, source: "10life", url: link.href, text: link.text });
      }
    } else {
      console.log(company + "/" + product + ": No PDFs on 10Life page");
    }
    await page.close();
  } catch (e) {
    console.log(company + "/" + product + ": FAIL - " + e.message.split("\n")[0]);
  }
}

// Now try searching Google for PDFs
console.log("\n=== Searching Google ===\n");

const googleSearches = [
  { company: "prudential", product: "ci-plan", query: "保誠 危疾 產品簡介 PDF 2024 2025" },
  { company: "prudential", product: "savings-plan", query: "保誠 儲蓄 產品簡介 PDF 2024 2025" },
  { company: "manulife", product: "ci-plus", query: "宏利 危疾 產品簡介 PDF 2024 2025" },
  { company: "manulife", product: "savings", query: "宏利 儲蓄 產品簡介 PDF 2024 2025" },
  { company: "axa", product: "health-shield", query: "AXA 安盛 危疾 產品簡介 PDF 2024 2025" },
  { company: "fwd", product: "ci-defender", query: "富衛 危疾 產品簡介 PDF 2024 2025" },
  { company: "pingan", product: "ci-insurance", query: "平安保险 重疾险 产品手册 PDF" },
  { company: "chinalife", product: "ci-coverage", query: "中国人寿 重疾险 产品手册 PDF" },
  { company: "taikang", product: "ci-plus", query: "泰康 重疾险 产品手册 PDF" },
  { company: "cpic", product: "ci-guardian", query: "太平洋保险 重疾险 产品手册 PDF" },
  { company: "newchinalife", product: "ci", query: "新华保险 重疾险 产品手册 PDF" },
];

for (const { company, product, query } of googleSearches) {
  try {
    const page = await context.newPage();
    const searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(query) + "&num=10";
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Find PDF results
    const links = await page.$$eval("a", (els) =>
      els
        .filter((el) => {
          const href = (el.href || "").toLowerCase();
          return href.includes(".pdf");
        })
        .map((el) => ({
          href: el.href,
          text: (el.textContent || "").trim().substring(0, 120),
        }))
    );

    if (links.length > 0) {
      console.log(company + "/" + product + ": Found " + links.length + " PDFs on Google");
      for (const link of links.slice(0, 3)) {
        console.log("  " + link.text.substring(0, 60));
        console.log("  " + link.href.substring(0, 150));
        results.push({ company, product, source: "google", url: link.href, text: link.text });
      }
    } else {
      console.log(company + "/" + product + ": No PDFs on Google");
    }
    await page.close();
  } catch (e) {
    console.log(company + "/" + product + ": FAIL - " + e.message.split("\n")[0]);
  }
}

fs.writeFileSync(
  path.join(__dirname, "third-party-pdfs.json"),
  JSON.stringify(results, null, 2)
);

await browser.close();
console.log("\nTotal found: " + results.length);
