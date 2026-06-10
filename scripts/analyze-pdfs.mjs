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

const pdfs = [
  { file: "pruwealth-dream-saver-en.pdf", product: "prudential-savings" },
  { file: "aia-savings-leader.pdf", product: "aia-savings" },
  { file: "enlit-product-brochure-en.pdf", product: "prudential-enlit" },
  { file: "fwd-stand-by-u.pdf", product: "fwd-ci" },
  { file: "fwd-aecono-life-20.pdf", product: "fwd-savings" },
  { file: "pingan-chuan-fu-3.pdf", product: "pingan-savings" },
  { file: "taikang-fangxin-caifu.pdf", product: "taikang-savings" },
  { file: "cpic-xin-xiang-ban.pdf", product: "cpic-savings" },
  { file: "prulife-protector-ii-en.pdf", product: "prudential-ci" },
  { file: "aia-ci-elite.pdf", product: "aia-ci" },
];

const results = [];

for (const { file, product } of pdfs) {
  try {
    const page = await context.newPage();
    const filePath = path.join(pdfDir, file);
    
    // Open the PDF file directly
    await page.goto(`file:///${filePath.replace(/\\/g, "/")}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Extract text content
    const textContent = await page.evaluate(() => {
      const body = document.body;
      return body ? body.innerText : "";
    });
    
    console.log(`\n=== ${file} ===`);
    console.log(`Text length: ${textContent.length} chars`);
    
    // Look for key product details
    const details = {};
    
    // Premium term patterns
    const premiumMatch = textContent.match(/premium\s*(?:term|period|payment)\s*:?\s*(\d+\s*(?:years?|months?))/i);
    if (premiumMatch) details.premiumTerm = premiumMatch[1];
    
    // Coverage term
    const coverageMatch = textContent.match(/(?:coverage|policy)\s*(?:term|period)\s*:?\s*(\d+\s*(?:years?|months?)|whole\s*life|lifetime)/i);
    if (coverageMatch) details.coverageTerm = coverageMatch[1];
    
    // Entry age
    const ageMatch = textContent.match(/(?:entry|issue)\s*age\s*:?\s*(\d+)\s*(?:to|-)\s*(\d+)/i);
    if (ageMatch) details.entryAge = `${ageMatch[1]}-${ageMatch[2]}`;
    
    // Guaranteed values
    const guaranteedMatch = textContent.match(/guaranteed\s*(?:cash\s*)?value\s*:?\s*(?:HKD|USD|CNY)?\s*(\d[\d,]*)/i);
    if (guaranteedMatch) details.guaranteedValue = guaranteedMatch[1];
    
    // Non-guaranteed
    const nonGuaranteedMatch = textContent.match(/non[\s-]*guaranteed\s*(?:bonus|dividend)\s*:?\s*(?:HKD|USD|CNY)?\s*(\d[\d,]*)/i);
    if (nonGuaranteedMatch) details.nonGuaranteedBonus = nonGuaranteedMatch[1];
    
    // IRR
    const irrMatch = textContent.match(/IRR\s*:?\s*(\d+\.?\d*)\s*%?/i);
    if (irrMatch) details.irr = irrMatch[1];
    
    // Death benefit
    const deathMatch = textContent.match(/death\s*benefit\s*:?\s*(?:HKD|USD|CNY)?\s*(\d[\d,]*)/i);
    if (deathMatch) details.deathBenefit = deathMatch[1];
    
    // Look for numbers near keywords
    const lines = textContent.split("\n");
    for (const line of lines) {
      if (/premium|缴费/.test(line) && /\d/.test(line)) {
        console.log(`  PREMIUM: ${line.substring(0, 120)}`);
      }
      if (/guaranteed|保证/.test(line) && /\d/.test(line)) {
        console.log(`  GUARANTEED: ${line.substring(0, 120)}`);
      }
      if (/IRR|内部收益/.test(line) && /\d/.test(line)) {
        console.log(`  IRR: ${line.substring(0, 120)}`);
      }
      if (/death|身故/.test(line) && /\d/.test(line)) {
        console.log(`  DEATH: ${line.substring(0, 120)}`);
      }
    }
    
    results.push({ file, product, details, textLength: textContent.length });
    
    await page.close();
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message.split("\n")[0]}`);
  }
}

await browser.close();

// Save results
fs.writeFileSync(
  path.join(__dirname, "pdf-analysis.json"),
  JSON.stringify(results, null, 2)
);
console.log("\nDone! Results saved to scripts/pdf-analysis.json");
