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

// Try downloading PDFs using page.evaluate with fetch
const pdfs = [
  // Prudential
  { file: "pruwealth-dream-saver-en.pdf", url: "https://www.prudential.com.hk/en/.galleries/pdf/brochure/pruwealth-dream-saver-product-brochure.pdf" },
  { file: "enlit-product-brochure-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/enlit-product-brochure.pdf" },
  { file: "evergreen-growth-saver-plus-ii-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/evergreen-growth-saver-plus-ii-product-brochure-en.pdf" },
  { file: "prulife-protector-ii-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/prulife-protector-ii-product-brochure.pdf" },
  { file: "pace-product-brochure-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/pace-product-brochure.pdf" },
  { file: "prime-eternity-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/prime-eternity-product-brochure.pdf" },
  
  // FWD
  { file: "fwd-stand-by-u.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/save/stand-by-u-savings-plan.pdf" },
  { file: "fwd-aecono-life-20.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/save/aecono-life-20.pdf" },
  { file: "fwd-noble-fortune.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/mcv/Noble-Fortune-Brochure.pdf" },
  
  // 新华保险
  { file: "nci-e-zeng-fu.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20260126/388334c3-c287-4c86-b0e2-beb14fd422cc.pdf" },
  { file: "nci-zhen-cang-shi-jia.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20260401/330e426b-344a-48f2-a401-70540c8ca925.pdf" },
  
  // 泰康
  { file: "taikang-fangxin-caifu.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2023/06/20/410b7b32-d222-493f-b8e0-5a4141b5bf4a.pdf" },
  
  // 太保
  { file: "cpic-xin-xiang-ban.pdf", url: "https://e.boc.cn/cmsimage/ezcms/public/89828199/8761120348232290.pdf" },
  
  // 平安
  { file: "pingan-chuan-fu-3.pdf", url: "https://www.hsbc.com.cn/content/dam/hsbc/cn/docs/insurance/ping-an-chuan-fu.pdf" },
];

// First, visit a page to get cookies
const page = await context.newPage();
await page.goto("https://www.prudential.com.hk", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2000);

const results = [];

for (const { file, url } of pdfs) {
  try {
    // Use page.evaluate to fetch the PDF with cookies
    const base64 = await page.evaluate(async (pdfUrl) => {
      try {
        const resp = await fetch(pdfUrl, { credentials: "include" });
        const contentType = resp.headers.get("content-type") || "";
        if (contentType.includes("pdf") || pdfUrl.endsWith(".pdf")) {
          const blob = await resp.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        }
        return "NOT_PDF: " + contentType;
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
      results.push({ file, size: buf.length, status: "ok" });
    } else {
      console.log(`SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 50) : "unknown"}`);
      results.push({ file, status: "skip" });
    }
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
    results.push({ file, status: "error" });
  }
}

await browser.close();

const ok = results.filter((r) => r.status === "ok");
console.log(`\nDone: ${ok.length}/${results.length} PDFs downloaded`);
