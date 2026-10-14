import { useRouterState } from "@tanstack/react-router";
import { Check, Copy, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

// Zelfde aanbod en code als de nieuwsbriefsectie in de footer (Footer.tsx, CODE).
const CODE = "WELKOM10";
const KEY = "gs-exit-intent";
const SKIP = ["/afrekenen", "/bedankt", "/winkelwagen", "/account", "/inloggen", "/registreren"];
const WEEK = 7 * 24 * 3600 * 1000;

/**
 * Desktop-only: één keer (per week) wanneer de muis het venster naar boven verlaat.
 * Geen timers of pop-ups op mobiel; nooit in checkout of account.
 */
export function ExitIntent() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const skip = SKIP.some((p) => path.startsWith(p));

  useEffect(() => {
    if (skip || !window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) return;
    try {
      if (Date.now() - Number(localStorage.getItem(KEY) ?? 0) < WEEK) return;
    } catch {
      return;
    }
    const armed = Date.now() + 8000; // niet meteen na het laden
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget || Date.now() < armed) return;
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch {
        /* niet beschikbaar: dan hooguit vaker getoond */
      }
      setOpen(true);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [skip]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });
    setState(!error || error.code === "23505" ? "done" : "error");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass max-w-md rounded-3xl p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-text">
          Voor je weggaat
        </p>
        <DialogTitle className="font-display text-3xl font-extrabold">
          10% korting op je eerste bestelling
        </DialogTitle>
        <DialogDescription>
          Schrijf je in voor de nieuwsbrief en gebruik de code bij het afrekenen.
        </DialogDescription>
        {state === "done" ? (
          <div role="status" className="mt-2">
            <p className="flex items-center gap-2 font-semibold">
              <Check className="h-5 w-5 text-primary" aria-hidden="true" /> Bedankt voor je
              inschrijving!
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 rounded-2xl border-2 border-dashed border-primary px-4 py-2.5 text-center font-display text-xl font-extrabold tracking-widest text-primary-text">
                {CODE}
              </code>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(CODE);
                  setCopied(true);
                }}
                className="flex h-12 items-center gap-1.5 rounded-2xl bg-ink px-4 text-sm font-semibold text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Gekopieerd" : "Kopieer"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-2 space-y-3">
            <label htmlFor="exit-email" className="sr-only">
              E-mailadres
            </label>
            <input
              id="exit-email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw@email.nl"
              className="h-12 w-full rounded-full border border-border bg-white px-5 text-sm outline-none focus:border-ink"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="flex h-12 w-full items-center justify-center rounded-full bg-cta font-semibold text-white disabled:opacity-70"
            >
              {state === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Stuur mij de code"
              )}
            </button>
            {state === "error" && (
              <p role="alert" className="text-xs text-primary-text">
                Inschrijven lukte niet. Controleer je e-mailadres en probeer het opnieuw.
              </p>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm text-muted-foreground underline underline-offset-4"
            >
              Nee bedankt
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
