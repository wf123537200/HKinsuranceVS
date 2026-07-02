// scripts/retry-manulife.mjs
// Manulife 403 重试：完整浏览器头 + 可能需要先 GET dam 入口页拿 cookie
import https from "https";
import http from "http";
import { URL } from "url";
import fs from "fs";
import path from "path";

const url = "https://www.manulife.com.hk/content/dam/insurance/hk/zh-hk/documents/products/health/incomeguard-critical-illness-protector.pdf";
const targetDir = path.join(process.cwd(), "public", "pdfs-by-company", "manulife-hk");
const fileName = "incomeguard-critical-illness-protector.pdf";
const targetPath = path.join(targetDir, fileName);

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/pdf,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "zh-HK,zh;q=0.9,en;q=0.8",
  Referer: "https://www.manulife.com.hk/zh-hk/individual/products/health-protection.html",
  "Sec-Fetch-Site": "same-site",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Dest": "document",
};

function get(u, redirects = 5) {
  return new Promise((resolve, reject) => {
    const lib = u.startsWith("https") ? https : http;
    const req = lib.get(u, { headers }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && redirects > 0) {
        const loc = res.headers.location;
        if (!loc) return reject(new Error("no location"));
        res.resume();
        get(new URL(loc, u).toString(), redirects - 1).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(60000, () => req.destroy(new Error("timeout")));
  });
}

(async () => {
  try {
    process.stdout.write("重试 Manulife IncomeGuard PDF（带浏览器头）... ");
    const buf = await get(url);
    if (!buf.slice(0, 5).toString().includes("%PDF")) {
      console.log(`❌ 非 PDF: 前 200 字节 = ${buf.slice(0, 200).toString()}`);
      process.exit(1);
    }
    fs.writeFileSync(targetPath, buf);
    console.log(`✅ ${(buf.length / 1024).toFixed(1)} KB → ${path.relative(process.cwd(), targetPath)}`);
  } catch (e) {
    console.log(`❌ ${e.message}`);
    console.log("\n备选：手动 curl。命令：");
    console.log(
      `curl -L -A "Mozilla/5.0" -H "Referer: https://www.manulife.com.hk/" -o "${targetPath}" "${url}"`
    );
  }
})();
