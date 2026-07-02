// scripts/rename-pdfs-cn.mjs
// 把 PDF 文件名加上中文后缀，匹配 selected product_name 的中文关键词
import fs from "fs";
import path from "path";

const root = process.cwd();
const byCompanyDir = path.join(root, "public", "pdfs-by-company");

// 文件名 → 附加的中文（确保 selected 的关键词能命中）
const renames = {
  "ping-an/pingan-fuli-20-ci.pdf": "pingan-fuli-20-ci-平安福20重大疾病保险.pdf",
  "ping-an/pingan-ruyi-quanneng-2025-ci.pdf":
    "pingan-ruyi-quanneng-2025-ci-平安如意全能2025.pdf",
  "ping-an/pingan-shengshi-jinyue-zunxiang-26II-shengshijinyue-xilie.pdf":
    "pingan-shengshi-jinyue-zunxiang-26II-平安盛世金越系列.pdf",
  "ping-an/pingan-yuxiang-jinyue-2025-yuxiangjinyue.pdf":
    "pingan-yuxiang-jinyue-2025-平安御享金越2025.pdf",
  "cpic-life/cpic-jinshengwuyou-2024-kids-jinshengwuyou-xilie.pdf":
    "cpic-jinshengwuyou-2024-kids-金生无忧系列.pdf",
  "cpic-life/cpic-xiangbanzhizun-2024s-changxiangban-xilie.pdf":
    "cpic-xiangbanzhizun-2024s-长相伴系列-长相伴（至尊2024S）终身寿险（分红型）.pdf",
  "taikang-life/taikang-lexiangjiankang-2026-lexiangjiankang-xilie.pdf":
    "taikang-lexiangjiankang-2026-乐享健康系列.pdf",
  "new-china-life/ncl-rongyao-xinxiang-zhiyingban-rongyao-xinxiang-xilie.pdf":
    "ncl-rongyao-xinxiang-zhiyingban-荣耀鑫享系列.pdf",
  "new-china-life/ncl-hongyao-shijia-zhongshou-fenhong.pdf":
    "ncl-hongyao-shijia-宏耀世家终身寿险（分红型）.pdf",
};

let ok = 0;
for (const [k, v] of Object.entries(renames)) {
  const src = path.join(byCompanyDir, k);
  const dst = path.join(byCompanyDir, v);
  if (!fs.existsSync(src)) {
    console.log(`❌ not found: ${k}`);
    continue;
  }
  fs.renameSync(src, dst);
  console.log(`✅ ${k} → ${v}`);
  ok++;
}
console.log(`\nDone: ${ok}/${Object.keys(renames).length} renamed`);
