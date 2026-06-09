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

// AIA has a dedicated brochure download page
const page = await browser.newPage();
await page.goto("https://www.aia.com.hk/zh-hk/help-and-support/product-brochures-individuals", {
  waitUntil: "domcontentloaded",
  timeout: 30000,
});
await page.waitForTimeout(4000);

// Find all PDF links
const links = await page.$$eval("a", (els) =>
  els
    .filter((el) => {
      const href = (el.href || "").toLowerCase();
      return href.includes(".pdf") && href.includes("zh-hk");
    })
    .map((el) => ({
      href: el.href,
      text: (el.textContent || "").trim().substring(0, 150),
    }))
);

const unique = [...new Map(links.map((l) => [l.href, l])).values()];

console.log("AIA Product Brochures: " + unique.length + " PDFs found\n");

// Categorize by product type
const ci = unique.filter((l) => {
  const t = (l.href + l.text).toLowerCase();
  return t.includes("critical") || t.includes("ci") || t.includes("危疾") || t.includes("health");
});

const savings = unique.filter((l) => {
  const t = (l.href + l.text).toLowerCase();
  return t.includes("savings") || t.includes("save") || t.includes("globalflexi") || t.includes("儲蓄");
});

console.log("=== Critical Illness ===");
for (const l of ci.slice(0, 10)) {
  console.log("  " + l.text.substring(0, 60));
  console.log("  " + l.href.substring(0, 150));
}

console.log("\n=== Savings ===");
for (const l of savings.slice(0, 10)) {
  console.log("  " + l.text.substring(0, 60));
  console.log("  " + l.href.substring(0, 150));
}

// Download the Global Flexi brochure
const globalFlexi = unique.find((l) => l.href.includes("GlobalFlexi"));
if (globalFlexi) {
  console.log("\nDownloading: " + globalFlexi.href);
  const pdfPage = await browser.newPage();
  const response = await pdfPage.goto(globalFlexi.href, { timeout: 30000 });
  if (response && response.ok()) {
    const buffer = await response.body();
    const filePath = path.join(pdfDir, "aia-savings-leader.pdf");
    fs.writeFileSync(filePath, buffer);
    console.log("Saved: " + filePath + " (" + buffer.length + " bytes)");
  }
  await pdfPage.close();
}

// Try to find and download CI brochure
const ciBrochure = unique.find(
  (l) => l.href.includes("critical") || l.href.includes("ci") || l.href.includes("wealth-elite")
);
if (ciBrochure) {
  console.log("\nDownloading CI: " + ciBrochure.href);
  const pdfPage = await browser.newPage();
  const response = await pdfPage.goto(ciBrochure.href, { timeout: 30000 });
  if (response && response.ok()) {
    const buffer = await response.body();
    const filePath = path.join(pdfDir, "aia-ci-elite.pdf");
    fs.writeFileSync(filePath, buffer);
    console.log("Saved: " + filePath + " (" + buffer.length + " bytes)");
  }
  await pdfPage.close();
}

await page.close();
await browser.close();

// Save all results
fs.writeFileSync(
  path.join(__dirname, "aia-brochures.json"),
  JSON.stringify(unique, null, 2)
);
console.log("\nAll " + unique.length + " brochure links saved.");
