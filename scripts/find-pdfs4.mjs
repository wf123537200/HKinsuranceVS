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

const searches = [
  // AIA specific product pages with known PDF brochures
  { company: "aia", product: "savings-leader", url: "https://www.aia.com.hk/zh-hk/products/save/global-flexi", label: "AIA Global Flexi" },
  { company: "aia", product: "ci-elite", url: "https://www.aia.com.hk/zh-hk/products/health/critical-illness/aia-wealth-elite-ci-plan", label: "AIA Wealth Elite CI" },
  { company: "aia", product: "ci-elite", url: "https://www.aia.com.hk/zh-hk/products/health/critical-illness", label: "AIA CI List" },
  // Prudential - try product-specific pages
  { company: "prudential", product: "ci-plan", url: "https://www.prudential.com.hk/zh/products/protection/pruactive-care/index.xhtml", label: "Prudential PruActive Care" },
  { company: "prudential", product: "savings-plan", url: "https://www.prudential.com.hk/zh/products/savings/pruwealth/index.xhtml", label: "Prudential PruWealth" },
  // Manulife
  { company: "manulife", product: "ci-plus", url: "https://www.manulife.com.hk/zh-hk/individual/products/protection.html", label: "Manulife Protection" },
  // AXA
  { company: "axa", product: "health-shield", url: "https://www.axa.com.hk/zh/life-insurance-savings", label: "AXA Life" },
  // FWD
  { company: "fwd", product: "ci-defender", url: "https://www.fwd.com.hk/zh/products/insurance/critical-illness/", label: "FWD CI" },
  // Mainland - specific product pages
  { company: "pingan", product: "ci-insurance", url: "https://baoxian.pingan.com/product/detail/shtml?id=1001", label: "Ping An Product" },
  { company: "cpic", product: "ci-guardian", url: "https://www.cpic.com.cn/xrsbx/", label: "CPIC Life" },
  { company: "newchinalife", product: "ci", url: "https://www.newchinalife.com/spage/cn/productCenterCode/index.html", label: "NCI Products" },
];

const results = [];

for (const { company, product, url, label } of searches) {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(3000);

    // Get all links on page
    const allLinks = await page.$$eval("a", (els) =>
      els.map((el) => ({
        href: el.href || "",
        text: (el.textContent || "").trim().substring(0, 120),
      }))
    );

    // Filter for PDF-related links
    const pdfLinks = allLinks.filter((l) => {
      const h = l.href.toLowerCase();
      const t = l.text.toLowerCase();
      return (
        h.includes(".pdf") ||
        t.includes("產品簡介") ||
        t.includes("产品简介") ||
        t.includes("产品手册") ||
        t.includes("brochure") ||
        t.includes("product leaflet") ||
        t.includes("产品说明书")
      );
    });

    const unique = [...new Map(pdfLinks.map((l) => [l.href, l])).values()];

    if (unique.length > 0) {
      console.log(label + ": Found " + unique.length + " PDF links");
      for (const link of unique.slice(0, 5)) {
        console.log("  " + link.text.substring(0, 60) + " => " + link.href.substring(0, 150));
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
  path.join(__dirname, "pdf-results4.json"),
  JSON.stringify(results, null, 2)
);

await browser.close();
console.log("\nTotal: " + results.length + " PDFs");
