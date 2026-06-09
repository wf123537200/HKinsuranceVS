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

// Strategy: visit each company's site, find brochure page, then download PDFs via JS fetch
const companies = [
  {
    name: "aia",
    brochurePage: "https://www.aia.com.hk/zh-hk/help-and-support/product-brochures-individuals",
    products: [
      { slug: "ci-elite", keywords: ["危疾", "critical illness", "healthguard"] },
      { slug: "savings-leader", keywords: ["環宇盈活", "globalflexi", "savings"] },
    ],
  },
  {
    name: "prudential",
    brochurePage: "https://www.prudential.com.hk/zh/claims-and-support/useful-forms-and-documents/product-brochures.html",
    products: [
      { slug: "ci-plan", keywords: ["危疾", "critical", "ci", "protection"] },
      { slug: "savings-plan", keywords: ["儲蓄", "savings", "wealth"] },
    ],
  },
  {
    name: "manulife",
    brochurePage: "https://www.manulife.com.hk/zh-hk/individual/help-and-support/forms-and-documents.html",
    products: [
      { slug: "ci-plus", keywords: ["危疾", "critical", "care"] },
      { slug: "savings", keywords: ["儲蓄", "savings"] },
    ],
  },
  {
    name: "axa",
    brochurePage: "https://www.axa.com.hk/zh/downloads",
    products: [
      { slug: "health-shield", keywords: ["危疾", "health", "critical"] },
      { slug: "wealth-builder", keywords: ["儲蓄", "savings", "wealth"] },
    ],
  },
  {
    name: "fwd",
    brochurePage: "https://www.fwd.com.hk/zh/downloads",
    products: [
      { slug: "ci-defender", keywords: ["危疾", "critical", "ci"] },
      { slug: "evergreen-savings", keywords: ["儲蓄", "savings"] },
    ],
  },
];

const results = [];

for (const company of companies) {
  try {
    const page = await browser.newPage();
    console.log("\n=== " + company.name.toUpperCase() + " ===");
    console.log("Visiting: " + company.brochurePage);
    
    await page.goto(company.brochurePage, {
      waitUntil: "domcontentloaded",
      timeout: 25000,
    });
    await page.waitForTimeout(3000);

    // Find all PDF links
    const pdfLinks = await page.$$eval("a", (els) =>
      els
        .filter((el) => {
          const href = (el.href || "").toLowerCase();
          return href.includes(".pdf");
        })
        .map((el) => ({
          href: el.href,
          text: (el.textContent || "").trim().substring(0, 150),
        }))
    );

    const unique = [...new Map(pdfLinks.map((l) => [l.href, l])).values()];
    console.log("Found " + unique.length + " PDF links");

    // Match PDFs to products
    for (const product of company.products) {
      const match = unique.find((l) => {
        const combined = (l.href + " " + l.text).toLowerCase();
        return product.keywords.some((kw) => combined.includes(kw.toLowerCase()));
      });

      if (match) {
        console.log("  " + product.slug + ": " + match.text.substring(0, 60));
        console.log("    URL: " + match.href.substring(0, 120));

        // Download via JS fetch
        try {
          const base64 = await page.evaluate(async (url) => {
            const resp = await fetch(url, { credentials: "include" });
            const blob = await resp.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          }, match.href);

          if (typeof base64 === "string" && base64.startsWith("data:application/pdf")) {
            const data = base64.split(",")[1];
            const buf = Buffer.from(data, "base64");
            const filePath = path.join(pdfDir, company.name + "-" + product.slug + ".pdf");
            fs.writeFileSync(filePath, buf);
            console.log("    Saved: " + buf.length + " bytes");
            results.push({ company: company.name, product: product.slug, file: path.basename(filePath), size: buf.length });
          } else {
            console.log("    Not a PDF response");
          }
        } catch (dlErr) {
          console.log("    Download fail: " + dlErr.message.split("\n")[0]);
        }
      } else {
        console.log("  " + product.slug + ": No matching PDF found");
      }
    }
    await page.close();
  } catch (e) {
    console.log(company.name + ": FAIL - " + e.message.split("\n")[0]);
  }
}

await browser.close();
console.log("\n=== RESULTS ===");
console.log("Downloaded " + results.length + " PDFs:");
for (const r of results) {
  console.log("  " + r.file + " (" + (r.size / 1024).toFixed(1) + " KB)");
}

fs.writeFileSync(
  path.join(__dirname, "downloaded-pdfs.json"),
  JSON.stringify(results, null, 2)
);
