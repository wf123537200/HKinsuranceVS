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

// PDFs to download - matched to our products
const pdfs = [
  // AIA
  { file: "aia-ci-elite.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/super-healthguard-pro/SuperHealthGuardPro_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-savings-leader.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/globalflexi-savings-insurance-plan/GlobalFlexiSavingsInsurancePlan_tc.pdf.coredownload.inline.pdf" },
];

for (const { file, url } of pdfs) {
  try {
    const page = await context.newPage();
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    if (response) {
      const body = await response.body();
      const contentType = response.headers()["content-type"] || "";
      console.log(file + ": " + body.length + " bytes, type: " + contentType);
      
      // Check if it's actually a PDF (starts with %PDF)
      const isPdf = body.slice(0, 5).toString().startsWith("%PDF");
      if (isPdf) {
        fs.writeFileSync(path.join(pdfDir, file), body);
        console.log("  -> Saved as PDF");
      } else {
        // Try to find the actual PDF URL from the page content
        const text = body.toString().substring(0, 500);
        console.log("  -> Not a PDF. Content: " + text.substring(0, 200));
      }
    }
    await page.close();
  } catch (e) {
    console.log(file + ": FAIL - " + e.message.split("\n")[0]);
  }
}

// Also try using page.goto with download event
console.log("\n--- Trying download approach ---");
for (const { file, url } of pdfs) {
  try {
    const page = await context.newPage();
    
    // Use page.evaluate to fetch the PDF as ArrayBuffer
    const base64 = await page.evaluate(async (pdfUrl) => {
      const resp = await fetch(pdfUrl, { credentials: "include" });
      const blob = await resp.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }, url);
    
    // Navigate to the AIA page first to get cookies
    await page.goto("https://www.aia.com.hk", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    
    // Now try fetching the PDF with cookies
    const pdfBase64 = await page.evaluate(async (pdfUrl) => {
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
    
    if (pdfBase64 && pdfBase64.startsWith("data:application/pdf")) {
      const base64Data = pdfBase64.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(path.join(pdfDir, file), buffer);
      console.log(file + ": Downloaded " + buffer.length + " bytes via fetch");
    } else {
      console.log(file + ": fetch result = " + (pdfBase64 || "").substring(0, 100));
    }
    
    await page.close();
  } catch (e) {
    console.log(file + ": FAIL - " + e.message.split("\n")[0]);
  }
}

await browser.close();
console.log("Done!");
