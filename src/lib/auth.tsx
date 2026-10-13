import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

type SignUpResult = { error: string | null; needsConfirmation: boolean };

type AuthCtx = {
  user: User | null;
  /** true tot de bestaande sessie (localStorage) is gecontroleerd */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (name: string, email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthCtx | null>(null);

/** Vertaalt Supabase-foutmeldingen naar begrijpelijk Nederlands, zonder details te lekken. */
export function authError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Het e-mailadres of wachtwoord klopt niet.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Er bestaat al een account met dit e-mailadres. Probeer in te loggen.";
  if (m.includes("password should be") || m.includes("weak password"))
    return "Kies een sterker wachtwoord van minimaal 8 tekens.";
  if (m.includes("same password")) return "Kies een ander wachtwoord dan je huidige.";
  if (m.includes("email not confirmed"))
    return "Bevestig eerst je e-mailadres via de link in je mailbox.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Te veel pogingen. Wacht even en probeer het opnieuw.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Geen verbinding. Controleer je internet en probeer het opnieuw.";
  return "Er ging iets mis. Probeer het later opnieuw.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
    });
    supabase.auth
      .getSession()
      .then(({ data: s }) => {
        if (!active) return;
        setSession((cur) => cur ?? s.session);
      })
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? authError(error.message) : null;
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<SignUpResult> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return { error: authError(error.message), needsConfirmation: false };
      // Zonder verplichte e-mailverificatie krijgt de gebruiker direct een sessie.
      return { error: null, needsConfirmation: !data.session };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/wachtwoord-resetten`,
    });
    return error ? authError(error.message) : null;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? authError(error.message) : null;
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user: session?.user ?? null,
      loading,
      signIn,
      signUp,
      signOut,
      sendPasswordReset,
      updatePassword,
    }),
    [session, loading, signIn, signUp, signOut, sendPasswordReset, updatePassword],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth moet binnen AuthProvider gebruikt worden");
  return ctx;
}

/** Alleen interne paden toestaan als redirect (geen open redirect). */
export function safeRedirect(value: unknown, fallback = "/account"): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : fallback;
}
