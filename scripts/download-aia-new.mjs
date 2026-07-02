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

// First visit AIA brochure page to get cookies
const page = await context.newPage();
await page.goto("https://www.aia.com.hk/zh-hk/help-and-support/product-brochures-individuals", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(3000);

const pdfs = [
  { file: "aia-level-up-ci.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/level-up/Level-Up_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-multiple-care-pro-2.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/multiple-care-pro-2/MultipleCarePro2_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-on-your-side-2.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/on-your-side-plan-2/OnYourSideInsurancePlan2_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-simple-care-essence.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/simple-care-essence/SimpleCareEssence_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-smart-elite-ultra.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/smart-elite-ultra/SmartEliteUltra_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-super-healthguard-pro.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/super-healthguard-pro/SuperHealthGuardPro_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-cancer-guardian-3.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/cancer-guardian-3/CancerGuardian3_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-globalflexi-savings.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/globalflexi-savings-insurance-plan/GlobalFlexiSavingsInsurancePlan_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-wealth-flexi-savings.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/wealth-flexi-savings-insurance-plan/WealthFlexiSavingsInsurancePlan_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-wealth-generation.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/wealth-generation/WealthGeneration_tc.pdf.coredownload.inline.pdf" },
];

let totalOk = 0;

for (const { file, url } of pdfs) {
  try {
    // Use page.evaluate to fetch the PDF as base64
    const base64 = await page.evaluate(async (pdfUrl) => {
      try {
        const resp = await fetch(pdfUrl, { credentials: "include" });
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
      const filePath = path.join(pdfDir, file);
      fs.writeFileSync(filePath, buf);
      console.log(`OK ${file}: ${(buf.length / 1024).toFixed(1)} KB`);
      totalOk++;
    } else {
      console.log(`SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 50) : "unknown"}`);
    }
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
  }
}

await browser.close();
console.log(`\nDone: ${totalOk} PDFs downloaded`);
