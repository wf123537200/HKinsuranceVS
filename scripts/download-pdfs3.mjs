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

// Download PDFs by clicking links on product pages
const downloadTasks = [
  {
    file: "aia-ci-elite.pdf",
    pageUrl: "https://www.aia.com.hk/zh-hk/products/health/critical-illness",
    linkText: /產品簡介|product brochure|危疾/i,
  },
  {
    file: "aia-savings-leader.pdf",
    pageUrl: "https://www.aia.com.hk/zh-hk/products/save/global-flexi",
    linkText: /產品簡介|product brochure|環宇盈活/i,
  },
  {
    file: "prudential-ci-plan.pdf",
    pageUrl: "https://www.prudential.com.hk/zh/products/protection/",
    linkText: /產品簡介|product brochure|download/i,
  },
  {
    file: "manulife-ci-plus.pdf",
    pageUrl: "https://www.manulife.com.hk/zh-hk/individual/products/protection.html",
    linkText: /產品簡介|product brochure|download/i,
  },
  {
    file: "fwd-ci-defender.pdf",
    pageUrl: "https://www.fwd.com.hk/zh/products/insurance/critical-illness/",
    linkText: /產品簡介|product brochure|download/i,
  },
];

for (const { file, pageUrl, linkText } of downloadTasks) {
  try {
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(3000);

    // Find the download link
    const link = await page.$(`a[href*=".pdf"]`);
    if (link) {
      const href = await link.getAttribute("href");
      const text = await link.textContent();
      console.log(file + ": Found link: " + (text || "").trim().substring(0, 60));
      console.log("  URL: " + (href || "").substring(0, 120));

      // Try to download by clicking
      try {
        const [download] = await Promise.all([
          page.waitForEvent("download", { timeout: 15000 }),
          link.click(),
        ]);

        const suggestedName = download.suggestedFilename();
        const savePath = path.join(pdfDir, file);
        await download.saveAs(savePath);
        const size = fs.statSync(savePath).size;
        console.log("  Downloaded: " + size + " bytes (" + suggestedName + ")");
      } catch (dlErr) {
        console.log("  Download failed: " + dlErr.message.split("\n")[0]);
        
        // Try direct fetch with proper referrer
        if (href) {
          const fullUrl = href.startsWith("http") ? href : new URL(href, pageUrl).href;
          const resp = await page.evaluate(async (url) => {
            try {
              const r = await fetch(url, { credentials: "include" });
              const blob = await r.blob();
              const reader = new FileReader();
              return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            } catch (e) {
              return "ERROR: " + e.message;
            }
          }, fullUrl);
          
          if (typeof resp === "string" && resp.startsWith("data:application/pdf")) {
            const b64 = resp.split(",")[1];
            fs.writeFileSync(path.join(pdfDir, file), Buffer.from(b64, "base64"));
            console.log("  Fetched via JS: " + fs.statSync(path.join(pdfDir, file)).size + " bytes");
          }
        }
      }
    } else {
      console.log(file + ": No PDF link found on page");
    }
    await page.close();
  } catch (e) {
    console.log(file + ": FAIL - " + e.message.split("\n")[0]);
  }
}

await browser.close();
console.log("\nDone!");
