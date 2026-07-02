// filepath: lib/r2.ts
//
// Server-only Cloudflare R2 client. Used by app/api/pdf-url/route.ts
// to issue presigned GET URLs for product brochures. The bucket stays
// private — only authenticated users ever see a presigned URL.
//
// Required env vars (see .env.example):
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME            (default: "policy-vector-pdfs")
//   R2_PRESIGNED_URL_EXPIRES_SECONDS  (default: 600 = 10 minutes)

import "server-only";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let cached: S3Client | null = null;

function getR2Client(): S3Client | null {
  if (cached) return cached;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  cached = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cached;
}

export function getR2Bucket(): string {
  return process.env.R2_BUCKET_NAME || "policy-vector-pdfs";
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY,
  );
}

export function getR2ExpiresInSeconds(): number {
  const raw = process.env.R2_PRESIGNED_URL_EXPIRES_SECONDS;
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 600;
}

export async function presignGetUrl(
  key: string,
): Promise<{ url: string; expiresIn: number } | null> {
  const client = getR2Client();
  if (!client) return null;
  const expiresIn = getR2ExpiresInSeconds();
  const url = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: getR2Bucket(), Key: key }),
    { expiresIn },
  );
  return { url, expiresIn };
}
