const fs = require("fs");
const txt = fs.readFileSync("messages/en.json", "utf8");

// Find all occurrences
const reGeo = /"geo":\s*{/g;
const reIrrseo = /"IRRSEO":\s*{/g;
const reIrrCalc = /"IRRCalculator":\s*{/g;
const reIrrPage = /"IRRPage":\s*{/g;
let m;
console.log("--- searching for top-level keys ---");
while ((m = reGeo.exec(txt))) console.log(`"geo" at offset ${m.index}`);
while ((m = reIrrseo.exec(txt))) console.log(`"IRRSEO" at offset ${m.index}`);
while ((m = reIrrCalc.exec(txt))) console.log(`"IRRCalculator" at offset ${m.index}`);
while ((m = reIrrPage.exec(txt))) console.log(`"IRRPage" at offset ${m.index}`);

console.log("\n--- last 2000 chars of file ---");
console.log(txt.substring(txt.length - 2000));
