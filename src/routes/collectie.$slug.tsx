import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowUp, SlidersHorizontal, LayoutGrid, List, X } from "lucide-react";
import {
  IconBag,
  IconBigBag,
  IconBoot,
  IconBox,
  IconGem,
  IconSlipper,
  IconSneaker,
  IconTrail,
  IconWallet,
} from "@/components/site/icons";

type LucideIcon = (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
import { useEffect, useMemo, useState } from "react";
import { collapseVariants } from "@/lib/variants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  applyFilters,
  COLLECTIONS,
  countIn,
  facets,
  getCollection,
  inCollection,
  money,
  SUBS,
  type Sort,
} from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { KiyohBadge, ProductGrid } from "@/components/site/product";
import { SaleHero, SaleUgc } from "@/components/site/SaleHero";
import { cn } from "@/lib/utils";

type Search = {
  kleur?: string[] | undefined;
  maat?: string | undefined;
  max?: number | undefined;
  sale?: boolean | undefined;
  sort?: Sort | undefined;
};
const SORTS: { v: Sort; l: string }[] = [
  { v: "nieuw", l: "Nieuwste eerst" },
  { v: "prijs-oplopend", l: "Prijs: laag naar hoog" },
  { v: "prijs-aflopend", l: "Prijs: hoog naar laag" },
  { v: "korting", l: "Hoogste korting eerst" },
];

const SEO: Record<string, string> = {
  schoenen:
    "Bij GoedkopeSchoenen.com vind je dameslaarzen, sneakers, boots en pantoffels vanaf €8,99. Van stoere festivalboots tot zachte instappers: alles in de maten 36 t/m 41 (een deel ook groter), op werkdagen voor 15:00 besteld is dezelfde dag onderweg.",
  tassen:
    "Van een compact telefoontasje tot een ruime shopper: onze tassen zijn handig, trendy en prettig geprijsd. Ideaal als aanvulling op je nieuwe laarzen of sneakers.",
  accessoires:
    "Portemonnees, pasjeshouders en sieraden: de kleine extra's die je outfit afmaken, zonder dat je de hoofdprijs betaalt.",
  laarzen:
    "Dameslaarzen in leatherlook, suèdine en meer, van enkellaarsjes tot hoge cowboylaarzen. Kies je kleur en maat en bekijk meteen wat nog op voorraad is.",
  sneakers:
    "Casual sneakers, retro modellen en air sneakers in veel kleuren, betaalbaar en comfortabel genoeg voor de hele dag.",
  sale: "In de sale vind je schoenen en tassen met echt voordeel: bij elk product zie je de oude prijs en wat je bespaart.",
};

export const Route = createFileRoute("/collectie/$slug")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    const kleur = Array.isArray(s["kleur"])
      ? s["kleur"].map(String)
      : s["kleur"]
        ? [String(s["kleur"])]
        : undefined;
    if (kleur?.length) out.kleur = kleur;
    if (s["maat"]) out.maat = String(s["maat"]);
    if (Number(s["max"]) > 0) out.max = Number(s["max"]);
    if (s["sale"] === true || s["sale"] === "true") out.sale = true;
    if (SORTS.some((x) => x.v === s["sort"])) out.sort = s["sort"] as Sort;
    return out;
  },
  loader: ({ params }) => {
    const c = getCollection(params.slug);
    if (!c) throw notFound();
    return { slug: c.slug };
  },
  head: ({ params }) => {
    const c = getCollection(params.slug);
    const title = c
      ? `${c.title} kopen — GoedkopeSchoenen.com`
      : "Collectie — GoedkopeSchoenen.com";
    const desc = c ? `${c.blurb} ${countIn(c.slug)} producten, gratis verzending vanaf €65.` : "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
      links: [{ rel: "canonical", href: `${SITE.url}/collectie/${params.slug}` }],
      scripts: c
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { name: "Home", item: SITE.url },
                  ...(c.cat && c.group && getCollection(c.group)
                    ? [
                        {
                          name: getCollection(c.group)!.title,
                          item: `${SITE.url}/collectie/${c.group}`,
                        },
                      ]
                    : []),
                  { name: c.title, item: `${SITE.url}/collectie/${c.slug}` },
                ].map((e, i) => ({ "@type": "ListItem", position: i + 1, ...e })),
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">Deze collectie bestaat niet</h1>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-cta px-6 py-3 font-semibold text-white"
      >
        Naar de homepage
      </Link>
    </div>
  ),
  component: CollectionPage,
});

