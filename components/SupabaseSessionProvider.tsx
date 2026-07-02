// filepath: components/SupabaseSessionProvider.tsx
//
// Thin React context that mirrors the Supabase auth session into a
// useState/useSyncExternalStore-like API so the rest of the app can
// read it from any client component (Header, /login, /register).
//
// We do NOT keep Supabase's own session in a server cookie for now —
// for the current /login and /register flows we just need to know
// whether a session exists in this browser tab and what the user's
// email is. The session is hydrated from
//   /api/auth/me (server route → supabase.auth.getUser())
// on mount.

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

type SessionState = {
  session: Session | null;
  email: string | null;
  loading: boolean;
};

const SessionContext = createContext<SessionState>({
  session: null,
  email: null,
  loading: true,
});

async function refresh(
  supabase: SupabaseClient,
  setState: (s: SessionState) => void,
) {
  const { data } = await supabase.auth.getSession();
  setState({
    session: data.session,
    email: data.session?.user?.email ?? null,
    loading: false,
  });
}

export function SupabaseSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({
    session: null,
    email: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setState({ session: null, email: null, loading: false });
      return;
    }
    void refresh(supabase, setState);
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        session,
        email: session?.user?.email ?? null,
        loading: false,
      });
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
  );
}

export function useSupabaseSession() {
  return useContext(SessionContext);
}