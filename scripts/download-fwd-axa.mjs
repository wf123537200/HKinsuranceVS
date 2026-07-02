// Try to find FWD and other companies' PDF brochure pages
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

// Try FWD product detail pages
console.log("=== FWD ===");
try {
  await page.goto("https://www.fwd.com.hk/zh/products/savings/", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const fwdLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    return Array.from(links)
      .filter(a => {
        const href = a.getAttribute('href') || '';
        const text = a.textContent?.toLowerCase() || '';
        return (href.includes('.pdf') || href.includes('brochure') || text.includes('brochure') || text.includes('產品簡介') || text.includes('download'));
      })
      .map(a => ({ text: a.textContent?.trim()?.substring(0, 60), href: a.getAttribute('href') }));
  });
  
  console.log(`FWD savings: ${fwdLinks.length} links`);
  fwdLinks.forEach(l => console.log(`  ${l.text}: ${l.href}`));
  
  // Also check for product detail pages
  const productLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/products/"]');
    return Array.from(links)
      .filter(a => !a.getAttribute('href')?.endsWith('/savings/') && !a.getAttribute('href')?.endsWith('/products/'))
      .map(a => ({ text: a.textContent?.trim()?.substring(0, 50), href: a.getAttribute('href') }))
      .filter(l => l.href?.includes('/savings/') || l.href?.includes('/protection/'));
  });
  
  console.log(`\nFWD product links: ${productLinks.length}`);
  const seen = new Set();
  for (const l of productLinks) {
    if (!seen.has(l.href)) {
      seen.add(l.href);
      console.log(`  ${l.text}: ${l.href}`);
    }
  }
} catch (e) {
  console.log(`FWD error: ${e.message.split("\n")[0]}`);
}

// Try AXA
console.log("\n=== AXA ===");
try {
  await page.goto("https://www.axa.com.hk/zh/products", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const axaLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    return Array.from(links)
      .filter(a => {
        const href = a.getAttribute('href') || '';
        return href.includes('.pdf') || href.includes('brochure');
      })
      .map(a => ({ text: a.textContent?.trim()?.substring(0, 60), href: a.getAttribute('href') }));
  });
  
  console.log(`AXA: ${axaLinks.length} PDF/brochure links`);
  axaLinks.slice(0, 10).forEach(l => console.log(`  ${l.text}: ${l.href}`));
} catch (e) {
  console.log(`AXA error: ${e.message.split("\n")[0]}`);
}

await browser.close();
