// Try FWD individual product pages and Manulife
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

// Try FWD product pages - looking at noble fortune which we already have
console.log("=== FWD Noble Fortune ===");
try {
  await page.goto("https://www.fwd.com.hk/zh/products/savings/noble-fortune/", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const links = await page.evaluate(() => {
    const allLinks = document.querySelectorAll('a');
    return Array.from(allLinks)
      .filter(a => {
        const href = a.getAttribute('href') || '';
        const text = a.textContent?.toLowerCase() || '';
        return href.includes('.pdf') || href.includes('brochure') || href.includes('download') || text.includes('pdf') || text.includes('download') || text.includes('產品簡介');
      })
      .map(a => ({ text: a.textContent?.trim()?.substring(0, 60), href: a.getAttribute('href') }));
  });
  console.log(`FWD Noble Fortune: ${links.length} PDF links`);
  links.forEach(l => console.log(`  ${l.text}: ${l.href}`));
} catch (e) {
  console.log(`FWD error: ${e.message.split("\n")[0]}`);
}

// Try FWD other products
const fwdProducts = [
  "https://www.fwd.com.hk/zh/products/savings/evolife-savings-insurance-plan/",
  "https://www.fwd.com.hk/zh/products/protection/ci-first-shield/",
  "https://www.fwd.com.hk/zh/products/protection/fwd-carefree-ci-pro/",
  "https://www.fwd.com.hk/zh/products/protection/fwd-ci-first-shield-iii/",
];

for (const url of fwdProducts) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 12000 });
    await page.waitForTimeout(2000);
    const title = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim()?.substring(0, 60));
    const pdfs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*=".pdf"]')).map(l => ({
        text: l.textContent?.trim()?.substring(0, 50),
        href: l.getAttribute('href')
      }));
    });
    const slug = url.split('/').filter(Boolean).pop();
    if (pdfs.length > 0) {
      console.log(`\nFWD ${slug}: ${pdfs.length} PDFs`);
      pdfs.forEach(p => console.log(`  ${p.href}`));
    } else {
      console.log(`\nFWD ${slug}: 0 PDFs (${title})`);
    }
  } catch (e) {
    console.log(`\nFWD ${url.split('/').filter(Boolean).pop()}: error`);
  }
}

// Try Manulife product pages
console.log("\n=== Manulife ===");
const manProducts = [
  "https://www.manulife.com.hk/zh/individual/products/protection/critical-illness/manulife-guardian-ii.html",
  "https://www.manulife.com.hk/zh/individual/products/savings/wealth-architect.html",
  "https://www.manulife.com.hk/zh/individual/products/protection/life-insurance.html",
];

for (const url of manProducts) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 12000 });
    await page.waitForTimeout(2000);
    const pdfs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*=".pdf"]')).map(l => ({
        text: l.textContent?.trim()?.substring(0, 50),
        href: l.getAttribute('href')
      }));
    });
    const slug = url.split('/').filter(Boolean).pop();
    if (pdfs.length > 0) {
      console.log(`Manulife ${slug}: ${pdfs.length} PDFs`);
      pdfs.forEach(p => console.log(`  ${p.href}`));
    } else {
      console.log(`Manulife ${slug}: 0 PDFs`);
    }
  } catch (e) {
    console.log(`Manulife ${url.split('/').filter(Boolean).pop()}: error`);
  }
}

await browser.close();
