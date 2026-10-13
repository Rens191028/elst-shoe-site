import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import { SITE } from "@/lib/site";
import { Logo } from "@/components/site/Logo";
import { KiyohBadge } from "@/components/site/product";

const col = "space-y-2.5 text-sm";
const linkCls = "text-muted-foreground transition-colors hover:text-primary";

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
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Betaalbare schoenen, tassen en accessoires voor dames. Sinds {SITE.founded} een
            vertrouwd adres uit Elst.
          </p>
          <KiyohBadge />
        </div>
        <div>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest">
            Klantenservice
          </h2>
          <ul className={col}>
            <li>
              <Link to="/contact" className={linkCls}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/verzending-retour" className={linkCls}>
                Verzending & retour
              </Link>
            </li>
            <li>
              <Link to="/maatadvies" className={linkCls}>
                Maatadvies
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.email}?subject=Retour`} className={linkCls}>
                Retour aanmelden
              </a>
            </li>
            <li>
              <a href={SITE.whatsappHref} className={linkCls} rel="noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest">Shop</h2>
          <ul className={col}>
            <li>
              <Link to="/collectie/$slug" params={{ slug: "nieuw" }} className={linkCls}>
                Nieuw binnen
              </Link>
            </li>
            <li>
              <Link to="/collectie/$slug" params={{ slug: "schoenen" }} className={linkCls}>
                Schoenen
              </Link>
            </li>
            <li>
              <Link to="/collectie/$slug" params={{ slug: "tassen" }} className={linkCls}>
                Tassen
              </Link>
            </li>
            <li>
              <Link to="/collectie/$slug" params={{ slug: "accessoires" }} className={linkCls}>
                Accessoires
              </Link>
            </li>
            <li>
              <Link to="/collectie/$slug" params={{ slug: "sale" }} className={linkCls}>
                Sale
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-widest">
            Over ons
          </h2>
          <address className={`${col} not-italic text-muted-foreground`}>
            <p>
              {SITE.name}
              <br />
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}
            </p>
            <p>
              <a href={SITE.phoneHref} className="hover:text-primary">
                {SITE.phone}
              </a>
              <br />
              <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                {SITE.email}
              </a>
            </p>
            <p>
              KvK {SITE.kvk}
              <br />
              BTW {SITE.btw}
            </p>
          </address>
          <Link to="/over-ons" className={`${linkCls} mt-3 inline-block text-sm`}>
            Ons verhaal →
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 lg:px-6">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <form
              action={`mailto:${SITE.email}`}
              method="post"
              encType="text/plain"
              className="flex w-full max-w-md gap-2"
            >
              <label htmlFor="nl-email" className="sr-only">
                E-mailadres voor de nieuwsbrief
              </label>
              <input
                id="nl-email"
                name="Nieuwsbrief-aanmelding"
                type="email"
                required
                placeholder="Je e-mailadres — 10% korting op je eerste bestelling"
                className="h-11 min-w-0 flex-1 rounded-full border border-border bg-white px-4 text-sm outline-none focus:border-ink"
              />
              <button
                type="submit"
                className="h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-primary"
              >
                Aanmelden
              </button>
            </form>
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
          </div>
          <div className="flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-2" aria-label="Betaalmethoden">
              {["iDEAL", "Klarna", "Creditcard", "Bancontact"].map((m) => (
                <li
                  key={m}
                  className="rounded-md border border-border bg-white px-2.5 py-1 font-semibold text-ink"
                >
                  {m}
                </li>
              ))}
            </ul>
            <p>Nederland · EUR (€)</p>
            <p>
              © {new Date().getFullYear()} {SITE.name}. Alle prijzen incl. btw.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
