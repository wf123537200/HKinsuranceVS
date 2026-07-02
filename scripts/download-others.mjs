// Download remaining PDFs: Prudential medical + FWD + other companies
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

// Visit Prudential first
await page.goto("https://www.prudential.com.hk/tc/products/health/", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(3000);

const base = "https://www.prudential.com.hk";

// Prudential health page PDFs (medical, accident, etc.)
const pruHealthPdfs = [
  { file: "pru-cancer-recover.pdf", url: base + "/content/dam/prudential-phkl/pdf/tc/brochure/pruhealth-cancer-recover-product-brochure.pdf.coredownload.inline.pdf" },
  { file: "pru-lady-care.pdf", url: base + "/content/dam/prudential-phkl/pdf/tc/brochure/pruhealth-lady-care-product-brochure.pdf.coredownload.inline.pdf" },
  { file: "pru-myhealth-cancer-protector.pdf", url: base + "/content/dam/prudential-phkl/pdf/tc/brochure/prumyhealth-cancer-protector-product-brochure.pdf.coredownload.inline.pdf" },
  { file: "pru-long-term-care.pdf", url: base + "/content/dam/prudential-phkl/pdf/tc/brochure/long-term-care-benefit-product-brochure.pdf.coredownload.inline.pdf" },
];

let totalOk = 0;

for (const { file, url } of pruHealthPdfs) {
  const filePath = path.join(pdfDir, file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    console.log(`SKIP ${file}: already exists`);
    totalOk++;
    continue;
  }
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
      } catch (e) { return "ERROR: " + e.message; }
    }, url);
    if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
      const buf = Buffer.from(base64.split(",")[1], "base64");
      fs.writeFileSync(filePath, buf);
      console.log(`OK ${file}: ${(buf.length / 1024).toFixed(1)} KB`);
      totalOk++;
    } else {
      console.log(`SKIP ${file}: ${typeof base64 === "string" ? base64.substring(0, 60) : "unknown"}`);
    }
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
  }
}

// Now try FWD
console.log("\n--- FWD ---");
try {
  await page.goto("https://www.fwd.com.hk/zh/products/", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const fwdPdfs = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*=".pdf"]');
    return Array.from(links).map(l => ({
      text: l.textContent?.trim()?.substring(0, 50),
      href: l.getAttribute('href')
    }));
  });
  
  console.log(`FWD: Found ${fwdPdfs.length} PDF links`);
  for (const p of fwdPdfs.slice(0, 10)) {
    console.log(`  ${p.text}: ${p.href}`);
  }
} catch (e) {
  console.log(`FWD page error: ${e.message.split("\n")[0]}`);
}

// Try Manulife
console.log("\n--- Manulife ---");
try {
  await page.goto("https://www.manulife.com.hk/zh/individual/products.html", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const manPdfs = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*=".pdf"]');
    return Array.from(links).map(l => ({
      text: l.textContent?.trim()?.substring(0, 50),
      href: l.getAttribute('href')
    }));
  });
  
  console.log(`Manulife: Found ${manPdfs.length} PDF links`);
  for (const p of manPdfs.slice(0, 10)) {
    console.log(`  ${p.text}: ${p.href}`);
  }
} catch (e) {
  console.log(`Manulife page error: ${e.message.split("\n")[0]}`);
}

await browser.close();
console.log(`\nDone: ${totalOk} Prudential health PDFs downloaded`);
