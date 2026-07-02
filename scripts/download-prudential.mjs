// Download Prudential PDFs using Playwright browser
import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, "..", "public", "pdfs");

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Users\\12353\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe",
});

const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();

// First visit Prudential to get cookies
await page.goto("https://www.prudential.com.hk/tc/products/health/", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(3000);

const base = "https://www.prudential.com.hk";
const pdfs = [
  // CI products
  { file: "pru-guardian-ci-series.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/pruhealth-guardian-critical-illness-plan-series-product-brochure.pdf" },
  { file: "pru-ci-extended-care-iii.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/pruhealth-critical-illness-extended-care-iii-product-brochure.pdf" },
  { file: "pru-ci-first-protect-ii.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/pruhealth-critical-illness-first-protect-ii-product-brochure.pdf" },
  { file: "pru-easywell-ci-protector.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/product-ecs-ecm-product-brochure.pdf.coredownload.inline.pdf" },
  { file: "pru-cancer-360.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/prucancer-360-product-brochure.pdf" },
  { file: "pru-ci-term-ii.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/pruhealth-critical-illness-term-ii-product-brochure.pdf" },
  // Savings products
  { file: "pace-product-brochure-en.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/pace-product-brochure.pdf" },
  { file: "enlit-product-brochure-en.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/enlit-product-brochure.pdf" },
  { file: "pru-entrust-multi-currency.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/trst-product-brochure.pdf" },
  { file: "prime-eternity-en.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/prime-eternity-product-brochure.pdf" },
  { file: "evergreen-growth-saver-plus-ii-en.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/evergreen-growth-saver-plus-ii-product-brochure-tc.pdf" },
  { file: "pru-headstart-saver-series.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/prulife-headstart-saver-series-product-brochure.pdf" },
  // Retirement
  { file: "pru-retirement-deferred-annuity.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/pruretirement-deferred-annuity-plan-product-brochure.pdf" },
  { file: "pru-evergreen-wealth-income-plus.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/evergreen-wealth-income-plus-product-brochure.pdf" },
  { file: "pru-evergreen-wealth-income.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/evergreen-wealth-income-product-brochure.pdf" },
  { file: "pru-coupon-saver.pdf", path: "/content/dam/prudential-phkl/pdf/tc/brochure/prulife-coupon-saver-product-brochure.pdf" },
];

let totalOk = 0;

for (const { file, path: pdfPath } of pdfs) {
  const filePath = path.join(pdfDir, file);
  
  // Skip if already downloaded
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    console.log(`SKIP ${file}: already exists`);
    totalOk++;
    continue;
  }
  
  try {
    const url = pdfPath.startsWith('http') ? pdfPath : base + pdfPath;
    const base64 = await page.evaluate(async (pdfUrl) => {
      try {
        const resp = await fetch(pdfUrl, { credentials: "include" });
        if (!resp.ok) return "ERROR: HTTP " + resp.status;
        const blob = await resp.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        return "ERROR: " + e.message;
      }
    }, url);

    if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
      const data = base64.split(",")[1];
      const buf = Buffer.from(data, "base64");
      fs.writeFileSync(filePath, buf);
      console.log(`OK ${file}: ${(buf.length / 1024).toFixed(1)} KB`);
      totalOk++;
    } else if (typeof base64 === "string" && base64.startsWith("data:application/octet-stream")) {
      const data = base64.split(",")[1];
      const buf = Buffer.from(data, "base64");
      fs.writeFileSync(filePath, buf);
      console.log(`OK ${file} (octet-stream): ${(buf.length / 1024).toFixed(1)} KB`);
      totalOk++;
    } else {
      console.log(`SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 80) : "unknown"}`);
    }
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
  }
}

await browser.close();
console.log(`\nDone: ${totalOk}/${pdfs.length} Prudential PDFs downloaded`);
