import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
const pdfParse = new PDFParse({ verbosity: 0 });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, "..", "public", "pdfs");

// Process each PDF and extract key data
const pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith(".pdf"));

for (const file of pdfFiles) {
  const filePath = path.join(pdfDir, file);
  const buf = fs.readFileSync(filePath);
  
  try {
    const parser2 = new PDFParse({ data: buf, verbosity: 0 });
    const data = await parser2.getText();
    const text = data.text || "";
    
    // Extract key fields
    const result = { file, pages: data.numpages };
    
    // Look for common patterns
    const ageMatch = text.match(/投保年齡[^0-9]*(\d+)\s*[-至到]\s*(\d+)/i) || 
                     text.match(/entry\s*age[^0-9]*(\d+)\s*[-to]\s*(\d+)/i) ||
                     text.match(/(\d+)\s*[-至到]\s*(\d+)\s*歲/i);
    if (ageMatch) result.entryAge = `${ageMatch[1]}-${ageMatch[2]}`;
    
    const waitingMatch = text.match(/等待期[^0-9]*(\d+)\s*天/i) || 
                         text.match(/waiting\s*period[^0-9]*(\d+)/i) ||
                         text.match(/(\d+)\s*天等待期/);
    if (waitingMatch) result.waitingPeriod = waitingMatch[1];
    
    const coverageMatch = text.match(/保障期[^0-9]*(终身|lifetime|\d+年)/i) ||
                          text.match(/coverage\s*term[^a-zA-Z]*(lifetime|\d+\s*years?)/i);
    if (coverageMatch) result.coverageTerm = coverageMatch[1];
    
    const premiumMatch = text.match(/繳費期[^0-9]*(\d+)\s*年/i) ||
                         text.match(/premium\s*term[^0-9]*(\d+)\s*years?/i) ||
                         text.match(/(\d+)\s*年繳費期/);
    if (premiumMatch) result.premiumTerm = premiumMatch[1] + " years";
    
    // Count illness types
    const majorMatch = text.match(/(\d+)\s*種主要危疾/i) || text.match(/(\d+)\s*種嚴重疾病/i) ||
                       text.match(/(\d+)\s*major\s*illness/i) || text.match(/(\d+)\s*serious\s*disease/i);
    if (majorMatch) result.majorIllness = majorMatch[1];
    
    const minorMatch = text.match(/(\d+)\s*種早期/i) || text.match(/(\d+)\s*種輕度/i) ||
                       text.match(/(\d+)\s*minor/i) || text.match(/(\d+)\s*early/i);
    if (minorMatch) result.minorIllness = minorMatch[1];
    
    // IRR for savings
    const irrMatch = text.match(/IRR[^0-9]*(\d+\.?\d*)\s*%/i) || 
                     text.match(/內部回報率[^0-9]*(\d+\.?\d*)\s*%/i) ||
                     text.match(/(\d+\.?\d*)\s*%\s*p\.a\./i);
    if (irrMatch) result.irr = irrMatch[1] + "%";
    
    // Participating
    const partMatch = text.match(/分紅保單/i) || text.match(/participating/i) || text.match(/with\s*profits/i);
    if (partMatch) result.participating = true;
    
    // Cancer multiple claims
    const cancerMatch = text.match(/癌症.*多次/i) || text.match(/cancer.*multiple/i);
    if (cancerMatch) result.cancerMultiple = true;
    
    // Premium waiver
    const waiverMatch = text.match(/保費豁免/i) || text.match(/premium\s*waiver/i);
    if (waiverMatch) result.premiumWaiver = true;
    
    console.log(JSON.stringify(result));
  } catch (e) {
    console.log(JSON.stringify({ file, error: e.message?.substring(0, 80) }));
  }
}
