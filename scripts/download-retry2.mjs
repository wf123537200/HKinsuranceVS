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

// Try Manulife by navigating to product pages and finding brochure links
console.log("=== Manulife ===");
try {
  await page.goto("https://www.manulife.com.hk/zh/individual/products/save/manucentury.html", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  const pdfs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*=".pdf"]')).map(a => ({
      text: a.textContent?.trim()?.substring(0, 60),
      href: a.getAttribute('href')
    }));
  });
  console.log("Manulife Century Legacy page PDFs:", JSON.stringify(pdfs));
  
  if (pdfs.length > 0) {
    const url = pdfs[0].href;
    if (url) {
      const base64 = await page.evaluate(async (u) => {
        try {
          const r = await fetch(u, { credentials: "include" });
          if (!r.ok) return "ERR:" + r.status;
          const b = await r.blob();
          return new Promise(res => { const rd = new FileReader(); rd.onloadend = () => res(rd.result); rd.readAsDataURL(b); });
        } catch(e) { return "ERR:" + e.message; }
      }, url);
      if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
        fs.writeFileSync(path.join(pdfDir, "manulife-century-legacy.pdf"), Buffer.from(base64.split(",")[1], "base64"));
        console.log("OK manulife-century-legacy.pdf");
      }
    }
  }
} catch(e) { console.log("Manulife error:", e.message?.substring(0, 80)); }

// Try Manulife CI
try {
  await page.goto("https://www.manulife.com.hk/zh/individual/products/protection/critical-illness/manubright-care-2-plus.html", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  const pdfs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*=".pdf"]')).map(a => ({
      text: a.textContent?.trim()?.substring(0, 60),
      href: a.getAttribute('href')
    }));
  });
  console.log("Manulife CI page PDFs:", JSON.stringify(pdfs));
  
  if (pdfs.length > 0) {
    const url = pdfs[0].href;
    if (url) {
      const base64 = await page.evaluate(async (u) => {
        try {
          const r = await fetch(u, { credentials: "include" });
          if (!r.ok) return "ERR:" + r.status;
          const b = await r.blob();
          return new Promise(res => { const rd = new FileReader(); rd.onloadend = () => res(rd.result); rd.readAsDataURL(b); });
        } catch(e) { return "ERR:" + e.message; }
      }, url);
      if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
        fs.writeFileSync(path.join(pdfDir, "manulife-bright-care-2-plus.pdf"), Buffer.from(base64.split(",")[1], "base64"));
        console.log("OK manulife-bright-care-2-plus.pdf");
      }
    }
  }
} catch(e) { console.log("Manulife CI error:", e.message?.substring(0, 80)); }

// Try New China Life by navigating to their main site first
console.log("\n=== New China Life ===");
try {
  await page.goto("https://www.newchinalife.com/", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const nclPdfs = [
    { file: "newchinalife-rongyao-xinxiang.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20231018/8c7b99e9-2ea2-4eb3-9e95-e6650109e0ff.pdf" },
    { file: "newchinalife-rongyao-shijia.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20230630/4be4672d-ab96-413e-8ef4-81a810052b1d.pdf" },
    { file: "newchinalife-jiankangwuyou-zhuoyue.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20250909/07f399c0-8501-4489-8312-05e3d9b1fcc3.pdf" },
  ];
  
  for (const { file, url } of nclPdfs) {
    try {
      const base64 = await page.evaluate(async (u) => {
        try {
          const r = await fetch(u, { credentials: "include" });
          if (!r.ok) return "ERR:" + r.status;
          const b = await r.blob();
          return new Promise(res => { const rd = new FileReader(); rd.onloadend = () => res(rd.result); rd.readAsDataURL(b); });
        } catch(e) { return "ERR:" + e.message; }
      }, url);
      if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
        fs.writeFileSync(path.join(pdfDir, file), Buffer.from(base64.split(",")[1], "base64"));
        console.log(`OK ${file}`);
      } else {
        console.log(`SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 60) : "?"}`);
      }
    } catch(e) { console.log(`FAIL ${file}: ${e.message?.substring(0, 60)}`); }
  }
} catch(e) { console.log("NCL error:", e.message?.substring(0, 80)); }

// Try China Life with search
console.log("\n=== China Life ===");
try {
  await page.goto("https://www.e-chinalife.com/", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  
  // Search for the product
  const url = "https://www.e-chinalife.com/upload/resources/file/productBasicInfo/de0e9ce6317c43c6b6b9bff63da495d0/300_国寿康宁终身重大疾病保险（惠享版）产品说明书.pdf";
  const base64 = await page.evaluate(async (u) => {
    try {
      const r = await fetch(u, { credentials: "include" });
      if (!r.ok) return "ERR:" + r.status;
      const b = await r.blob();
      return new Promise(res => { const rd = new FileReader(); rd.onloadend = () => res(rd.result); rd.readAsDataURL(b); });
    } catch(e) { return "ERR:" + e.message; }
  }, url);
  if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
    fs.writeFileSync(path.join(pdfDir, "chinalife-kangning-huixiang.pdf"), Buffer.from(base64.split(",")[1], "base64"));
    console.log("OK chinalife-kangning-huixiang.pdf");
  } else {
    console.log("SKIP chinalife:", typeof base64 === "string" ? base64.substring(0, 80) : "?");
  }
} catch(e) { console.log("China Life error:", e.message?.substring(0, 80)); }

await browser.close();
console.log("\nDone");
