// filepath: lib/auth.ts
//
// Minimal NextAuth v5 configuration. The actual user-facing auth flow
// (login + register) is handled directly by the Supabase browser
// client inside app/[locale]/login/page.tsx and
// app/[locale]/register/page.tsx. NextAuth is kept in place only so
// existing components that still call useSession() / signOut() from
// "next-auth/react" keep compiling; no providers are registered, so
// there is no way to sign in via NextAuth anymore.

import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});