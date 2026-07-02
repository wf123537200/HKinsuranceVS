// lib/pdf-utils.ts — Shared helpers for product PDF brochure URLs.
//
// The product detail page used to declare pdfPublicUrl locally; we now
// share it so compare pages can also reference brochure URLs for GEO
// Sources blocks and JSON-LD.

export function pdfPublicUrl(pdfPath: string | null | undefined): string | null {
  if (!pdfPath) return null;
  if (pdfPath.startsWith("public/")) return "/" + pdfPath.slice("public/".length);
  return "/" + pdfPath.replace(/^\//, "");
}
