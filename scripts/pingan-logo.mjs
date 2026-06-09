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
await page.goto("https://en.wikipedia.org/wiki/Ping_An", {
  waitUntil: "domcontentloaded",
  timeout: 20000,
});
await page.waitForTimeout(2000);

// Try all possible selectors
const selectors = [
  ".infobox img",
  "table.infobox img",
  ".infobox-image img",
  "td.infobox-image img",
  ".mw-file-element",
  "img[src*='Ping_An']",
  "img[alt*='Ping An']",
  "img[alt*='logo']",
  "td img",
];

for (const sel of selectors) {
  const el = await page.$(sel);
  if (el) {
    const box = await el.boundingBox();
    const alt = await el.getAttribute("alt");
    const src = await el.getAttribute("src");
    console.log(sel + ": " + box?.width + "x" + box?.height + " alt='" + alt + "' src=" + src?.substring(0, 80));
  }
}

// Screenshot the infobox area
const infobox = await page.$(".infobox, table.infobox");
if (infobox) {
  const ssPath = path.join(logDir, "pingan.png");
  await infobox.screenshot({ path: ssPath });
  console.log("infobox: OK (" + fs.statSync(ssPath).size + " bytes)");
} else {
  // Take first image from the page
  const firstImg = await page.$("img.mw-file-element");
  if (firstImg) {
    const ssPath = path.join(logDir, "pingan.png");
    await firstImg.screenshot({ path: ssPath });
    console.log("first img: OK (" + fs.statSync(ssPath).size + " bytes)");
  }
}

await page.close();
await browser.close();
