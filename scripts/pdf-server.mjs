// Local HTTP server to receive PDF data from browser
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, "..", "public", "pdfs");

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/upload-pdf") {
    let body = [];
    req.on("data", (chunk) => body.push(chunk));
    req.on("end", () => {
      try {
        const data = Buffer.concat(body);
        const json = JSON.parse(data.toString());
        const { filename, base64 } = json;
        
        if (!filename || !base64) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing filename or base64" }));
          return;
        }

        const filePath = path.join(pdfDir, filename);
        const buffer = Buffer.from(base64, "base64");
        fs.writeFileSync(filePath, buffer);
        
        console.log(`Saved: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, filename, size: buffer.length }));
      } catch (e) {
        console.error("Error:", e.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  console.log(`PDF server ready on port ${port}`);
  // Write port to a temp file so Playwright can read it
  fs.writeFileSync(path.join(__dirname, ".pdf-server-port"), port.toString());
});

// Keep running for 5 minutes then exit
setTimeout(() => {
  console.log("Server timeout, shutting down");
  server.close();
  process.exit(0);
}, 300000);
