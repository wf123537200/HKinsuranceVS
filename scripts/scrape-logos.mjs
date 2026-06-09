import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "public", "logos");

const companies = [
  { name: "prudential", url: "https://www.prudential.com.hk", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "aia", url: "https://www.aia.com.hk", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "manulife", url: "https://www.manulife.com.hk", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "axa", url: "https://www.axa.com.hk", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "fwd", url: "https://www.fwd.com.hk", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "pingan", url: "https://www.pingan.com", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "chinalife", url: "https://www.chinalife.com.cn", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "taikang", url: "https://www.taikang.com", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "cpic", url: "https://www.cpic.com.cn", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
  { name: "newchinalife", url: "https://www.newchinalife.com", selector: "img[src*='logo'], header img, .logo img, [class*='logo'] img, svg[class*='logo'], [aria-label*='logo']" },
];

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Users\\12353\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe",
});

for (const { name, url, selector } of companies) {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    // Try to find logo element
    const logoEl = await page.$(selector);
    if (logoEl) {
      const ssPath = path.join(logDir, name + ".png");
      await logoEl.screenshot({ path: ssPath });
      const size = fs.statSync(ssPath).size;
      console.log(name + ": OK (" + size + " bytes) [element]");
    } else {
      // Fallback: screenshot the header area
      const header = await page.$("header, nav, [class*='header'], [class*='nav']");
      if (header) {
        const ssPath = path.join(logDir, name + ".png");
        await header.screenshot({ path: ssPath });
        const size = fs.statSync(ssPath).size;
        console.log(name + ": OK (" + size + " bytes) [header]");
      } else {
        console.log(name + ": SKIP - no logo found");
      }
    }
    await page.close();
  } catch (e) {
    console.log(name + ": FAIL - " + e.message.split("\n")[0]);
  }
}

await browser.close();
console.log("Done!");
