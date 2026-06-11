import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const companies = await prisma.company.findMany({
  select: {
    displayName: true,
    slug: true,
    products: {
      select: { name: true, brochureUrl: true, category: true },
      orderBy: { name: "asc" },
    },
  },
  orderBy: { name: "asc" },
});

let totalProducts = 0;
for (const c of companies) {
  if (c.products.length === 0) continue;
  const total = c.products.length;
  const withPdf = c.products.filter((p) => p.brochureUrl).length;
  totalProducts += total;
  console.log("━".repeat(60));
  console.log(`${c.displayName}  (${total} products, ${withPdf} with PDF)`);
  for (const p of c.products) {
    const icon = p.brochureUrl ? "✅" : "❌";
    console.log(`  ${icon} [${p.category.padEnd(18)}] ${p.name}`);
  }
}
console.log("━".repeat(60));
console.log(`Total: ${totalProducts} products`);

await prisma.$disconnect();
