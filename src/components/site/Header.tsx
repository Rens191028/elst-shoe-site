import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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

type MenuColumn = { title: string; items: string[] };
const MEGA: Record<string, MenuColumn[]> = {
  schoenen: [
    { title: "Laarzen & boots", items: ["laarzen", "boots-festival"] },
    { title: "Sneakers", items: ["sneakers"] },
    { title: "Instappers & meer", items: ["pantoffels", "overig-schoenen"] },
  ],
  tassen: [{ title: "Tassen", items: ["schoudertasjes", "grote-tassen"] }],
  accessoires: [{ title: "Accessoires", items: ["portemonnees", "sieraden"] }],
};

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

function MegaPanel({ slug, onNavigate }: { slug: string; onNavigate: () => void }) {
  const group = GROUPS.find((g) => g.slug === slug)!;
  const fresh = useMemo(() => inCollection(group).filter((p) => p.s), [group]);
  const feature = fresh[0];
  const row = fresh.slice(1, 5);
  return (
    <div className="menu-panel absolute inset-x-0 top-full border-b border-border bg-background shadow-[0_24px_40px_-24px_rgba(20,20,19,0.25)]">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_280px] gap-10 px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {MEGA[slug]?.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-soft">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.items.map((s) => {
                  const sub = SUBS.find((x) => x.slug === s)!;
                  return (
                    <li key={s}>
                      <Link
                        to="/collectie/$slug"
                        params={{ slug: s }}
                        onClick={onNavigate}
                        className="group flex items-baseline gap-2 text-[0.95rem] font-medium text-ink hover:text-primary"
                      >
                        {sub.title}
                        <span className="text-xs font-normal text-soft">{countIn(s)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {row.length > 0 && (
            <div className="col-span-3 mt-2">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-soft">
                Nieuw in {group.title.toLowerCase()}
              </p>
              <div className="grid grid-cols-4 gap-3">
                {row.map((p) => (
                  <Link
                    key={p.h}
                    to="/products/$handle"
                    params={{ handle: p.h }}
                    onClick={onNavigate}
                    className="group block"
                  >
                    <span className="block aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
                      <Photo
                        product={p}
                        width={240}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        sizes="120px"
                      />
                    </span>
                    <span className="mt-1.5 line-clamp-1 block text-xs font-medium">{p.t}</span>
                    <span className="text-xs text-muted-foreground">{money(p.p)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="col-span-3 mt-2 flex gap-5 border-t border-border pt-4 text-sm">
            <Link
              to="/collectie/$slug"
              params={{ slug }}
              onClick={onNavigate}
              className="font-semibold text-ink underline-offset-4 hover:underline"
            >
              Alles in {group.title.toLowerCase()} ({countIn(slug)})
            </Link>
            <Link
              to="/collectie/$slug"
              params={{ slug: "sale" }}
              onClick={onNavigate}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Bekijk de sale
            </Link>
          </div>
        </div>
        {feature && (
          <Link
            to="/products/$handle"
            params={{ handle: feature.h }}
            onClick={onNavigate}
            className="group relative block overflow-hidden rounded-2xl bg-secondary"
          >
            <Photo
              product={feature}
              width={400}
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
              sizes="280px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
                Uitgelicht
              </p>
              <p className="line-clamp-1 text-sm font-semibold">{feature.t}</p>
              <p className="text-sm">{money(feature.p)}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
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
  const go = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;
    onOpenChange(false);
    void navigate({ to: "/zoeken", search: { q: q.trim() } });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12%] max-w-2xl translate-y-0 gap-0 overflow-hidden p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Zoeken</DialogTitle>
        <DialogDescription className="sr-only">
          Zoek in ons assortiment van 750 producten
        </DialogDescription>
        <form
          onSubmit={go}
          className="flex items-center gap-3 border-b border-border px-4"
          role="search"
        >
          <Search className="h-5 w-5 text-soft" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Probeer "stevige winterboots onder €40"'
            aria-label="Zoek producten"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-soft"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Sluiten"
            className="rounded-full p-1.5 hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!q.trim() && (
            <div className="p-3 text-sm text-muted-foreground">
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
              onClick={() => onOpenChange(false)}
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
                onClick={() => onOpenChange(false)}
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
              className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-primary hover:bg-secondary"
            >
              Alle {found.results.length} resultaten bekijken →
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const iconBtn =
  "relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:-translate-y-0.5 hover:bg-secondary active:scale-90 sm:h-10 sm:w-10";

/** Winkelwagen: klapt bij het toevoegen kort uit tot een balk met aantal en totaal. */
function CartButton() {
  const { count, subtotal, addTick, setOpen } = useCart();
  const [expanded, setExpanded] = useState(false);
  const seen = useRef(addTick);
  useEffect(() => {
    if (addTick === seen.current) return;
    seen.current = addTick;
    setExpanded(true);
    const t = setTimeout(() => setExpanded(false), 2800);
    return () => clearTimeout(t);
  }, [addTick]);

  const label = `${count} ${count === 1 ? "item" : "items"} · ${money(subtotal)}`;
  return (
    <div className="relative h-9 w-9 sm:h-10 sm:w-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Winkelwagen, ${label}`}
        className={cn(
          "absolute right-0 top-0 z-10 flex h-full items-center justify-end overflow-hidden rounded-full text-ink transition-[max-width,background-color,color,box-shadow] duration-300 ease-out motion-reduce:transition-none",
          expanded
            ? "max-w-[240px] bg-cta pl-4 text-white shadow-lift"
            : "max-w-9 hover:bg-secondary sm:max-w-10",
        )}
      >
        <span
          className={cn(
            "whitespace-nowrap text-xs font-semibold transition-opacity duration-200",
            expanded ? "pr-1.5 opacity-100" : "w-0 opacity-0",
          )}
        >
          {label}
        </span>
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && !expanded && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
              {count}
            </span>
          )}
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {expanded ? `Toegevoegd aan winkelwagen. ${label}` : ""}
      </span>
    </div>
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
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
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-[transform,background-color,box-shadow,border-color] duration-[260ms] focus-within:translate-y-0",
          hidden && !menu && !searchOpen && !mobileOpen && "-translate-y-full",
          scrolled
            ? "border-border bg-background/85 shadow-sm backdrop-blur-md"
            : "border-transparent bg-background",
        )}
        onMouseLeave={scheduleClose}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-1 px-3 transition-all sm:gap-4 sm:px-4 duration-[260ms] lg:px-6",
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
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Hoofdmenu">
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
              className="px-4 py-2 text-[0.95rem] font-semibold text-primary"
            >
              <span className="link-underline">Sale</span>
            </Link>
          </nav>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Zoeken"
              className="mr-2 hidden h-10 w-56 items-center gap-2 rounded-full border border-border bg-white px-4 text-left text-sm text-soft transition hover:border-ink xl:flex"
            >
              <Search className="h-4 w-4 shrink-0" />
              Zoek producten…
            </button>
            <button
              type="button"
              className={cn(iconBtn, "xl:hidden")}
              aria-label="Zoeken"
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
        {menu && MEGA[menu] && (
          <div onMouseEnter={() => openMenu(menu)} className="hidden lg:block">
            <MegaPanel slug={menu} onNavigate={() => setMenu(null)} />
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

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
              { to: "/collectie/$slug", slug: "sale", label: "Sale", cls: "text-primary" },
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
