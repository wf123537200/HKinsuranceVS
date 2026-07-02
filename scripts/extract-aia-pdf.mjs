import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const pdfDir = path.join(process.cwd(), "public", "pdfs");

const aiaPdfs = [
  "aia-assemble-ci.pdf",
  "aia-cancer-care.pdf",
  "aia-cancer-guardian-3.pdf",
  "aia-essence-on-your-side.pdf",
  "aia-executive-care-pro-2.pdf",
  "aia-on-your-side-2.pdf",
  "aia-savings-leader.pdf",
  "aia-globalflexi-savings.pdf",
  "aia-wealth-flexi-savings.pdf",
];

for (const file of aiaPdfs) {
  const filePath = path.join(pdfDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`\n===== ${file} ===== FILE NOT FOUND`);
    continue;
  }
  console.log(`\n===== ${file} =====`);
  try {
    const buf = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buf, verbosity: 0 });
    const data = await parser.getText();
    const text = data.text || "";
    
    console.log(`Text length: ${text.length}`);
    console.log("--- TEXT START ---");
    console.log(text.substring(0, 6000));
    console.log("--- END (first 6000) ---");
    
    // Save full text
    const outPath = path.join(pdfDir, file.replace(".pdf", ".txt"));
    fs.writeFileSync(outPath, text, "utf-8");
    console.log(`Saved to ${outPath}`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}
