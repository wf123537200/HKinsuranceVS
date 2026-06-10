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

// First visit AIA to get cookies
const aiaPage = await context.newPage();
await aiaPage.goto("https://www.aia.com.hk", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {});
await aiaPage.waitForTimeout(2000);

// AIA CI PDFs
const aiaPdfs = [
  { file: "aia-assemble-ci.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/aia-assemble/AIAAssemble_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-cancer-care.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/cancer-care-essence/CancerCareEssence_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-easyguard-ci.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/easyguard-care-essence/EasyguardCareEssence_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-executive-care-pro-2.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/executive-care-pro-2/ExecutiveCarePro2_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-lady-care-pro.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/lady-care-pro/LadyCarePro_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-essence-on-your-side.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/essence-on-your-side/EssenceOnYourSideInsurancePlan_tc.pdf.coredownload.inline.pdf" },
];

// Visit AXA to get cookies
const axaPage = await context.newPage();
await axaPage.goto("https://www.axa.com.hk", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {});
await axaPage.waitForTimeout(2000);

// AXA savings PDFs
const axaPdfs = [
  { file: "axa-wealth-ultra-savings.pdf", url: "https://hk-axa-web-2020.cdn.axa-contento-118412.eu/hk-axa-web-2020/3036f746-f13f-4c81-b190-8d7e9d68cd8b_LPPM+794-RDC+WealthUltraSavingsPlan_tc.pdf" },
  { file: "axa-wealth-ultra-savings-leaflet.pdf", url: "https://hk-axa-web-2020.cdn.axa-contento-118412.eu/hk-axa-web-2020/66d6431f-4b55-4b30-9ca6-98871e53acdc_LPPM+795-RDC+WealthUltraSavingsPlanLeaflet_tc.pdf" },
];

let totalOk = 0;

// Download AIA PDFs
for (const { file, url } of aiaPdfs) {
  try {
    const base64 = await aiaPage.evaluate(async (pdfUrl) => {
      try {
        const resp = await fetch(pdfUrl, { credentials: "include" });
        const ct = resp.headers.get("content-type") || "";
        if (ct.includes("pdf") || pdfUrl.endsWith(".pdf")) {
          const blob = await resp.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        }
        return "NOT_PDF: " + ct;
      } catch (e) {
        return "ERROR: " + e.message;
      }
    }, url);

    if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
      const data = base64.split(",")[1];
      const buf = Buffer.from(data, "base64");
      fs.writeFileSync(path.join(pdfDir, file), buf);
      console.log(`OK ${file}: ${(buf.length / 1024).toFixed(1)} KB`);
      totalOk++;
    } else {
      console.log(`SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 50) : "unknown"}`);
    }
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
  }
}

// Download AXA PDFs
for (const { file, url } of axaPdfs) {
  try {
    const base64 = await axaPage.evaluate(async (pdfUrl) => {
      try {
        const resp = await fetch(pdfUrl, { credentials: "include" });
        const ct = resp.headers.get("content-type") || "";
        if (ct.includes("pdf") || pdfUrl.endsWith(".pdf")) {
          const blob = await resp.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        }
        return "NOT_PDF: " + ct;
      } catch (e) {
        return "ERROR: " + e.message;
      }
    }, url);

    if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
      const data = base64.split(",")[1];
      const buf = Buffer.from(data, "base64");
      fs.writeFileSync(path.join(pdfDir, file), buf);
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
