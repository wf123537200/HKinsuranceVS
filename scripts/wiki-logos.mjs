import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "public", "logos");

const companies = [
  { name: "prudential", url: "https://en.wikipedia.org/wiki/Prudential_plc" },
  { name: "aia", url: "https://en.wikipedia.org/wiki/AIA_Group" },
  { name: "manulife", url: "https://en.wikipedia.org/wiki/Manulife" },
  { name: "axa", url: "https://en.wikipedia.org/wiki/Axa" },
  { name: "fwd", url: "https://en.wikipedia.org/wiki/FWD_Group" },
  { name: "pingan", url: "https://en.wikipedia.org/wiki/Ping_An" },
  { name: "chinalife", url: "https://en.wikipedia.org/wiki/China_Life_Insurance" },
  { name: "taikang", url: "https://en.wikipedia.org/wiki/Taikang_Life_Insurance" },
  { name: "cpic", url: "https://en.wikipedia.org/wiki/China_Pacific_Insurance" },
  { name: "newchinalife", url: "https://en.wikipedia.org/wiki/New_China_Life_Insurance" },
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
    await page.waitForTimeout(2000);

    // Wikipedia infobox logo: usually the first image in .infobox
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
          const ssPath = path.join(logDir, name + ".png");
          await el.screenshot({ path: ssPath });
          const size = fs.statSync(ssPath).size;
          console.log(name + ": OK (" + size + " bytes) [" + sel + "]");
          found = true;
          break;
        }
      }
    }

    if (!found) {
      console.log(name + ": SKIP - no infobox logo found");
    }
    await page.close();
  } catch (e) {
    console.log(name + ": FAIL - " + e.message.split("\n")[0]);
  }
}

await browser.close();
console.log("Done!");
