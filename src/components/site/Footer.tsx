import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy, Facebook, Instagram, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";
import { Logo } from "@/components/site/Logo";
import { KiyohBadge } from "@/components/site/product";

const CODE = "WELKOM10";
const linkCls = "link-underline text-sm text-muted-foreground transition-colors hover:text-primary";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [copied, setCopied] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });
    // Al ingeschreven (unieke e-mail) telt ook als geslaagd
    setState(!error || error.code === "23505" ? "done" : "error");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 lg:px-6" aria-labelledby="nl-title">
      <div className="hero-surface relative overflow-hidden rounded-3xl border border-border px-6 py-10 md:px-12 md:py-12">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-text">
              Nieuwsbrief
            </p>
            <h2 id="nl-title" className="font-display text-3xl font-extrabold md:text-4xl">
              10% korting op je eerste bestelling
            </h2>
            <p className="mt-2 text-muted-foreground">
              Schrijf je in en hoor als eerste over nieuwe collecties en sale.
            </p>
          </div>

          {state === "done" ? (
            <div
              role="status"
              className="anim-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <p className="flex items-center gap-2 font-semibold">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
                Bedankt voor je inschrijving!
              </p>
              <p className="mt-3 text-sm text-muted-foreground">Jouw kortingscode:</p>
              <div className="mt-1.5 flex items-center gap-2">
                <code className="flex-1 rounded-2xl border-2 border-dashed border-primary bg-background px-4 py-2.5 text-center font-display text-xl font-extrabold tracking-widest text-primary-text">
                  {CODE}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(CODE);
                    setCopied(true);
                  }}
                  className="flex h-12 shrink-0 items-center gap-1.5 rounded-2xl bg-ink px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Gekopieerd" : "Kopieer"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="min-w-0">
              <label htmlFor="nl-email" className="sr-only">
                E-mailadres
              </label>
              <div className="group flex flex-col gap-2 rounded-2xl bg-card p-2 shadow-sm ring-1 ring-border transition focus-within:ring-2 focus-within:ring-primary sm:flex-row sm:rounded-full">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                  <Mail className="h-4 w-4 shrink-0 text-soft transition-colors group-focus-within:text-primary" />
                  <input
                    id="nl-email"
                    type="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jouw@email.nl"
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-soft focus-visible:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="group/btn flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-cta px-6 text-sm font-semibold text-primary-foreground transition active:scale-[0.97] disabled:opacity-70"
                >
                  {state === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Aanmelden
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
              <p
                className={`mt-2 px-3 text-xs ${state === "error" ? "text-primary-text" : "text-muted-foreground"}`}
              >
                {state === "error"
                  ? "Inschrijven lukte niet. Controleer je e-mailadres en probeer het opnieuw."
                  : "Uitschrijven kan altijd. We sturen geen spam."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest">{title}</h2>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

export function Footer() {
  const socials = [
    { key: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { key: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    { key: "tiktok", label: "TikTok", icon: <span className="text-[10px] font-bold">TT</span> },
  ] as const;
  const socialCls =
    "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary";

  return (
    <footer className="mt-24 border-t border-border bg-secondary">
      <Newsletter />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-6">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Betaalbare schoenen, tassen en accessoires voor dames. Sinds {SITE.founded} een
            vertrouwd adres uit Elst.
          </p>
          <div className="flex gap-2">
            {socials.map((s) => {
              const href = SITE.social[s.key];
              return href ? (
                <a
                  key={s.key}
                  href={href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className={socialCls}
                >
                  {s.icon}
                </a>
              ) : (
                <span
                  key={s.key}
                  role="img"
                  aria-label={`${s.label} (binnenkort)`}
                  title="Binnenkort"
                  className={`${socialCls} opacity-60`}
                >
                  {s.icon}
                </span>
              );
            })}
          </div>
        </div>

        <Column title="Shop">
          {(["schoenen", "tassen", "accessoires", "sale"] as const).map((slug) => (
            <li key={slug}>
              <Link to="/collectie/$slug" params={{ slug }} className={linkCls}>
                {slug[0]!.toUpperCase() + slug.slice(1)}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/cadeaubon" className={linkCls}>
              Cadeaubon
            </Link>
          </li>
        </Column>

        <Column title="Klantenservice">
          <li>
            <Link to="/verzending-retour" hash="retour" className={linkCls}>
              Retourbeleid (30 dagen)
            </Link>
          </li>
          <li>
            <Link to="/verzending-retour" hash="verzending" className={linkCls}>
              Verzending
            </Link>
          </li>
          <li>
            <Link to="/faq" className={linkCls}>
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/contact" className={linkCls}>
              Contact
            </Link>
          </li>
        </Column>

        <Column title="Over ons">
          <li>
            <Link to="/over-ons" className={linkCls}>
              Over goedkopeschoenen.com
            </Link>
          </li>
          <li className="pt-1">
            <div className="inline-block rounded-2xl border border-border bg-card px-4 py-3">
              <KiyohBadge className="items-start" />
            </div>
          </li>
        </Column>
      </div>

      <div className="border-t border-border bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 text-xs text-white/70 md:flex-row md:justify-between lg:px-6">
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Betaalmethoden">
            {["iDEAL", "Klarna", "Creditcard"].map((m) => (
              <li
                key={m}
                className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 font-semibold text-white"
              >
                {m}
              </li>
            ))}
          </ul>
          <p className="text-center">
            © {new Date().getFullYear()} {SITE.name} · KvK {SITE.kvk} · Alle prijzen incl. btw
          </p>
        </div>
      </div>
    </footer>
  );
}
