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

// Navigate to specific product pages and find brochure download links
const productPages = [
  // Prudential - specific product pages
  { company: "prudential", product: "ci-plan", url: "https://www.prudential.com.hk/zh/products/protection/pruactive-care" },
  { company: "prudential", product: "savings-plan", url: "https://www.prudential.com.hk/zh/products/savings/pruwealth" },
  // Manulife
  { company: "manulife", product: "ci-plus", url: "https://www.manulife.com.hk/zh-hk/individual/products/protection.html" },
  // AXA
  { company: "axa", product: "health-shield", url: "https://www.axa.com.hk/zh/health-insurance" },
  // FWD
  { company: "fwd", product: "ci-defender", url: "https://www.fwd.com.hk/zh/products/insurance/critical-illness" },
];

const results = [];

for (const { company, product, url } of productPages) {
  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(3000);

    // Get page content
    const content = await page.content();
    
    // Search for PDF URLs in page source
    const pdfMatches = content.match(/https?:\/\/[^"'\s<>]+\.pdf[^"'\s<>]*/gi) || [];
    const uniquePdfs = [...new Set(pdfMatches)];

    // Also search for brochure-related links
    const brochureLinks = await page.$$eval("a", (els) =>
      els
        .filter((el) => {
          const text = (el.textContent || "").toLowerCase();
          const href = (el.href || "").toLowerCase();
          return (
            text.includes("產品簡介") ||
            text.includes("产品简介") ||
            text.includes("brochure") ||
            text.includes("leaflet") ||
            text.includes("download") && href.includes("pdf") ||
            href.includes("brochure") ||
            href.includes("leaflet")
          );
        })
        .map((el) => ({
          href: el.href,
          text: (el.textContent || "").trim().substring(0, 120),
        }))
    );

    const allLinks = [
      ...uniquePdfs.map((u) => ({ href: u, text: "PDF from source", type: "source" })),
      ...brochureLinks.map((l) => ({ ...l, type: "link" })),
    ];

    const unique = [...new Map(allLinks.map((l) => [l.href, l])).values()];

    if (unique.length > 0) {
      console.log(company + "/" + product + ": Found " + unique.length + " items");
      for (const link of unique.slice(0, 5)) {
        console.log("  [" + link.type + "] " + link.text.substring(0, 60));
        console.log("  " + link.href.substring(0, 150));
        results.push({ company, product, url: link.href, text: link.text, type: link.type });
      }
    } else {
      // Search for any clickable elements that might lead to PDFs
      const buttons = await page.$$eval("button, [role='button'], a", (els) =>
        els
          .filter((el) => {
            const text = (el.textContent || "").toLowerCase();
            return (
              text.includes("download") ||
              text.includes("下載") ||
              text.includes("簡介") ||
              text.includes("brochure") ||
              text.includes("pdf")
            );
          })
          .map((el) => ({
            text: (el.textContent || "").trim().substring(0, 80),
            tag: el.tagName,
            href: el.getAttribute("href") || "",
          }))
          .slice(0, 5)
      );

      if (buttons.length > 0) {
        console.log(company + "/" + product + ": Found buttons:");
        for (const btn of buttons) {
          console.log("  [" + btn.tag + "] " + btn.text + " => " + btn.href);
        }
      } else {
        console.log(company + "/" + product + ": Nothing found on page");
      }
    }
    await page.close();
  } catch (e) {
    console.log(company + "/" + product + ": FAIL - " + e.message.split("\n")[0]);
  }
}

fs.writeFileSync(
  path.join(__dirname, "product-page-results.json"),
  JSON.stringify(results, null, 2)
);

await browser.close();
console.log("\nTotal: " + results.length + " items found");
