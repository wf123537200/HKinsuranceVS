// filepath: lib/supabase/client.ts
//
// Browser-side Supabase client. Used by /login and /register forms to
// call supabase.auth.signInWithPassword / supabase.auth.signUp
// directly from the browser. Uses the anon key (publishable).
//
// Required env vars:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY

"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anon) return null;
  cached = createBrowserClient(url, anon);
  return cached;
}