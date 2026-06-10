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

const domains = [
  { name: "FWD", homepage: "https://www.fwd.com.hk", pdfs: [
    { file: "fwd-stand-by-u.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/save/stand-by-u-savings-plan.pdf" },
    { file: "fwd-aecono-life-20.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/save/aecono-life-20.pdf" },
    { file: "fwd-noble-fortune.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/mcv/Noble-Fortune-Brochure.pdf" },
  ]},
  { name: "NCI", homepage: "https://www.newchinalife.com", pdfs: [
    { file: "nci-e-zeng-fu.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20260126/388334c3-c287-4c86-b0e2-beb14fd422cc.pdf" },
    { file: "nci-zhen-cang-shi-jia.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20260401/330e426b-344a-48f2-a401-70540c8ca925.pdf" },
  ]},
  { name: "Taikang", homepage: "https://m.taikanglife.com", pdfs: [
    { file: "taikang-fangxin-caifu.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2023/06/20/410b7b32-d222-493f-b8e0-5a4141b5bf4a.pdf" },
  ]},
  { name: "CPIC", homepage: "https://e.boc.cn", pdfs: [
    { file: "cpic-xin-xiang-ban.pdf", url: "https://e.boc.cn/cmsimage/ezcms/public/89828199/8761120348232290.pdf" },
  ]},
  { name: "PingAn", homepage: "https://www.hsbc.com.cn", pdfs: [
    { file: "pingan-chuan-fu-3.pdf", url: "https://www.hsbc.com.cn/content/dam/hsbc/cn/docs/insurance/ping-an-chuan-fu.pdf" },
  ]},
];

let totalOk = 0;

for (const domain of domains) {
  const page = await context.newPage();
  try {
    await page.goto(domain.homepage, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    console.log(`Visited ${domain.name} homepage`);
  } catch (e) {
    console.log(`Failed to visit ${domain.name}: ${e.message.split("\n")[0]}`);
  }

  for (const { file, url } of domain.pdfs) {
    try {
      const base64 = await page.evaluate(async (pdfUrl) => {
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
        console.log(`  OK ${file}: ${(buf.length / 1024).toFixed(1)} KB`);
        totalOk++;
      } else {
        console.log(`  SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 50) : "unknown"}`);
      }
    } catch (e) {
      console.log(`  FAIL ${file}: ${e.message.split("\n")[0]}`);
    }
  }
  await page.close();
}

await browser.close();
console.log(`\nDone: ${totalOk} more PDFs downloaded`);
