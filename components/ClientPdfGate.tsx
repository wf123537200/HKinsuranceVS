"use client";

// filepath: components/ClientPdfGate.tsx
//
// Client-side gate for product PDF brochures. The PDF itself is stored
// in Cloudflare R2 (private bucket) and reached through /api/pdf-url,
// which checks the Supabase access token before issuing a presigned
// URL. The actual security boundary lives server-side; this component
// just decides which label to show and where to send the click.

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSupabaseSession } from "./SupabaseSessionProvider";

interface Props {
  productId: string;
  /** Local PDF path — passed in for parity with the old code but the
   *  actual lookup happens server-side. Used only as a presentational
   *  gate (no PDF — no button). */
  localPdfPath?: string | null;
  /** Label to show to authenticated users. */
  viewPdfLabel: string;
  /** Label to show to guests. */
  lockedLabel: string;
  /** Optional override for the post-login redirect. Defaults to the
   *  current pathname. */
  redirectPath?: string;
  className?: string;
}

export default function ClientPdfGate({
  productId,
  localPdfPath,
  viewPdfLabel,
  lockedLabel,
  redirectPath,
  className,
}: Props) {
  const { session, loading: sessionLoading } = useSupabaseSession();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  if (!localPdfPath) return null;
  if (sessionLoading) return null;

  const target = redirectPath || pathname || "/";
  const loginHref =
    `/login?redirect=${encodeURIComponent(target)}` +
    `&action=view_pdf&product_id=${encodeURIComponent(productId)}`;

  const accessToken = session?.access_token;
  const signed = Boolean(accessToken);

  const handleClick = async () => {
    if (!signed) {
      window.location.href = loginHref;
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(
        `/api/pdf-url?product_id=${encodeURIComponent(productId)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!res.ok) {
        // 401 (token expired/invalid) or 5xx — fall back to login.
        window.location.href = loginHref;
        return;
      }
      const json = (await res.json()) as { url?: string };
      if (!json?.url) {
        window.location.href = loginHref;
        return;
      }
      window.open(json.url, "_blank", "noopener,noreferrer");
    } catch {
      window.location.href = loginHref;
    } finally {
      setBusy(false);
    }
  };

  const cn =
    className ||
    "inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={cn}
      aria-label={signed ? viewPdfLabel : lockedLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {signed ? viewPdfLabel : lockedLabel}
      {!signed ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5 ml-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11c-1.66 0-3 1.34-3 3v6h6v-6c0-1.66-1.34-3-3-3zm6-5V7H6v-.5C6 4.67 7.67 3 9.5 3h5C16.33 3 18 4.67 18 6.5V7v1z"
          />
        </svg>
      ) : null}
    </button>
  );
}
