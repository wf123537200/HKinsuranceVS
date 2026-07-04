import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Search the well-known locations in priority order. The first
// existing prisma/dev.db wins. This avoids the brittle "cwd-relative"
// default that broke on the production server when pm2 launched
// server.js with cwd != /opt/apps/HKinsuranceVS.
//
// 1. $DATABASE_URL  (if set and starts with `file:`)
// 2. /opt/apps/HKinsuranceVS/prisma/dev.db  (production)
// 3. <cwd>/prisma/dev.db                   (local dev, npm run dev)
// 4. <cwd>/../prisma/dev.db                (next dev sometimes chdirs)
// 5. file:./prisma/dev.db                  (last-resort cwd-relative)
function resolveDbUrl(): string {
  const explicit = process.env.DATABASE_URL ?? "";
  if (explicit.startsWith("file:")) return explicit;

  const candidates = [
    "/opt/apps/HKinsuranceVS/prisma/dev.db",
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "..", "prisma", "dev.db"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return `file:${candidate}`;
    }
  }
  return `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
}

function createClient() {
  const url = resolveDbUrl();
  // Log once at module load so the deploy log shows exactly which
  // file prisma is connecting to. This has caught the "empty db
  // created because cwd was wrong" failure mode in the past.
  console.log(`[prisma] connecting to ${url}`);
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
