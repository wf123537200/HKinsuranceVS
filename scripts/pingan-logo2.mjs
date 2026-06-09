import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "public", "logos");

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Users\\12353\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe",
});

const page = await browser.newPage();
await page.goto("https://en.wikipedia.org/wiki/Ping_An_Insurance", {
  waitUntil: "domcontentloaded",
  timeout: 20000,
});
await page.waitForTimeout(2000);

const selectors = [
  ".infobox img",
  "table.infobox img",
  ".infobox-image img",
  "td.infobox-image img",
];

let found = false;
for (const sel of selectors) {
  const el = await page.$(sel);
  if (el) {
    const box = await el.boundingBox();
    if (box && box.width > 30 && box.height > 30) {
      const ssPath = path.join(logDir, "pingan.png");
      await el.screenshot({ path: ssPath });
      console.log("pingan: OK (" + fs.statSync(ssPath).size + " bytes) [" + sel + "]");
      found = true;
      break;
    }
  }
}

if (!found) {
  console.log("pingan: SKIP - trying infobox screenshot");
  const infobox = await page.$(".infobox, table.infobox");
  if (infobox) {
    const ssPath = path.join(logDir, "pingan.png");
    await infobox.screenshot({ path: ssPath });
    console.log("pingan infobox: OK (" + fs.statSync(ssPath).size + " bytes)");
  }
}

await page.close();
await browser.close();
