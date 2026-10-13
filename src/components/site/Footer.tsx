import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { Logo } from "@/components/site/Logo";
import { KiyohBadge } from "@/components/site/product";

const DISCOUNT_CODE = "WELKOM10";
const heading = "mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink";
const list = "space-y-3 text-sm";
const linkCls = "text-muted-foreground transition-colors hover:text-primary";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: aanmelding opslaan zodra er een backend is (Supabase staat aan voor dit project).
    setDone(true);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* klembord niet beschikbaar */
    }
  };

  return (
    <section
      aria-labelledby="nieuwsbrief-h"
      className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover p-8 text-white shadow-[0_24px_40px_-28px_var(--primary)] md:p-12"
    >
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2
            id="nieuwsbrief-h"
            className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
          >
            Mis nooit een deal
          </h2>
          <p className="mt-2 max-w-md text-white/85">
            Schrijf je in voor onze nieuwsbrief en ontvang als eerste nieuwe collecties en acties,
            plus 10% korting op je eerste bestelling.
          </p>
        </div>
        <div aria-live="polite" className="min-h-[56px]">
          {done ? (
            <div className="anim-fade-up flex flex-col gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 font-medium">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary">
                  <Check className="h-4 w-4" />
                </span>
                Bedankt! Jouw code:{" "}
                <strong className="rounded-md bg-white px-2 py-0.5 font-display tracking-wider text-primary">
                  {DISCOUNT_CODE}
                </strong>
              </p>
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-white/60 px-4 py-1.5 text-sm font-semibold transition hover:bg-white hover:text-primary"
              >
                {copied ? "Gekopieerd" : "Kopieer code"}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="nl-email" className="sr-only">
                E-mailadres
              </label>
              <input
                id="nl-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Je e-mailadres"
                className="h-14 min-w-0 shrink-0 rounded-full sm:flex-1 sm:shrink border-2 border-transparent bg-white px-6 text-ink outline-none transition placeholder:text-soft focus:border-ink focus:ring-4 focus:ring-white/40"
              />
              <button
                type="submit"
                className="group flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                Aanmelden
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const socials = [
    {
      key: "instagram",
      href: SITE.social.instagram,
      label: "Instagram",
      icon: <Instagram className="h-4 w-4" />,
    },
    {
      key: "facebook",
      href: SITE.social.facebook,
      label: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
    },
    {
      key: "tiktok",
      href: SITE.social.tiktok,
      label: "TikTok",
      icon: <span className="text-[10px] font-bold">TT</span>,
    },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 pt-12 lg:px-6">
        <Newsletter />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Betaalbare schoenen, tassen en accessoires. Vandaag besteld, vandaag verzonden.
          </p>
          {socials.length > 0 && (
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white transition hover:-translate-y-0.5 hover:text-primary"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Shop">
          <h2 className={heading}>Shop</h2>
          <ul className={list}>
            {[
              ["schoenen", "Schoenen"],
              ["tassen", "Tassen"],
              ["accessoires", "Accessoires"],
              ["sale", "Sale"],
            ].map(([slug, label]) => (
              <li key={slug}>
                <Link to="/collectie/$slug" params={{ slug: slug! }} className={linkCls}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Klantenservice">
          <h2 className={heading}>Klantenservice</h2>
          <ul className={list}>
            <li>
              <Link to="/verzending-retour" className={linkCls}>
                Retourbeleid (30 dagen)
              </Link>
            </li>
            <li>
              <Link to="/verzending-retour" className={linkCls}>
                Verzending
              </Link>
            </li>
            <li>
              {/* Er is nog geen aparte FAQ-pagina; tot die er is wijst dit naar Verzending & retour. */}
              <Link to="/verzending-retour" className={linkCls}>
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className={linkCls}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={heading}>Over ons</h2>
          <ul className={list}>
            <li>
              <Link to="/over-ons" className={linkCls}>
                Over goedkopeschoenen.com
              </Link>
            </li>
            <li>
              <KiyohBadge className="flex-wrap" />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 text-center text-xs text-muted-foreground md:flex-row md:justify-between md:text-left lg:px-6">
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Betaalmethoden">
            {["iDEAL", "Klarna", "Creditcard"].map((m) => (
              <li
                key={m}
                className="rounded-md border border-border bg-white px-2.5 py-1 font-semibold text-ink"
              >
                {m}
              </li>
            ))}
          </ul>
          <p>
            © {new Date().getFullYear()} {SITE.name} · KvK {SITE.kvk} · BTW {SITE.btw}
          </p>
        </div>
      </div>
    </footer>
  );
}