const PAGE = 24;

/** Zachte accentkleur per hoofdcategorie (donker genoeg voor witte tekst); sale/nieuw houden de huisstijl. */
const THEME: Record<string, { color: string; tint: string; Icon: LucideIcon }> = {
  schoenen: { color: "#7a5238", tint: "#f3ebe3", Icon: IconBoot },
  tassen: { color: "#b8603c", tint: "#f8e9df", Icon: IconBag },
  accessoires: { color: "#8a6d1f", tint: "#f5eedb", Icon: IconGem },
};
const SUB_ICON: Record<string, LucideIcon> = {
  laarzen: IconBoot,
  sneakers: IconSneaker,
  "boots-festival": IconTrail,
  pantoffels: IconSlipper,
  "overig-schoenen": IconBox,
  schoudertasjes: IconBag,
  "grote-tassen": IconBigBag,
  portemonnees: IconWallet,
  sieraden: IconGem,
};
const catBtn = "border-[var(--cat,var(--ink))] bg-[var(--cat,var(--ink))] text-white";

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-label="Terug naar boven"
      className="fixed bottom-24 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-ink shadow-lift transition hover:-translate-y-0.5 sm:bottom-24"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

function CollectionPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const collection = getCollection(slug)!;
  const base = useMemo(() => inCollection(collection), [collection]);
  const fac = useMemo(() => facets(base), [base]);
  const isSale = slug === "sale";
  const sort: Sort = search.sort ?? (isSale ? "korting" : "nieuw");
  const filtered = useMemo(() => applyFilters(base, { ...search, sort }), [base, search, sort]);
  // Eén kaart per model met kleurstipjes; filter je op kleur, dan zie je juist die varianten
  const list = useMemo(
    () => (search.kleur?.length ? filtered : collapseVariants(filtered)),
    [filtered, search.kleur],
  );

  const set = (patch: Partial<Search>) => {
    setShown(PAGE);
    void navigate({ search: (prev) => ({ ...prev, ...patch }) as Search, replace: true });
  };
  // Filters alleen tonen wanneer ze echte keuze bieden (CLAUDE.md §7.2)
  const showFilters = base.length >= 10;
  const subs =
    collection.group && !collection.cat ? SUBS.filter((s) => s.group === collection.group) : [];
  const siblings = collection.cat ? SUBS.filter((s) => s.group === collection.group) : [];
  const activeCount =
    (search.kleur?.length ?? 0) +
    (search.maat ? 1 : 0) +
    (search.max ? 1 : 0) +
    (search.sale ? 1 : 0);
  const group = collection.group ? COLLECTIONS.find((c) => c.slug === collection.group) : undefined;

  const theme = THEME[collection.group ?? collection.slug];
  const crumbs = [
    ...(collection.cat && group ? [{ label: group.title, slug: group.slug }] : []),
    { label: collection.title },
  ];

  return (
    <div
      className={isSale ? "sale-theme" : undefined}
      style={
        theme
          ? ({ "--cat": theme.color, "--cat-tint": theme.tint } as React.CSSProperties)
          : undefined
      }
    >
      <Breadcrumbs items={crumbs} />
      {isSale && <SaleHero count={base.length} />}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-4 lg:px-6">
        <div
          className={cn(
            "relative flex flex-col justify-between gap-4 overflow-hidden md:flex-row md:items-end",
            isSale && "hidden",
            theme && "rounded-3xl bg-[var(--cat-tint)] px-6 py-8 md:px-10 md:py-12",
          )}
        >
          {theme && (
            <theme.Icon
              aria-hidden="true"
              strokeWidth={0.6}
              className="pointer-events-none absolute -right-6 -top-6 h-64 w-64 text-[var(--cat)] opacity-[0.12] md:h-80 md:w-80"
            />
          )}
          <div className="relative">
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {collection.title}
            </h1>
            {theme && <span className="mt-3 block h-1.5 w-16 rounded-full bg-[var(--cat)]" />}
            <p className="mt-3 max-w-xl text-muted-foreground">{collection.blurb}</p>
          </div>
          <KiyohBadge className="relative" />
        </div>
        {(subs.length > 0 || siblings.length > 0) && (
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Subcategorieën">
            {(collection.cat
              ? [
                  {
                    slug: collection.group as string,
                    title: `Alle ${group?.title.toLowerCase()}`,
                    n: countIn(collection.group!),
                  },
                ]
              : []
            )
              .concat(
                (collection.cat ? siblings : subs).map((s) => ({
                  slug: s.slug,
                  title: s.title,
                  n: countIn(s.slug),
                })),
              )
              .map((s) => (
                <Link
                  key={s.slug}
                  to="/collectie/$slug"
                  params={{ slug: s.slug }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition hover:border-ink",
                    "inline-flex items-center gap-1.5",
                    s.slug === slug ? catBtn : "border-border bg-white",
                  )}
                >
                  {(() => {
                    const I = SUB_ICON[s.slug] ?? theme?.Icon;
                    return I ? <I className="h-4 w-4" aria-hidden="true" /> : null;
                  })()}
                  {s.title} <span className="opacity-60">{s.n}</span>
                </Link>
              ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="sticky top-[60px] z-30 -mx-4 flex items-center justify-between gap-3 border-y border-border bg-background/90 px-4 py-3 backdrop-blur lg:mx-0 lg:rounded-none lg:px-0">
          <div className="flex items-center gap-3">
            {showFilters && (
              <button
                type="button"
                onClick={() => setPanel(true)}
                className="flex items-center gap-2 rounded-full border border-[var(--cat,var(--border))]/50 bg-white px-4 py-2 text-sm font-semibold transition hover:border-[var(--cat,var(--ink))]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-cta px-1.5 text-xs text-white">
                    {activeCount}
                  </span>
                )}
              </button>
            )}
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {list.length} producten
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="hidden rounded-full border border-border bg-white p-1 sm:flex"
              role="group"
              aria-label="Weergave"
            >
              {(
                [
                  ["grid", "Rasterweergave", LayoutGrid],
                  ["list", "Lijstweergave", List],
                ] as const
              ).map(([v, label, Icon]) => (
                <button
                  key={v}
                  type="button"
                  aria-label={label}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition",
                    view === v ? "bg-ink text-white" : "text-muted-foreground hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only sm:not-sr-only text-muted-foreground">Sorteren</span>
              <select
                value={sort}
                onChange={(e) => set({ sort: e.target.value as Sort })}
                className="h-10 rounded-full border border-border bg-white px-3 text-sm font-medium"
              >
                {SORTS.map((s) => (
                  <option key={s.v} value={s.v}>
                    {s.l}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {search.kleur?.map((k) => (
              <Chip key={k} onClick={() => set({ kleur: search.kleur!.filter((x) => x !== k) })}>
                {k}
              </Chip>
            ))}
            {search.maat && (
              <Chip onClick={() => set({ maat: undefined })}>Maat {search.maat}</Chip>
            )}
            {search.max && (
              <Chip onClick={() => set({ max: undefined })}>Tot {money(search.max)}</Chip>
            )}
            {search.sale && <Chip onClick={() => set({ sale: undefined })}>In de aanbieding</Chip>}
            <button
              type="button"
              className="text-sm font-medium underline underline-offset-4"
              onClick={() => void navigate({ search: {}, replace: true })}
            >
              Alles wissen
            </button>
          </div>
        )}

        <div className="mt-8">
          {list.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-xl font-bold">Geen producten gevonden</p>
              <p className="mt-1 text-muted-foreground">Pas je filters aan om meer te zien.</p>
              <button
                type="button"
                onClick={() => void navigate({ search: {}, replace: true })}
                className="mt-5 rounded-full bg-cta px-6 py-3 text-sm font-semibold text-white"
              >
                Filters wissen
              </button>
            </div>
          ) : (
            <ProductGrid products={list.slice(0, shown)} eagerCount={4} view={view} sale={isSale} />
          )}
          {list.length > shown && (
            <div className="mt-12 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                {shown} van {list.length} getoond
              </p>
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE)}
                className="rounded-full border border-ink px-8 py-3 text-sm font-semibold transition hover:bg-ink hover:text-white"
              >
                Toon meer
              </button>
            </div>
          )}
        </div>

        {isSale && <SaleUgc />}
        {SEO[slug] && (
          <div className="mx-auto mt-20 max-w-3xl border-t border-border pt-10 text-sm leading-relaxed text-muted-foreground">
            <h2 className="mb-2 font-display text-lg font-bold text-ink">
              Over {collection.title.toLowerCase()}
            </h2>
            <p>{SEO[slug]}</p>
          </div>
        )}
      </section>

      <Sheet open={panel} onOpenChange={setPanel}>
        <SheetContent
          side="left"
          className="flex w-[90%] flex-col gap-0 bg-background p-0 sm:max-w-sm"
        >
          <SheetHeader className="border-b border-border p-5 text-left">
            <SheetTitle className="font-display font-extrabold">Filters</SheetTitle>
            <SheetDescription className="sr-only">Verfijn de producten</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-7 overflow-y-auto p-5">
            <label className="flex cursor-pointer items-center justify-between text-sm font-semibold">
              In de aanbieding
              <input
                type="checkbox"
                checked={!!search.sale}
                onChange={(e) => set({ sale: e.target.checked || undefined })}
                className="h-5 w-5 accent-[var(--primary)]"
              />
            </label>
            <fieldset>
              <legend className="mb-3 text-sm font-bold">
                Maximumprijs: {money(search.max ?? fac.maxPrice)}
              </legend>
              <input
                type="range"
                min={Math.min(10, fac.maxPrice)}
                max={fac.maxPrice}
                step={1}
                value={search.max ?? fac.maxPrice}
                onChange={(e) =>
                  set({
                    max:
                      Number(e.target.value) >= fac.maxPrice ? undefined : Number(e.target.value),
                  })
                }
                className="w-full accent-[var(--primary)]"
                aria-label="Maximumprijs"
              />
            </fieldset>
            {fac.colors.length > 1 && (
              <fieldset>
                <legend className="mb-3 text-sm font-bold">Kleur</legend>
                <div className="flex flex-wrap gap-2">
                  {fac.colors.map((c) => {
                    const on = search.kleur?.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        type="button"
                        aria-pressed={!!on}
                        onClick={() =>
                          set({
                            kleur: on
                              ? search.kleur!.filter((x) => x !== c.name)
                              : [...(search.kleur ?? []), c.name],
                          })
                        }
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm transition",
                          on ? catBtn : "border-border bg-white hover:border-ink",
                        )}
                      >
                        {c.name} <span className="opacity-60">{c.n}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
            {fac.sizes.length > 1 && (
              <fieldset>
                <legend className="mb-3 text-sm font-bold">Maat</legend>
                <div className="flex flex-wrap gap-2">
                  {fac.sizes.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      aria-pressed={search.maat === s.name}
                      onClick={() => set({ maat: search.maat === s.name ? undefined : s.name })}
                      className={cn(
                        "h-10 min-w-10 rounded-lg border px-2 text-sm font-medium transition",
                        search.maat === s.name ? catBtn : "border-border bg-white hover:border-ink",
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
          <div className="border-t border-border p-5">
            <button
              type="button"
              onClick={() => setPanel(false)}
              className="w-full rounded-full bg-cta py-3.5 text-sm font-semibold text-white transition "
            >
              Toon {list.length} producten
            </button>
          </div>
        </SheetContent>
      </Sheet>
      <BackToTop />
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium transition hover:bg-border"
    >
      {children}
      <X className="h-3.5 w-3.5" />
      <span className="sr-only">filter verwijderen</span>
    </button>
  );
}
