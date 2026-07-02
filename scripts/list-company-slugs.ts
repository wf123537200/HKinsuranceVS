// scripts/list-company-slugs.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const ad = new PrismaBetterSqlite3({ url: `file:${path.join(process.cwd(), "dev.db")}` });
const p = new PrismaClient({ adapter: ad });

async function main() {
  const r = await p.company.findMany({ select: { slug: true, displayName: true } });
  console.log(JSON.stringify(r, null, 2));
  await p.$disconnect();
}
main();
