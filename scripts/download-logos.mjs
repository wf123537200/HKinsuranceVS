import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logos = [
  { domain: "prudential.com.hk", file: "prudential.png" },
  { domain: "aia.com", file: "aia.png" },
  { domain: "manulife.com", file: "manulife.png" },
  { domain: "axa.com", file: "axa.png" },
  { domain: "fwd.com", file: "fwd.png" },
  { domain: "pingan.com", file: "pingan.png" },
  { domain: "chinalife.com.cn", file: "chinalife.png" },
  { domain: "taikang.com", file: "taikang.png" },
  { domain: "cpic.com.cn", file: "cpic.png" },
  { domain: "newchinalife.com", file: "newchinalife.png" },
];

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { rejectUnauthorized: false }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          download(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

for (const { domain, file } of logos) {
  const url = `https://logo.clearbit.com/${domain}`;
  const filePath = path.join(__dirname, "public", "logos", file);
  try {
    const buf = await download(url);
    fs.writeFileSync(filePath, buf);
    console.log(`${file}: OK (${buf.length} bytes)`);
  } catch (e) {
    console.log(`${file}: FAIL - ${e.message}`);
  }
}
