import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  countIn,
  discountPct,
  getCollection,
  GROUPS,
  inCollection,
  money,
  PRODUCTS,
  searchProducts,
  SUBS,
} from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useFavorites } from "@/lib/favorites";
import { ANNOUNCEMENTS } from "@/lib/site";
import { Logo } from "@/components/site/Logo";
import { Photo } from "@/components/site/product";
import { cn } from "@/lib/utils";

const MAX_SALE_PCT = Math.max(...PRODUCTS.map(discountPct));
const NEW_COUNT = inCollection(getCollection("nieuw")!).length;
const MESSAGES = [
  ANNOUNCEMENTS[0]!,
  `Sale: tot -${MAX_SALE_PCT}% korting op ${countIn("sale")} producten`,
  ANNOUNCEMENTS[1]!,
  `Nieuw binnen: ${NEW_COUNT} nieuwe producten in onze collectie`,
  ANNOUNCEMENTS[2]!,
];

function Announcement() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <div
      className="bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p
        key={i}
        className="anim-fade-up mx-auto max-w-7xl px-4 py-2 text-center text-xs font-medium tracking-wide"
        aria-live="off"
      >
        {MESSAGES[i]}
      </p>
    </div>
  );
}

/**
 * Mega-menu: links een rustige categorielijst met één knop, rechts één focus: nieuw binnen.
 * (Er is geen verkoopdata, dus "nieuw" i.p.v. "populair".)
 */
