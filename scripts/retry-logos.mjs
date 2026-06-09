import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "public", "logos");

const companies = [
  { name: "manulife", url: "https://www.manulife.com.hk" },
  { name: "chinalife", url: "https://www.chinalife.com.cn" },
  { name: "cpic", url: "https://www.cpic.com.cn" },
];

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Users\\12353\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe",
});

for (const { name, url } of companies) {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(3000);

    // Try multiple selectors for logo
    const selectors = [
      'img[alt*="logo" i]',
      'img[src*="logo" i]',
      'img[class*="logo" i]',
      'a[href="/"] img',
      "header img:first-of-type",
      "nav img:first-of-type",
      '[class*="logo"] img',
      '[class*="header"] img:first-of-type',
      "header svg:first-of-type",
      '[class*="logo"] svg',
    ];

    let found = false;
    for (const sel of selectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          const box = await el.boundingBox();
          if (box && box.width > 20 && box.height > 20) {
            const ssPath = path.join(logDir, name + ".png");
            await el.screenshot({ path: ssPath });
            const size = fs.statSync(ssPath).size;
            if (size > 500) {
              console.log(name + ": OK (" + size + " bytes) [" + sel + "]");
              found = true;
              break;
            }
          }
        }
      } catch {}
    }

    if (!found) {
      // Fallback: screenshot the header/nav area
      const header = await page.$(
        "header, nav, [class*='header'], [class*='nav-bar']"
      );
      if (header) {
        const ssPath = path.join(logDir, name + ".png");
        await header.screenshot({ path: ssPath });
        const size = fs.statSync(ssPath).size;
        console.log(name + ": OK (" + size + " bytes) [header fallback]");
      } else {
        console.log(name + ": SKIP - nothing found");
      }
    }

    await page.close();
  } catch (e) {
    console.log(name + ": FAIL - " + e.message.split("\n")[0]);
  }
}

await browser.close();
console.log("Done!");
