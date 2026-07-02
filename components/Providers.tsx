"use client";

import { SessionProvider } from "next-auth/react";
import { SupabaseSessionProvider } from "./SupabaseSessionProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SupabaseSessionProvider>{children}</SupabaseSessionProvider>
    </SessionProvider>
  );
}