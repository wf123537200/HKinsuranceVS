// Save AIA PDFs from base64 data
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, "..", "public", "pdfs");

const pdfs = [
  { file: "aia-level-up-ci.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/level-up/Level-Up_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-multiple-care-pro-2.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/multiple-care-pro-2/MultipleCarePro2_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-on-your-side-2.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/on-your-side-plan-2/OnYourSideInsurancePlan2_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-simple-care-essence.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/simple-care-essence/SimpleCareEssence_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-smart-elite-ultra.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/smart-elite-ultra/SmartEliteUltra_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-super-healthguard-pro.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/super-healthguard-pro/SuperHealthGuardPro_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-cancer-guardian-3.pdf", url: "https://www.aia.com.hk/content/dam/hk/zh-hk/pdf/product-brochure/individuals/cancer-guardian-3/CancerGuardian3_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-globalflexi-savings.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/globalflexi-savings-insurance-plan/GlobalFlexiSavingsInsurancePlan_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-wealth-flexi-savings.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/wealth-flexi-savings-insurance-plan/WealthFlexiSavingsInsurancePlan_tc.pdf.coredownload.inline.pdf" },
  { file: "aia-wealth-generation.pdf", url: "https://www.aia.com.hk/content/dam/hk-wise/pdf/products/individuals/zh-hk/wealth-generation/WealthGeneration_tc.pdf.coredownload.inline.pdf" },
];

// This script will be used to save the downloaded PDFs
// The actual download happens via Playwright browser
console.log("PDF download URLs prepared. Use Playwright to download.");
console.log(`Total: ${pdfs.length} PDFs to download`);
