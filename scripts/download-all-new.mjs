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
  // Manulife (navigate to manulife.com.hk first)
  { file: "manulife-century-legacy.pdf", url: "https://www.manulife.com.hk/content/dam/insurance/hk/zh-hk/documents/products/save/manucentury.pdf", domain: "https://www.manulife.com.hk/zh/individual/products.html" },
  { file: "manulife-bright-care-2-plus.pdf", url: "https://www.manulife.com.hk/content/dam/insurance/hk/zh-hk/documents/products/health/manubright-care-2-plus.pdf", domain: "https://www.manulife.com.hk/zh/individual/products.html" },
  // Taikang (navigate to taikanglife.com first)
  { file: "taikang-zunxiang-shijia-zeng-e.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2024/07/15/54517176-3119-487d-8b26-05808d44293a.pdf", domain: "https://m.taikanglife.com/" },
  { file: "taikang-zunxiang-shijia-flagship.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2024/01/22/3260f1aa-c54e-4b02-a1ea-da5c17f1c86e.pdf", domain: "https://m.taikanglife.com/" },
  { file: "taikang-lexiangjiankang-2026.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2025/09/12/ff1fff61-1fbe-4790-b560-d48fb581a55a.pdf", domain: "https://m.taikanglife.com/" },
  { file: "taikang-lexiangjiankang-kids.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2024/09/11/fcd8bcaf-e763-42fa-b07c-8a7ec8aa21d7.pdf", domain: "https://m.taikanglife.com/" },
  // CPIC
  { file: "cpic-xiangbanzhizun-2024s.pdf", url: "https://www.cpic.com.cn/upload/resources/file/2025/01/24/85389.pdf", domain: "https://www.cpic.com.cn/" },
  { file: "cpic-jinshengwuyou-kids.pdf", url: "https://www.cpic.com.cn/upload/resources/file/2024/09/10/82230.pdf", domain: "https://www.cpic.com.cn/" },
  { file: "cpic-wenyingjinsheng-ci.pdf", url: "https://www.cpic.com.cn/upload/resources/file/2024/06/28/81328.pdf", domain: "https://www.cpic.com.cn/" },
  // Ping An
  { file: "pingan-shengshi-jinyue-zunxiang.pdf", url: "https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1682&versionNo=1682-1", domain: "https://life.pingan.com/" },
  { file: "pingan-ruyi-quanneng-2025-ci.pdf", url: "https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1770&versionNo=1770-1", domain: "https://life.pingan.com/" },
  { file: "pingan-ruyi-quanneng-2025-main.pdf", url: "https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1769&versionNo=1769-1", domain: "https://life.pingan.com/" },
  // New China Life
  { file: "newchinalife-rongyao-xinxiang.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20231018/8c7b99e9-2ea2-4eb3-9e95-e6650109e0ff.pdf", domain: "https://www.newchinalife.com/" },
  { file: "newchinalife-rongyao-shijia.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20230630/4be4672d-ab96-413e-8ef4-81a810052b1d.pdf", domain: "https://www.newchinalife.com/" },
  { file: "newchinalife-jiankangwuyou-zhuoyue.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20250909/07f399c0-8501-4489-8312-05e3d9b1fcc3.pdf", domain: "https://www.newchinalife.com/" },
  // China Life
  { file: "chinalife-kangning-huixiang.pdf", url: "https://www.e-chinalife.com/upload/resources/file/productBasicInfo/de0e9ce6317c43c6b6b9bff63da495d0/300_\u56fd\u5bff\u5eb7\u5b81\u7ec8\u8eab\u91cd\u5927\u75be\u75c5\u4fdd\u9669\uff08\u60e0\u4eab\u7248\uff09\u4ea7\u54c1\u8bf4\u660e\u4e66.pdf", domain: "https://www.e-chinalife.com/" },
];

let totalOk = 0;
let lastDomain = "";

for (const { file, url, domain } of pdfs) {
  try {
    // Navigate to domain first if different from last
    if (domain !== lastDomain) {
      console.log(`Visiting ${domain}...`);
      await page.goto(domain, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(2000);
      lastDomain = domain;
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
