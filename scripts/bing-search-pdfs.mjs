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

// Use Bing to search for product brochure PDFs
const queries = [
  { company: "prudential", product: "ci-plan", query: "保誠 危疾 產品簡介 PDF site:prudential.com.hk" },
  { company: "prudential", product: "savings-plan", query: "保誠 儲蓄 產品簡介 PDF site:prudential.com.hk" },
  { company: "manulife", product: "ci-plus", query: "宏利 危疾 產品簡介 PDF site:manulife.com.hk" },
  { company: "manulife", product: "savings", query: "宏利 儲蓄 產品簡介 PDF site:manulife.com.hk" },
  { company: "axa", product: "health-shield", query: "AXA 安盛 危疾 產品簡介 PDF site:axa.com.hk" },
  { company: "fwd", product: "ci-defender", query: "富衛 危疾 產品簡介 PDF site:fwd.com.hk" },
  { company: "pingan", product: "ci-insurance", query: "平安保险 重疾险 产品说明书 PDF" },
  { company: "chinalife", product: "ci-coverage", query: "中国人寿 重疾险 产品说明书 PDF" },
  { company: "taikang", product: "ci-plus", query: "泰康人寿 重疾险 产品说明书 PDF" },
  { company: "cpic", product: "ci-guardian", query: "太平洋保险 重疾险 产品说明书 PDF" },
  { company: "newchinalife", product: "ci", query: "新华保险 重疾险 产品说明书 PDF" },
];

const results = [];

for (const { company, product, query } of queries) {
  try {
    const page = await context.newPage();
    const searchUrl = "https://www.bing.com/search?q=" + encodeURIComponent(query);
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Find PDF links in search results
    const links = await page.$$eval("a", (els) =>
      els
        .filter((el) => {
          const href = (el.href || "").toLowerCase();
          return href.includes(".pdf") && !href.includes("bing.com");
        })
        .map((el) => ({
          href: el.href,
          text: (el.textContent || "").trim().substring(0, 150),
        }))
    );

    const unique = [...new Map(links.map((l) => [l.href, l])).values()];

    if (unique.length > 0) {
      console.log(company + "/" + product + ": Found " + unique.length + " PDFs");
      for (const link of unique.slice(0, 3)) {
        console.log("  " + link.text.substring(0, 60));
        console.log("  " + link.href.substring(0, 150));
        results.push({ company, product, url: link.href, text: link.text });
      }
    } else {
      // Try to find links to product pages that might have PDFs
      const pageLinks = await page.$$eval("a", (els) =>
        els
          .filter((el) => {
            const href = (el.href || "").toLowerCase();
            const text = (el.textContent || "").toLowerCase();
            return (
              (href.includes("prudential") || href.includes("manulife") || 
               href.includes("axa") || href.includes("fwd") ||
               href.includes("pingan") || href.includes("chinalife") ||
               href.includes("taikang") || href.includes("cpic") ||
               href.includes("newchinalife")) &&
              !href.includes("bing.com") &&
              href.length > 20
            );
          })
          .map((el) => ({
            href: el.href,
            text: (el.textContent || "").trim().substring(0, 150),
          }))
          .slice(0, 3)
      );
      
      if (pageLinks.length > 0) {
        console.log(company + "/" + product + ": No PDFs, but found pages:");
        for (const link of pageLinks) {
          console.log("  " + link.text.substring(0, 60) + " => " + link.href.substring(0, 120));
        }
      } else {
        console.log(company + "/" + product + ": Nothing found");
      }
    }
    await page.close();
  } catch (e) {
    console.log(company + "/" + product + ": FAIL - " + e.message.split("\n")[0]);
  }
}

fs.writeFileSync(
  path.join(__dirname, "bing-search-results.json"),
  JSON.stringify(results, null, 2)
);

await browser.close();
console.log("\nTotal PDFs: " + results.length);
