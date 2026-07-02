// app/[locale]/login/layout.tsx
//
// Per-route layout that adds noindex metadata for the /login route.
// The login page itself is a client component and can't export
// metadata, so we attach it at the layout level instead.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
