import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, "..", "public", "pdfs");

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Users\\12353\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe",
});

// Search each company's product pages for PDF brochures
const searches = [
  // AIA
  { company: "aia", url: "https://www.aia.com.hk/zh-hk/products/health", label: "AIA Health/CI" },
  { company: "aia", url: "https://www.aia.com.hk/zh-hk/products/save", label: "AIA Savings" },
  // Prudential
  { company: "prudential", url: "https://www.prudential.com.hk/zh/products/protection/", label: "Prudential Protection" },
  { company: "prudential", url: "https://www.prudential.com.hk/zh/products/savings/", label: "Prudential Savings" },
  // Manulife
  { company: "manulife", url: "https://www.manulife.com.hk/zh-hk/individual/products/protection.html", label: "Manulife Protection" },
  { company: "manulife", url: "https://www.manulife.com.hk/zh-hk/individual/products/savings.html", label: "Manulife Savings" },
  // AXA
  { company: "axa", url: "https://www.axa.com.hk/zh/health-insurance", label: "AXA Health" },
  { company: "axa", url: "https://www.axa.com.hk/zh/savings-plans", label: "AXA Savings" },
  // FWD
  { company: "fwd", url: "https://www.fwd.com.hk/zh/products/insurance/critical-illness/", label: "FWD CI" },
  { company: "fwd", url: "https://www.fwd.com.hk/zh/products/insurance/savings/", label: "FWD Savings" },
];

const results = [];

for (const { company, url, label } of searches) {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Find all PDF links
    const pdfLinks = await page.$$eval('a[href*=".pdf"]', (els) =>
      els.map((el) => ({
        href: el.href,
        text: (el.textContent || "").trim().substring(0, 100),
      }))
    );

    if (pdfLinks.length > 0) {
      console.log(label + ": Found " + pdfLinks.length + " PDFs");
      for (const link of pdfLinks.slice(0, 5)) {
        console.log("  - " + link.text + " => " + link.href.substring(0, 120));
        results.push({ company, text: link.text, url: link.href });
      }
    } else {
      console.log(label + ": No PDFs found on page");
    }
    await page.close();
  } catch (e) {
    console.log(label + ": FAIL - " + e.message.split("\n")[0]);
  }
}

// Save results
fs.writeFileSync(
  path.join(__dirname, "pdf-results.json"),
  JSON.stringify(results, null, 2)
);

await browser.close();
console.log("\nTotal PDFs found: " + results.length);
console.log("Results saved to scripts/pdf-results.json");
