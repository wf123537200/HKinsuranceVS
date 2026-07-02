// scripts/download-selected-pdfs.mjs
// 下载 selected 25 个产品中缺失的 PDF，归档到 public/pdfs-by-company/{公司}/
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { URL } from "url";

const root = process.cwd();
const tmpDir = path.join(root, ".tmp-pdf-downloads");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

// 公司 slug 映射：selected 用的 slug → pdfs-by-company/ 下的目录名
const slugMap = {
  "aia-hk": "aia-hk",
  "prudential-hk": "prudential-hk",
  "manulife-hk": "manulife-hk",
  "fwd-hk": "fwd-hk",
  "axa-hk": "axa-hk",
  "pingan": "ping-an",
  "cpic": "cpic-life",
  "taikang": "taikang-life",
  "new-china-life": "new-china-life",
};

// 下载任务清单（标准化产品名 + 官方 PDF 链接）
const tasks = [
  // ===== 宏利 HK =====
  {
    company: "manulife-hk",
    product: "宏健守护危疾入息保障 / IncomeGuard Critical Illness Protector",
    url: "https://www.manulife.com.hk/content/dam/insurance/hk/zh-hk/documents/products/health/incomeguard-critical-illness-protector.pdf",
    file: "incomeguard-critical-illness-protector.pdf",
  },

  // ===== 安盛 HK =====
  {
    company: "axa-hk",
    product: "爱唯守危疾保障（升级版）/ TotalAssure Plus Critical Illness Plan",
    url: "https://www.axa.com.hk/total-assure-plus-critical-illness-pb-zh",
    file: "axa-total-assure-plus-ci.pdf",
  },
  {
    company: "axa-hk",
    product: "盛利 II 储蓄保险 – 至尊（2年缴）/ WealthAhead II Savings Insurance - Supreme 2 Pay",
    url: "https://www.axa.com.hk/wealth-ahead-ii-savings-insurance-2-pay-product-brochure-supreme-zh",
    file: "axa-wealth-ahead-ii-supreme-2pay.pdf",
  },

  // ===== 平安 大陆 =====
  {
    company: "pingan",
    product: "平安福20重大疾病保险（历史产品 PDF 镜像）",
    url: "https://file.shenlanbao.com/2020/03/26/120032616035448801.pdf",
    file: "pingan-fuli-20-ci.pdf",
  },
  {
    company: "pingan",
    product: "平安附加如意全能（2025）提前给付重大疾病保险",
    url: "https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1770&versionNo=1770-1",
    file: "pingan-ruyi-quanneng-2025-ci.pdf",
  },
  {
    company: "pingan",
    product: "平安盛世金越（尊享版26Ⅱ）终身寿险（分红型）",
    url: "https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1846&versionNo=1846-1",
    file: "pingan-shengshi-jinyue-zunxiang-26II.pdf",
  },
  {
    company: "pingan",
    product: "平安御享金越（2025）终身寿险（分红型）",
    url: "https://life.pingan.com/ilife-home/product/getPlanClausePdf?attachmentType=7&planCode=1790&versionNo=1790-1",
    file: "pingan-yuxiang-jinyue-2025.pdf",
  },

  // ===== 太保 大陆 =====
  {
    company: "cpic",
    product: "太保金生无忧2024（少儿版）重大疾病保险",
    url: "https://www.cpic.com.cn/upload/resources/file/2024/09/10/82230.pdf",
    file: "cpic-jinshengwuyou-2024-kids.pdf",
  },
  // 长相伴（至尊2024S）本地已有 cpic-xiangbanzhizun-2024s.pdf，不再重复下载

  // ===== 泰康 大陆 =====
  {
    company: "taikang",
    product: "泰康乐享健康2026重大疾病保险",
    url: "https://m.taikanglife.com/mobile/uploader/pubProductFile/2025/09/12/ff1fff61-1fbe-4790-b560-d48fb581a55a.pdf",
    file: "taikang-lexiangjiankang-2026.pdf",
  },
  // 鑫享世家 2026 普通版/尊享版 暂未锁定直链

  // ===== 新华 大陆 =====
  {
    company: "new-china-life",
    product: "荣耀鑫享智赢版终身寿险",
    url: "https://static-cdn.newchinalife.com/ncl/pdf/20240912/d93fa785-d054-47d4-88e5-e02f1e791378.pdf",
    file: "ncl-rongyao-xinxiang-zhiyingban.pdf",
  },
  {
    company: "new-china-life",
    product: "宏耀世家终身寿险（分红型）",
    url: "https://www.psbc.com/cn/grfw/tzlc/bx/hlwbxxxpl/cpfwgg/202410/P020241023511457652534.pdf",
    file: "ncl-hongyao-shijia.pdf",
  },
];

function followRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const tryRequest = (curr, redirectsLeft) => {
      const u = new URL(curr);
      const lib = u.protocol === "https:" ? https : http;
      const req = lib.get(
        curr,
        { headers: { "User-Agent": "Mozilla/5.0 PolicyVector-PDFDownloader" } },
        (res) => {
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && redirectsLeft > 0) {
            const loc = res.headers.location;
            if (!loc) return reject(new Error("redirect without location"));
            const next = new URL(loc, curr).toString();
            res.resume();
            tryRequest(next, redirectsLeft - 1);
            return;
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode} for ${curr}`));
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        }
      );
      req.on("error", reject);
      req.setTimeout(30000, () => req.destroy(new Error("timeout")));
    };
    tryRequest(url, maxRedirects);
  });
}

async function main() {
  console.log(`开始下载 ${tasks.length} 个 PDF\n`);

  for (const t of tasks) {
    const targetDir = path.join(root, "public", "pdfs-by-company", slugMap[t.company]);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // 跳过已存在文件
    const targetPath = path.join(targetDir, t.file);
    if (fs.existsSync(targetPath)) {
      console.log(`⏭️  跳过（已存在）: ${slugMap[t.company]}/${t.file}`);
      continue;
    }

    const tmpPath = path.join(tmpDir, t.file);
    process.stdout.write(`⬇️  下载 [${slugMap[t.company]}] ${t.product} ... `);
    try {
      const buf = await followRedirects(t.url);
      // 验证是 PDF
      if (!buf.slice(0, 5).toString().includes("%PDF")) {
        console.log(`❌ 非 PDF 内容（前 100 字节）: ${buf.slice(0, 100).toString()}`);
        continue;
      }
      fs.writeFileSync(tmpPath, buf);
      // 归档
      fs.renameSync(tmpPath, targetPath);
      console.log(`✅ ${(buf.length / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.log(`❌ 失败: ${e.message}`);
    }
  }

  console.log(`\n=== 归档完成 ===`);
  console.log(`目标目录: public/pdfs-by-company/<公司>/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