function MegaPanel({ slug, onNavigate }: { slug: string; onNavigate: () => void }) {
  const group = GROUPS.find((g) => g.slug === slug)!;
  const subs = SUBS.filter((x) => x.group === slug);
  const fresh = useMemo(
    () =>
      inCollection(group)
        .filter((p) => p.s)
        .slice(0, 3),
    [group],
  );
  return (
    <div
      data-mega-panel
      className="menu-panel absolute inset-x-0 top-full border-b border-border bg-background shadow-[0_24px_40px_-24px_rgba(20,20,19,0.25)]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[260px_1fr] gap-20 px-6 py-12">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-soft">
            {group.title}
          </p>
          <ul className="space-y-3.5">
            {subs.map((sub) => (
              <li key={sub.slug}>
                <Link
                  to="/collectie/$slug"
                  params={{ slug: sub.slug }}
                  onClick={onNavigate}
                  className="flex items-baseline gap-2 text-base font-medium text-ink hover:text-primary-text"
                >
                  {sub.title}
                  <span className="text-xs font-normal text-soft">{countIn(sub.slug)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/collectie/$slug"
            params={{ slug }}
            onClick={onNavigate}
            className="mt-9 inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
          >
            Bekijk alle {group.title.toLowerCase()} <span aria-hidden="true">→</span>
          </Link>
        </div>
        {fresh.length > 0 && (
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-soft">
              Nieuw in {group.title.toLowerCase()}
            </p>
            <div className="grid grid-cols-3 gap-8">
              {fresh.map((p) => (
                <Link
                  key={p.h}
                  to="/products/$handle"
                  params={{ handle: p.h }}
                  onClick={onNavigate}
                  className="group block"
                >
                  <span className="block aspect-[4/3] overflow-hidden rounded-2xl bg-secondary shadow-soft">
                    <Photo
                      product={p}
                      width={420}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      sizes="280px"
                    />
                  </span>
                  <span className="mt-3 line-clamp-1 block text-sm font-medium">{p.t}</span>
                  <span className="text-sm text-muted-foreground">{money(p.p)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Zoeken: begint als icoon en klapt in de header uit tot een volledig invoerveld met live suggesties. */
function InlineSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const found = useMemo(() => searchProducts(q), [q]);
  const cols = useMemo(
    () =>
      q.trim().length > 1
        ? [...GROUPS, ...SUBS]
            .filter((c) => c.title.toLowerCase().includes(q.trim().toLowerCase()))
            .slice(0, 3)
        : [],
    [q],
  );
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const go = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;
    onClose();
    void navigate({ to: "/zoeken", search: { q: q.trim() } });
  };
  return (
    <div
      className="search-in absolute inset-0 z-30 bg-background"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-3 sm:px-4 lg:px-6">
        <form
          onSubmit={go}
          role="search"
          className="flex h-11 flex-1 items-center gap-3 rounded-full border border-ink bg-white px-5 shadow-soft"
        >
          <Search className="h-5 w-5 shrink-0 text-soft" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Probeer "stevige winterboots onder €40"'
            aria-label="Zoek producten"
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-soft"
          />
        </form>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zoeken sluiten"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-secondary active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="menu-panel absolute inset-x-0 top-full border-b border-border bg-background shadow-[0_24px_40px_-24px_rgba(20,20,19,0.25)]">
        <div className="mx-auto max-h-[70vh] max-w-3xl overflow-y-auto px-4 py-4">
          {!q.trim() && (
            <div className="p-2 text-sm text-muted-foreground">
              <p className="mb-3 font-semibold text-ink">Populair</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "zwarte laarzen",
                  "sneakers onder €25",
                  "festival boots",
                  "pantoffels",
                  "tas roze",
                  "sale",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-ink hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {cols.map((c) => (
            <Link
              key={c.slug}
              to="/collectie/$slug"
              params={{ slug: c.slug }}
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-secondary"
            >
              <span className="font-semibold">{c.title}</span>
              <span className="text-xs text-soft">Categorie · {countIn(c.slug)}</span>
            </Link>
          ))}
          {q.trim() &&
            found.results.slice(0, 6).map((p) => (
              <Link
                key={p.h}
                to="/products/$handle"
                params={{ handle: p.h }}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary"
              >
                <Photo
                  product={p}
                  width={120}
                  className="h-12 w-10 rounded object-cover"
                  sizes="40px"
                />
                <span className="line-clamp-1 flex-1 text-sm">{p.t}</span>
                <span className="text-sm font-semibold">{money(p.p)}</span>
              </Link>
            ))}
          {q.trim() && found.results.length === 0 && cols.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">
              Geen resultaten voor “{q}”. Probeer een kleur, soort of maximumprijs.
            </p>
          )}
          {found.results.length > 6 && (
            <button
              type="button"
              onClick={() => go()}
              className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-primary-text hover:bg-secondary"
            >
              Alle {found.results.length} resultaten bekijken →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const iconBtn =
  "relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:-translate-y-0.5 hover:bg-secondary active:scale-90 sm:h-10 sm:w-10";

/**
 * Winkelwagen: het icoon is er altijd. Zodra er items in zitten blijft er een balk met aantal en
 * bedrag naast staan; bij toevoegen "popt" de knop even. Icoon en balk zijn één element, dus het
 * icoon heeft altijd zijn eigen achtergrond en kan nooit verdwijnen.
 */
function CartButton() {
  const { count, net, addTick, setOpen } = useCart();
  const [pop, setPop] = useState(false);
  const seen = useRef(addTick);
  useEffect(() => {
    if (addTick === seen.current) return;
    seen.current = addTick;
    setPop(true);
    const t = setTimeout(() => setPop(false), 650);
    return () => clearTimeout(t);
  }, [addTick]);

  const filled = count > 0;
  const full = `${count} ${count === 1 ? "item" : "items"} · ${money(net)}`;
  const short = `${count} · ${money(net)}`;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cart-target
        aria-label={`Winkelwagen, ${filled ? full : "leeg"}`}
        className={cn(
          "relative flex h-9 items-center rounded-full transition-[background-color,color,box-shadow,padding] duration-300 sm:h-10",
          filled
            ? "glass border border-ink/15 pl-3.5 text-ink shadow-soft hover:border-ink"
            : "text-ink hover:bg-secondary active:scale-90",
          pop && "cart-pop",
        )}
      >
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap text-xs font-semibold transition-[max-width,opacity] duration-300 motion-reduce:transition-none",
            filled ? "max-w-[220px] pr-1 opacity-100" : "max-w-0 opacity-0",
          )}
        >
          <span className="sm:hidden">{short}</span>
          <span className="hidden sm:inline">{full}</span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
          <ShoppingBag className="h-5 w-5" />
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {pop ? `Toegevoegd aan winkelwagen. ${full}` : ""}
      </span>
    </>
  );
}

/** Account: outline-icoon, of de initiaal van de ingelogde klant. */
function AccountButton() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.["full_name"] as string | undefined) || user?.email || "";
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <Link
      to={user ? "/account" : "/inloggen"}
      className={iconBtn}
      aria-label={user ? `Mijn account (${name})` : "Inloggen"}
    >
      {user && initial ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
          {initial}
        </span>
      ) : (
        <User className="h-5 w-5" />
      )}
    </Link>
  );
}

export function Header() {
  const { user } = useAuth();
  const { count: cartCount } = useCart();
  const { handles: favs } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sticky, maar slim: weg bij naar beneden scrollen, terug bij omhoog scrollen
  const lastY = useRef(0);
  useEffect(() => {
    lastY.current = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const dy = y - lastY.current;
      if (y < 160 || dy < -6) setHidden(false);
      else if (dy > 6) setHidden(true);
      if (Math.abs(dy) > 6) lastY.current = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu((m) => {
        if (m)
          document
            .querySelector<HTMLElement>(`nav[aria-label="Hoofdmenu"] a[aria-expanded="true"]`)
            ?.focus();
        return null;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMenu = (slug: string | null) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(slug);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };

  return (
    <>
      <Announcement />
      {searchOpen && (
        <div
          aria-hidden="true"
          onClick={() => setSearchOpen(false)}
          className="fixed inset-0 z-30 bg-ink/25 animate-in fade-in"
        />
      )}
      <header
        className={cn(
          "site-header sticky top-0 z-40 border-b transition-[transform,background-color,box-shadow,border-color] duration-[260ms] focus-within:translate-y-0",
          hidden && !menu && !searchOpen && !mobileOpen && "-translate-y-full",
          scrolled
            ? "border-border bg-background/85 shadow-sm backdrop-blur-md"
            : "border-transparent bg-background",
        )}
        onMouseLeave={scheduleClose}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(null);
        }}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-1 px-3 transition-all sm:gap-6 sm:px-4 xl:gap-12 duration-[260ms] lg:px-6",
            scrolled ? "py-2" : "py-4",
          )}
        >
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              className={iconBtn}
              aria-label="Menu openen"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <Logo compactOnMobile={cartCount > 0} />
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Hoofdmenu">
            {GROUPS.map((g) => (
              <div
                key={g.slug}
                onMouseEnter={() => openMenu(g.slug)}
                onFocus={() => openMenu(g.slug)}
              >
                <Link
                  to="/collectie/$slug"
                  params={{ slug: g.slug }}
                  onClick={() => setMenu(null)}
                  aria-expanded={menu === g.slug}
                  aria-haspopup="true"
                  onKeyDown={(e) => {
                    // Pijl omlaag gaat het uitklapmenu in; Escape (hieronder) sluit het weer
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      openMenu(g.slug);
                      requestAnimationFrame(() =>
                        document.querySelector<HTMLElement>("[data-mega-panel] a")?.focus(),
                      );
                    }
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-[0.95rem] font-semibold text-ink"
                >
                  <span className="link-underline" data-active={menu === g.slug}>
                    {g.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      menu === g.slug && "rotate-180",
                    )}
                  />
                </Link>
              </div>
            ))}
            <Link
              to="/collectie/$slug"
              params={{ slug: "sale" }}
              onMouseEnter={() => openMenu(null)}
              className="px-4 py-2 text-[0.95rem] font-semibold text-primary-text"
            >
              <span className="link-underline">Sale</span>
            </Link>
            <Link
              to="/cadeaubon"
              className="hidden px-4 py-2 text-[0.95rem] font-semibold text-ink xl:block"
            >
              <span className="link-underline">Cadeaubon</span>
            </Link>
          </nav>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className={iconBtn}
              aria-label="Zoeken"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/favorieten"
              className={cn(iconBtn, "hidden sm:flex")}
              aria-label={`Favorieten (${favs.length})`}
            >
              <Heart className="h-5 w-5" />
              {favs.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </Link>
            <CartButton />
            <AccountButton />
          </div>
        </div>
        {searchOpen && <InlineSearch onClose={() => setSearchOpen(false)} />}
        {menu && GROUPS.some((g) => g.slug === menu) && (
          <div onMouseEnter={() => openMenu(menu)} className="hidden lg:block">
            <MegaPanel slug={menu} onNavigate={() => setMenu(null)} />
          </div>
        )}
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[88%] overflow-y-auto bg-background p-0">
          <SheetHeader className="border-b border-border p-4 text-left">
            <SheetTitle className="font-display font-extrabold">Menu</SheetTitle>
            <SheetDescription className="sr-only">Navigeer door de winkel</SheetDescription>
          </SheetHeader>
          <div className="p-2">
            {GROUPS.map((g) => (
              <details key={g.slug} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-4 font-display text-lg font-bold">
                  {g.title}
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="pb-3 pl-3">
                  <li>
                    <Link
                      to="/collectie/$slug"
                      params={{ slug: g.slug }}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm font-semibold"
                    >
                      Alles in {g.title.toLowerCase()}
                    </Link>
                  </li>
                  {SUBS.filter((s) => s.group === g.slug).map((s) => (
                    <li key={s.slug}>
                      <Link
                        to="/collectie/$slug"
                        params={{ slug: s.slug }}
                        onClick={() => setMobileOpen(false)}
                        className="flex justify-between px-3 py-2 text-sm text-muted-foreground"
                      >
                        {s.title}
                        <span className="text-xs">{countIn(s.slug)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            {[
              { to: "/collectie/$slug", slug: "sale", label: "Sale", cls: "text-primary-text" },
              { to: "/collectie/$slug", slug: "nieuw", label: "Nieuw binnen", cls: "" },
            ].map((l) => (
              <Link
                key={l.slug}
                to="/collectie/$slug"
                params={{ slug: l.slug }}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block border-b border-border px-3 py-4 font-display text-lg font-bold",
                  l.cls,
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="space-y-1 px-3 py-4 text-sm">
              <Link
                to="/cadeaubon"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium"
              >
                Cadeaubon
              </Link>
              <Link
                to="/maatadvies"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium"
              >
                Maatadvies
              </Link>
              <Link
                to="/favorieten"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium"
              >
                Favorieten
              </Link>
              <Link
                to={user ? "/account" : "/inloggen"}
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium"
              >
                {user ? "Mijn account" : "Inloggen of registreren"}
              </Link>
              <Link
                to="/verzending-retour"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium"
              >
                Verzending & retour
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
