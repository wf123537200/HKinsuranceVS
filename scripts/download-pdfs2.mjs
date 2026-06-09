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

// Create context with download behavior
const context = await browser.newContext({
  acceptDownloads: true,
});

const pdfs = [
  { file: "aia-ci-elite.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/super-healthguard-pro/SuperHealthGuardPro_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-savings-leader.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/globalflexi-savings-insurance-plan/GlobalFlexiSavingsInsurancePlan_tc.pdf.coredownload.inline.pdf" },
];

for (const { file, url } of pdfs) {
  try {
    const page = await context.newPage();

    // Intercept the response
    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes(".pdf") || resp.url().includes("coredownload"), { timeout: 30000 }),
      page.goto(url, { waitUntil: "commit", timeout: 30000 }),
    ]);

    if (response) {
      const body = await response.body();
      const header = body.slice(0, 10).toString();
      console.log(file + ": " + body.length + " bytes, header: " + header);

      if (header.startsWith("%PDF")) {
        fs.writeFileSync(path.join(pdfDir, file), body);
        console.log("  -> Saved!");
      } else {
        console.log("  -> Not PDF, trying alternative...");
      }
    }
    await page.close();
  } catch (e) {
    console.log(file + ": FAIL - " + e.message.split("\n")[0]);
  }
}

// Alternative: Use CDP to download
console.log("\n--- CDP approach ---");
for (const { file, url } of pdfs) {
  try {
    const page = await context.newPage();
    const cdp = await page.context().newCDPSession(page);

    // Enable download events
    await cdp.send("Browser.setDownloadBehavior", {
      behavior: "allowAndName",
      downloadPath: pdfDir,
      eventsEnabled: true,
    });

    await page.goto(url, { waitUntil: "commit", timeout: 30000 });
    await page.waitForTimeout(5000);

    // Check if file was downloaded
    const expectedPath = path.join(pdfDir, file);
    if (fs.existsSync(expectedPath)) {
      const size = fs.statSync(expectedPath).size;
      console.log(file + ": Downloaded " + size + " bytes");
    } else {
      // List files in pdfDir to find the download
      const files = fs.readdirSync(pdfDir);
      console.log(file + ": Not found. Files in pdfs/: " + files.join(", "));
    }
    await page.close();
  } catch (e) {
    console.log(file + ": CDP FAIL - " + e.message.split("\n")[0]);
  }
}

await browser.close();
console.log("Done!");
