// filepath: app/api/pdf-url/route.ts
//
// GET /api/pdf-url?product_id=<slug>
//   Authorization: Bearer <supabase_access_token>
//
// Validate the Supabase user JWT using an *anon* Supabase client
// (never service-role), look up the product's local_pdf_path, derive
// the corresponding R2 key, issue a presigned GET URL, and return
// it as JSON.
//
// Return codes
//   200 { url, expires_in, product_id, bucket }
//   400 { error: "missing_product_id" | "no_pdf_for_product" }
//   401 { error: "missing_token" | "invalid_token" }
//   500 { error: "internal" }
//   503 { error: "supabase_not_configured" | "r2_not_configured" }

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  presignGetUrl,
  isR2Configured,
  getR2Bucket,
} from "@/lib/r2";
import { localPdfPathToR2Key } from "@/lib/pdf-key";
import { getAllProductVectors } from "@/lib/product-vector-registry";

function jsonError(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("product_id")?.trim();
  if (!productId) return jsonError(400, "missing_product_id");

  const authHeader = request.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return jsonError(401, "missing_token");
  const token = match[1].trim();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return jsonError(503, "supabase_not_configured");
  }

  // Use anon client + bearer token — NEVER service-role for user auth.
  const supabase = createClient(supabaseUrl, supabaseAnon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  let authedUser: { id: string } | null = null;
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data.user) authedUser = { id: data.user.id };
  } catch {
    authedUser = null;
  }
  if (!authedUser) return jsonError(401, "invalid_token");

  if (!isR2Configured()) return jsonError(503, "r2_not_configured");

  let r2Key: string | null = null;
  try {
    const vectors = await getAllProductVectors();
    const vector = vectors.find((v) => v.base.slug === productId);
    if (vector) r2Key = localPdfPathToR2Key(vector.base.local_pdf_path);
  } catch {
    r2Key = null;
  }
  if (!r2Key) return jsonError(400, "no_pdf_for_product");

  let signed: { url: string; expiresIn: number } | null = null;
  try {
    signed = await presignGetUrl(r2Key);
  } catch {
    signed = null;
  }
  if (!signed) return jsonError(503, "r2_not_configured");

  return NextResponse.json({
    url: signed.url,
    expires_in: signed.expiresIn,
    product_id: productId,
    bucket: getR2Bucket(),
  });
}
