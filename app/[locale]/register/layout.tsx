// filepath: app/[locale]/register/layout.tsx
//
// Per-route layout for /register that adds noindex metadata. The page
// is a client component so it cannot export metadata itself.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}