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

// Search individual product pages for PDF brochures
const searches = [
  // AIA - go to individual product pages
  { company: "aia", product: "ci-elite", url: "https://www.aia.com.hk/zh-hk/products/health/critical-illness", label: "AIA CI Products" },
  { company: "aia", product: "savings-leader", url: "https://www.aia.com.hk/zh-hk/products/save", label: "AIA Savings" },
  // Prudential
  { company: "prudential", product: "ci-plan", url: "https://www.prudential.com.hk/zh/products/protection/pruactive-care", label: "Prudential CI" },
  // Manulife
  { company: "manulife", product: "ci-plus", url: "https://www.manulife.com.hk/zh-hk/individual/products/protection/critical-care-series.html", label: "Manulife CI" },
  // AXA
  { company: "axa", product: "health-shield", url: "https://www.axa.com.hk/zh/health-insurance", label: "AXA Health" },
  // FWD
  { company: "fwd", product: "ci-defender", url: "https://www.fwd.com.hk/zh/products/insurance/critical-illness/", label: "FWD CI" },
  // Mainland companies
  { company: "pingan", product: "ci-insurance", url: "https://baoxian.pingan.com/product/mingxing-product-list.shtml", label: "Ping An Products" },
  { company: "chinalife", product: "ci-coverage", url: "https://www.chinalife.com.cn/chinalife/xrsbx/", label: "China Life Life Insurance" },
  { company: "taikang", product: "ci-plus", url: "https://www.taikanglife.com/productCenter/", label: "Taikang Products" },
  { company: "cpic", product: "ci-guardian", url: "https://www.cpic.com.cn/xrsbx/", label: "CPIC Life Insurance" },
  { company: "newchinalife", product: "ci", url: "https://www.newchinalife.com/spage/cn/productCenterCode/index.html", label: "New China Life Products" },
];

const results = [];

for (const { company, product, url, label } of searches) {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(3000);

    // Find all PDF links on the page
    const pdfLinks = await page.$$eval('a[href*=".pdf"]', (els) =>
      els.map((el) => ({
        href: el.href,
        text: (el.textContent || "").trim().substring(0, 120),
      }))
    );

    // Also look for links with text containing brochure/product manual
    const brochureLinks = await page.$$eval('a', (els) =>
      els
        .filter((el) => {
          const text = (el.textContent || "").toLowerCase();
          const href = (el.href || "").toLowerCase();
          return (
            href.includes(".pdf") ||
            text.includes("pdf") ||
            text.includes("产品简介") ||
            text.includes("产品手册") ||
            text.includes("brochure") ||
            text.includes("product leaflet") ||
            text.includes("download") && href.includes("pdf")
          );
        })
        .map((el) => ({
          href: el.href,
          text: (el.textContent || "").trim().substring(0, 120),
        }))
    );

    const allLinks = [...pdfLinks, ...brochureLinks];
    const uniqueLinks = [...new Map(allLinks.map((l) => [l.href, l])).values()];

    if (uniqueLinks.length > 0) {
      console.log(label + ": Found " + uniqueLinks.length + " PDFs");
      for (const link of uniqueLinks.slice(0, 5)) {
        console.log("  - " + link.text + " => " + link.href.substring(0, 150));
        results.push({ company, product, text: link.text, url: link.href });
      }
    } else {
      console.log(label + ": No PDFs found");
    }
    await page.close();
  } catch (e) {
    console.log(label + ": FAIL - " + e.message.split("\n")[0]);
  }
}

fs.writeFileSync(
  path.join(__dirname, "pdf-results2.json"),
  JSON.stringify(results, null, 2)
);

await browser.close();
console.log("\nTotal PDFs found: " + results.length);
