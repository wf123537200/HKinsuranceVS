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

const pdfs = [
  // Manulife - try navigating to PDF directly
  { file: "manulife-century-legacy.pdf", url: "https://www.manulife.com.hk/content/dam/insurance/hk/zh-hk/documents/products/save/manucentury.pdf", nav: "https://www.manulife.com.hk/zh/individual/products/save.html" },
  { file: "manulife-bright-care-2-plus.pdf", url: "https://www.manulife.com.hk/content/dam/insurance/hk/zh-hk/documents/products/health/manubright-care-2-plus.pdf", nav: "https://www.manulife.com.hk/zh/individual/products/protection/critical-illness.html" },
  // New China Life - try CDN domain
  { file: "newchinalife-rongyao-xinxiang.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20231018/8c7b99e9-2ea2-4eb3-9e95-e6650109e0ff.pdf", nav: "https://static-cdn.newchinalife.com/" },
  { file: "newchinalife-rongyao-shijia.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20230630/4be4672d-ab96-413e-8ef4-81a810052b1d.pdf", nav: "https://static-cdn.newchinalife.com/" },
  { file: "newchinalife-jiankangwuyou-zhuoyue.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20250909/07f399c0-8501-4489-8312-05e3d9b1fcc3.pdf", nav: "https://static-cdn.newchinalife.com/" },
  // China Life - try correct URL
  { file: "chinalife-kangning-huixiang.pdf", url: "https://www.e-chinalife.com/upload/resources/file/productBasicInfo/de0e9ce6317c43c6b6b9bff63da495d0/300_国寿康宁终身重大疾病保险（惠享版）产品说明书.pdf", nav: "https://www.e-chinalife.com/" },
];

let totalOk = 0;
let lastNav = "";

for (const { file, url, nav } of pdfs) {
  try {
    if (nav !== lastNav) {
      console.log(`Visiting ${nav}...`);
      await page.goto(nav, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(2000);
      lastNav = nav;
    }

    const base64 = await page.evaluate(async (pdfUrl) => {
      try {
        const resp = await fetch(pdfUrl, { credentials: "include" });
        if (!resp.ok) return "ERROR: HTTP " + resp.status;
        const blob = await resp.blob();
        if (blob.size < 1000) return "ERROR: Too small (" + blob.size + " bytes)";
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        return "ERROR: " + e.message;
      }
    }, url);

    if (typeof base64 === "string" && (base64.startsWith("data:application/pdf") || base64.startsWith("data:application/octet-stream"))) {
      const buf = Buffer.from(base64.split(",")[1], "base64");
      fs.writeFileSync(path.join(pdfDir, file), buf);
      console.log(`OK ${file}: ${(buf.length / 1024).toFixed(1)} KB`);
      totalOk++;
    } else {
      console.log(`SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 100) : "unknown"}`);
    }
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
  }
}

await browser.close();
console.log(`\nDone: ${totalOk}/${pdfs.length} PDFs downloaded`);
