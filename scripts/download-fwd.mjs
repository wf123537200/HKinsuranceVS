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

// Visit FWD to get cookies
await page.goto("https://www.fwd.com.hk/zh/products/", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(3000);

const pdfs = [
  {
    file: "fwd-crisis-one-master.pdf",
    url: "https://www.fwd.com.hk/-/media/Files/FWDHK/pdf/protect/health-accident/critical-illness/crisis-onemaster-tc.pdf",
  },
  {
    file: "fwd-crisis-u-supporter.pdf",
    url: "https://www.fwd.com.hk/files/v3/assets/blta9d684affff23c8c/blt47e8f8c4841378b3/6555711e88cbda7c84857c14/FWD_Crisis_USupporter_(Kid_Starter)_TC_(2023_1009).pdf",
  },
  {
    file: "fwd-easycover-ci.pdf",
    url: "https://www.fwd.com.hk/files/v3/assets/blta9d684affff23c8c/blt564533bd832a18f9/63667eb8fd32d07c578df10d/fwd-easycover-tc.pdf",
  },
  {
    file: "fwd-maxfocus-legacy-ii.pdf",
    url: "https://www.fwd.com.hk/files/v3/assets/blta9d684affff23c8c/blte055dac56d3e42e6/MaxFocus_Legacy_II_Insurance_Plan_TC.pdf",
  },
  {
    file: "fwd-wealthicon-supreme-iii.pdf",
    url: "https://www.fwd.com.hk/-/media/documents/save/WealthICON-Supreme-III-pb-tc.pdf",
  },
  {
    file: "fwd-wealthicon-horizon.pdf",
    url: "https://www.fwd.com.hk/files/v3/assets/blta9d684affff23c8c/blt20c91c530498eb69/Wealth_ICON_Horizon_TC.pdf",
  },
];

let totalOk = 0;

for (const { file, url } of pdfs) {
  try {
    const base64 = await page.evaluate(async (pdfUrl) => {
      try {
        const resp = await fetch(pdfUrl, { credentials: "include" });
        if (!resp.ok) return "ERROR: HTTP " + resp.status;
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

    if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
      const buf = Buffer.from(base64.split(",")[1], "base64");
      fs.writeFileSync(path.join(pdfDir, file), buf);
      console.log(`OK ${file}: ${(buf.length / 1024).toFixed(1)} KB`);
      totalOk++;
    } else {
      console.log(`SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 80) : "unknown"}`);
    }
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
  }
}

await browser.close();
console.log(`\nDone: ${totalOk}/${pdfs.length} FWD PDFs downloaded`);
