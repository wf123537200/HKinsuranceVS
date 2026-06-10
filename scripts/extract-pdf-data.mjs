import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, "..", "public", "pdfs");

const pdfs = [
  "pruwealth-dream-saver-en.pdf",
  "aia-savings-leader.pdf",
  "enlit-product-brochure-en.pdf",
  "evergreen-growth-saver-plus-ii-en.pdf",
  "fwd-stand-by-u.pdf",
  "fwd-aecono-life-20.pdf",
  "pingan-chuan-fu-3.pdf",
  "taikang-fangxin-caifu.pdf",
  "cpic-xin-xiang-ban.pdf",
  "prulife-protector-ii-en.pdf",
  "aia-ci-elite.pdf",
];

for (const pdfFile of pdfs) {
  const filePath = path.join(pdfDir, pdfFile);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP ${pdfFile}: file not found`);
    continue;
  }
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Extract key information
    const text = data.text;
    const lines = text.split("\n").filter(l => l.trim());
    
    console.log(`\n=== ${pdfFile} ===`);
    console.log(`Pages: ${data.numpages}`);
    console.log(`Text length: ${text.length} chars`);
    
    // Look for key terms
    const keywords = [
      "premium", "coverage", "entry age", "guaranteed", "non-guaranteed",
      "IRR", "cash value", "surrender", "death benefit", "dividend",
      "bonus", "terminal", "reversionary", "break-even", "maturity",
      "缴费", "保障", "保证", "非保证", "现金价值", "红利", "终期", "身故"
    ];
    
    const found = [];
    for (const kw of keywords) {
      const regex = new RegExp(kw, "gi");
      const matches = text.match(regex);
      if (matches) {
        found.push(`${kw}: ${matches.length} times`);
      }
    }
    console.log("Keywords found: " + found.join(", "));
    
    // Extract first 50 lines for overview
    console.log("\nFirst 30 lines:");
    lines.slice(0, 30).forEach(l => console.log("  " + l.substring(0, 120)));
    
  } catch (e) {
    console.log(`FAIL ${pdfFile}: ${e.message.split("\n")[0]}`);
  }
}
