import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDbUrl(): string {
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("file:")) return url;
  // Fallback: ./prisma/dev.db relative to project root, regardless of cwd
  return `file:./prisma/dev.db`;
}

function createClient() {
  const url = resolveDbUrl();
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
