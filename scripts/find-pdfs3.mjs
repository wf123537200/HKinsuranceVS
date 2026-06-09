import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Users\\12353\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe",
});

const searches = [
  // AIA - known product brochure pages
  { company: "aia", product: "ci-elite", url: "https://www.aia.com.hk/zh-hk/products/health/critical-illness/aia-wealth-elite-ci-plan" },
  { company: "aia", product: "savings-leader", url: "https://www.aia.com.hk/zh-hk/products/save/global-flexi" },
  // Prudential
  { company: "prudential", product: "ci-plan", url: "https://www.prudential.com.hk/zh/products/protection/pruactive-care" },
  { company: "prudential", product: "savings-plan", url: "https://www.prudential.com.hk/zh/products/savings/pruwealth" },
  // Manulife
  { company: "manulife", product: "ci-plus", url: "https://www.manulife.com.hk/zh-hk/individual/products/protection/critical-care-series/critical-care-plus.html" },
  // AXA
  { company: "axa", product: "health-shield", url: "https://www.axa.com.hk/zh/health-insurance" },
  // FWD
  { company: "fwd", product: "ci-defender", url: "https://www.fwd.com.hk/zh/products/insurance/critical-illness/" },
  // Mainland
  { company: "pingan", product: "ci-insurance", url: "https://baoxian.pingan.com/product/detail/shtml?id=1001" },
  { company: "cpic", product: "ci-guardian", url: "https://www.cpic.com.cn/xrsbx/chanpin/" },
  { company: "newchinalife", product: "ci", url: "https://www.newchinalife.com/spage/cn/productCenterCode/index.html" },
];

const results = [];

for (const { company, product, url } of searches) {
  try {
    const page = await browser.newPage();

    // Intercept requests to find PDF downloads
    const pdfUrls = [];
    page.on("response", (response) => {
      const u = response.url();
      if (u.includes(".pdf") || u.includes("brochure") || u.includes("leaflet")) {
        pdfUrls.push(u);
      }
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(3000);

    // Search page HTML for PDF URLs
    const html = await page.content();
    const pdfMatches = html.match(/https?:\/\/[^"'\s<>]+\.pdf[^"'\s<>]*/gi) || [];

    // Search for download buttons
    const downloadBtns = await page.$$eval('a, button', (els) =>
      els
        .filter((el) => {
          const text = (el.textContent || "").toLowerCase();
          const href = (el.getAttribute("href") || "").toLowerCase();
          return (
            text.includes("pdf") ||
            text.includes("产品简介") ||
            text.includes("download") ||
            text.includes("下载") ||
            text.includes("brochure") ||
            text.includes("leaflet") ||
            text.includes("说明书") ||
            href.includes(".pdf")
          );
        })
        .map((el) => ({
          text: (el.textContent || "").trim().substring(0, 80),
          href: el.getAttribute("href") || el.closest("a")?.href || "",
          tag: el.tagName,
        }))
    );

    const allPdfs = [...new Set([...pdfMatches, ...pdfUrls])];

    if (allPdfs.length > 0 || downloadBtns.length > 0) {
      console.log(company + "/" + product + ": Found " + allPdfs.length + " PDF URLs, " + downloadBtns.length + " download buttons");
      for (const u of allPdfs.slice(0, 5)) {
        console.log("  PDF: " + u.substring(0, 150));
        results.push({ company, product, url: u, type: "pdf-url" });
      }
      for (const btn of downloadBtns.slice(0, 5)) {
        console.log("  BTN: [" + btn.tag + "] " + btn.text + " => " + (btn.href || "no-href").substring(0, 120));
        if (btn.href && btn.href.includes(".pdf")) {
          results.push({ company, product, url: btn.href, type: "btn-pdf" });
        }
      }
    } else {
      console.log(company + "/" + product + ": No PDFs found");
    }
    await page.close();
  } catch (e) {
    console.log(company + "/" + product + ": FAIL - " + e.message.split("\n")[0]);
  }
}

fs.writeFileSync(
  path.join(__dirname, "pdf-results3.json"),
  JSON.stringify(results, null, 2)
);

await browser.close();
console.log("\nTotal: " + results.length + " PDFs");
