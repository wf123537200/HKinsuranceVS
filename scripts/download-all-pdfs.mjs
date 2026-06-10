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

// All PDF links from the brochure list
const pdfs = [
  // Prudential 保诚
  { file: "pruwealth-dream-saver-en.pdf", url: "https://www.prudential.com.hk/en/.galleries/pdf/brochure/pruwealth-dream-saver-product-brochure.pdf" },
  { file: "pruwealth-dream-saver-tc.pdf", url: "https://www.prudential.com.hk/tc/.galleries/pdf/brochure/pruwealth-dream-saver-product-brochure.pdf" },
  { file: "pru-save-5-year-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/p5s-scb-brochure.pdf" },
  { file: "enlit-product-brochure-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/enlit-product-brochure.pdf" },
  { file: "enlit-product-brochure-tc.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/tc/brochure/enlit-product-brochure.pdf" },
  { file: "evergreen-growth-saver-plus-ii-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/evergreen-growth-saver-plus-ii-product-brochure-en.pdf" },
  { file: "prulife-protector-ii-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/prulife-protector-ii-product-brochure.pdf" },
  { file: "pace-product-brochure-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/pace-product-brochure.pdf" },
  { file: "prime-eternity-en.pdf", url: "https://www.prudential.com.hk/content/dam/prudential-phkl/pdf/en/brochure/prime-eternity-product-brochure.pdf" },
  { file: "pruuniversal-life-wealth-planner-en.pdf", url: "https://www.prudential.com.hk/en/.galleries/pdf/brochure/pruuniversal-life-wealth-planner-product-brochure.pdf" },
  
  // FWD 富卫
  { file: "fwd-stand-by-u.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/save/stand-by-u-savings-plan.pdf" },
  { file: "fwd-aecono-life-20.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/save/aecono-life-20.pdf" },
  { file: "fwd-noble-fortune.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/mcv/Noble-Fortune-Brochure.pdf" },
  { file: "fwd-journey-deferred-annuity-en.pdf", url: "https://www.fwd.com.hk/-/media/documents/corpsite/save/journey-deferred-annuity-plan-en.pdf" },
  
  // 新华保险
  { file: "nci-e-zeng-fu.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20260126/388334c3-c287-4c86-b0e2-beb14fd422cc.pdf" },
  { file: "nci-zhen-cang-shi-jia.pdf", url: "https://static-cdn.newchinalife.com/ncl/pdf/20260401/330e426b-344a-48f2-a401-70540c8ca925.pdf" },
  
  // 泰康人寿
  { file: "taikang-fangxin-caifu.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2023/06/20/410b7b32-d222-493f-b8e0-5a4141b5bf4a.pdf" },
  { file: "taikang-jiankang-rensheng.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2023/06/20/44386cdd-367c-41ce-ab3e-ef016f8a4165.pdf" },
  { file: "taikang-shiji-changle-b.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2023/06/20/9ec62ca8-cdd1-4215-b06b-9a7f9b97ce92.pdf" },
  { file: "taikang-zhihui-caifu.pdf", url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2023/06/20/c02e17db-a4a2-40c5-bd57-13f930d8a939.pdf" },
  
  // 太保
  { file: "cpic-xin-xiang-ban.pdf", url: "https://e.boc.cn/cmsimage/ezcms/public/89828199/8761120348232290.pdf" },
  { file: "cpic-xin-guanjia-a.pdf", url: "https://download.cib.com.cn/netbank/download/cn/bxtk/0047EL6211_bxtk.pdf" },
  { file: "cpic-chang-xiang-ban-a.pdf", url: "https://pic.bankofchina.com/bocappd/agreement/201901/P020190115499969358921.pdf" },
  
  // 中国人寿
  { file: "cl-yuman-chuxu.pdf", url: "https://www.chinalife.com.sg/sites/default/files/product/%E4%B8%AD%E5%9B%BD%E4%BA%BA%E5%AF%BF%E8%A3%95%E6%BB%A1%E5%82%A8%E8%93%84%E4%BF%9D%E9%99%A9%E8%AE%A1%E5%88%92%E5%AE%A3%E4%BC%A0%E6%89%8B%E5%86%8C_2.pdf" },
  { file: "cl-zuanyi-chuancheng.pdf", url: "https://www.hk.abchina.com/cn/wealthmanage/201906/W020240103373422588847.pdf" },
  
  // 平安
  { file: "pingan-chuan-fu-3.pdf", url: "https://www.hsbc.com.cn/content/dam/hsbc/cn/docs/insurance/ping-an-chuan-fu.pdf" },
];

const results = [];

for (const { file, url } of pdfs) {
  try {
    const page = await context.newPage();
    const response = await page.goto(url, { waitUntil: "commit", timeout: 30000 });
    if (response) {
      const body = await response.body();
      const header = body.slice(0, 10).toString();
      if (header.startsWith("%PDF")) {
        const filePath = path.join(pdfDir, file);
        fs.writeFileSync(filePath, body);
        console.log(`OK ${file}: ${(body.length / 1024).toFixed(1)} KB`);
        results.push({ file, size: body.length, status: "ok" });
      } else {
        console.log(`SKIP ${file}: not a PDF (header: ${header.substring(0, 20)})`);
        results.push({ file, status: "not-pdf" });
      }
    }
    await page.close();
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
    results.push({ file, status: "error" });
  }
}

await browser.close();

const ok = results.filter((r) => r.status === "ok");
console.log(`\nDone: ${ok.length}/${results.length} PDFs downloaded`);
