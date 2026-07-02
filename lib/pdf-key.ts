// filepath: lib/pdf-key.ts
//
// Maps a vector's local_pdf_path to its Cloudflare R2 object key.
//
// Convention (v1):
//   - Drop the leading "public/" prefix.
//   - Idempotent — already-stripped paths pass through unchanged.
//   - Best-effort fallback: paths without the prefix are prefixed
//     with "pdfs/" so we still produce a valid R2 key.
//   - Windows backslashes are normalized to forward slashes.
//
// Examples
//   "public/pdfs/aia-on-your-side-2.pdf" -> "pdfs/aia-on-your-side-2.pdf"
//   "pdfs/aia-on-your-side-2.pdf"        -> "pdfs/aia-on-your-side-2.pdf"
//   "aia-on-your-side-2.pdf"             -> "pdfs/aia-on-your-side-2.pdf"

export function localPdfPathToR2Key(
  localPdfPath: string | null | undefined,
): string | null {
  if (!localPdfPath) return null;
  const normalized = localPdfPath.replace(/\\/g, "/");
  let stripped = normalized.replace(/^public\//, "");
  stripped = stripped.replace(/^\/+/, "");
  if (!stripped) return null;
  if (stripped.startsWith("pdfs/")) return stripped;
  return `pdfs/${stripped}`;
}
