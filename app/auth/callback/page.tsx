// filepath: app/auth/callback/page.tsx
//
// Supabase email confirmation / magic-link landing page.
//
// This route is intentionally NOT localized (it lives at the
// project root) because Supabase's `emailRedirectTo` is generated on
// the client as `${window.location.origin}/auth/callback` and the
// auth callback URL needs to be stable across all locales.
//
// The middleware matcher excludes /auth/* so this page is reachable
// directly without a locale prefix.

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"pending" | "ok" | "error">("pending");
  const [message, setMessage] = useState<string>("Completing sign-in…");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      // Case A: PKCE / OTP — Supabase returns ?code=...
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }
        setStatus("ok");
        router.replace(params.get("redirect") || "/");
        return;
      }

      // Case B: hash fragments — supabase-js auto-detects the
      // access_token / refresh_token in the URL and persists the
      // session to cookies. We listen for SIGNED_IN and redirect.
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setStatus("ok");
          subscription.unsubscribe();
          router.replace(params.get("redirect") || "/");
        }
      });

      // Hard timeout — if nothing fires within 8s the link is probably
      // expired or malformed.
      const timer = window.setTimeout(() => {
        subscription.unsubscribe();
        if (!cancelled) {
          setStatus((s) => (s === "ok" ? s : "error"));
          setMessage((m) =>
            m === "Completing sign-in…"
              ? "Confirmation link is invalid or expired. Please request a new one."
              : m,
          );
        }
      }, 8000);

      return () => {
        cancelled = true;
        window.clearTimeout(timer);
        subscription.unsubscribe();
      };
    };

    void run();
  }, [params, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {status === "error" ? "Sign-in failed" : "Completing sign-in…"}
        </h1>
        <p className="text-sm text-gray-600">{message}</p>
        {status === "error" ? (
          <a
            href="/login"
            className="inline-block mt-4 text-sm text-blue-700 hover:underline"
          >
            Back to sign-in
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
