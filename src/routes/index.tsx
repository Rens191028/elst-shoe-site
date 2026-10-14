import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  CreditCard,
  MessageCircle,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import {
  countIn,
  getCollection,
  inCollection,
  money,
  PRODUCTS,
  SUBS,
  type Product,
} from "@/lib/catalog";
import { REVIEWS, SITE, UGC } from "@/lib/site";
import { CountUp, Reveal } from "@/components/site/motion";
import { Tilt } from "@/components/site/Tilt";
import { HeroProduct } from "@/components/site/HeroProduct";
import { Deco3D, Floaty } from "@/components/site/decor";
import { KiyohBadge, Photo, ProductCard } from "@/components/site/product";
import { cn } from "@/lib/utils";

const TITLE = "GoedkopeSchoenen.com — Betaalbare schoenen, tassen & accessoires";
const DESC =
  "Trendy schoenen, tassen en accessoires vanaf €8,99. Op werkdagen voor 15:00 besteld, dezelfde dag verzonden. Gratis verzending vanaf €65. Kiyoh-score 9,3.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE.url },
    ],
    links: [{ rel: "canonical", href: SITE.url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: SITE.name,
          url: SITE.url,
          email: SITE.email,
          telephone: SITE.phone,
          foundingDate: String(SITE.founded),
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.address.street,
            postalCode: SITE.address.zip,
            addressLocality: SITE.address.city,
            addressCountry: "NL",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: SITE.kiyoh.score,
            bestRating: 10,
            ratingCount: SITE.kiyoh.count,
          },
        }),
      },
    ],
  }),
});

const HERO_PRODUCT =
  PRODUCTS.find((p) => p.c === "laarzen" && p.s && p.w && p.p >= 39) ??
  PRODUCTS.find((p) => p.s) ??
  PRODUCTS[0]!;

const RAIL = [
  { slug: "laarzen", label: "Laarzen" },
  { slug: "sneakers", label: "Sneakers" },
  { slug: "tassen", label: "Tassen" },
  { slug: "accessoires", label: "Accessoires" },
  { slug: "sale", label: "Sale" },
];

function tileImage(slug: string): Product | undefined {
  const c = getCollection(slug);
  if (!c) return undefined;
  return inCollection(c).find((p) => p.s);
}

const USPS = [
  {
    icon: Truck,
    title: `Gratis verzending vanaf ${money(SITE.freeShippingFrom)}`,
    text: "Daaronder slechts " + money(SITE.shippingCost) + ".",
  },
  {
    icon: CreditCard,
    title: "Achteraf betalen met Klarna",
    text: "Ook iDEAL, creditcard en Bancontact.",
  },
  { icon: RotateCcw, title: "30 dagen retour", text: "Past het niet? Stuur het simpel terug." },
  { icon: Clock, title: "Dezelfde dag verzonden", text: "Op werkdagen voor 15:00 besteld." },
];

const WHY = [
  {
    icon: Truck,
    title: "Snel in huis",
    text: "Op werkdagen voor 15:00 besteld verzenden we dezelfde dag met PostNL.",
  },
  {
    icon: CreditCard,
    title: "Betaal zoals jij wilt",
    text: "iDEAL, Klarna (achteraf betalen), creditcard of Bancontact.",
  },
  {
    icon: RotateCcw,
    title: "30 dagen retour",
    text: "Niet tevreden? Meld je retour en we regelen het zonder gedoe.",
  },
  {
    icon: MessageCircle,
    title: "Echte klantenservice",
    text: `Bel of app ons op ${SITE.phone}, of mail naar ${SITE.email}.`,
  },
  {
    icon: ShieldCheck,
    title: "Gratis verzending vanaf €65",
    text: "Eerlijke prijzen, zonder verrassingen aan de kassa.",
  },
  {
    icon: Clock,
    title: `Sinds ${SITE.founded} uit Elst`,
    text:
      "Begonnen op beurzen, nu een webshop met Kiyoh-score " +
      SITE.kiyoh.score.toLocaleString("nl-NL") +
      ".",
  },
];

function Index() {
  const nieuw = inCollection(getCollection("nieuw")!)
    .filter((p) => p.s)
    .slice(0, 8);
  const sale = inCollection(getCollection("sale")!)
    .filter((p) => p.s)
    .sort((a, b) => b.w! - b.p - (a.w! - a.p))
    .slice(0, 4);
  const maxPct = Math.max(
    ...PRODUCTS.filter((p) => p.w).map((p) => Math.round((1 - p.p / p.w!) * 100)),
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-8 md:pt-12 lg:grid-cols-[1.05fr_1fr] lg:px-6 lg:pb-20">
          <div className="text-center lg:text-left">
            <div className="anim-fade-up" style={{ "--i": 0 } as React.CSSProperties}>
              <KiyohBadge className="rounded-full border border-border bg-white px-4 py-2 shadow-sm" />
            </div>
            <h1
              className="anim-fade-up mt-6 text-balance font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              Mooie schoenen vanaf <span className="text-primary">€8,99</span>
            </h1>
            <p
              className="anim-fade-up mx-auto mt-5 max-w-lg text-lg text-muted-foreground lg:mx-0"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              Laarzen, sneakers, tassen en accessoires waar je blij van wordt. Vandaag besteld,
              vandaag verzonden.
            </p>
            <div
              className="anim-fade-up mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <Link
                to="/collectie/$slug"
                params={{ slug: "nieuw" }}
                className="group inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3.5 font-semibold text-white shadow-[0_8px_20px_-10px_var(--primary)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-12px_var(--primary)] active:scale-[0.98]"
              >
                Shop nu
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/collectie/$slug"
                params={{ slug: "sale" }}
                className="inline-flex items-center gap-2 rounded-full border border-ink px-7 py-3.5 font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-white active:scale-[0.98]"
              >
                Bekijk de sale
              </Link>
            </div>
            <ul
              className="anim-fade-up mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Gratis verzending vanaf €65
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Achteraf betalen met Klarna
              </li>
            </ul>
          </div>

          <div className="anim-fade-up" style={{ "--i": 2 } as React.CSSProperties}>
            <HeroProduct product={HERO_PRODUCT} />
          </div>
        </div>
      </section>

      {/* Categorieën: eerste tegel groter voor visuele hiërarchie */}
      <section aria-label="Categorieën" className="pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="snap-row -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:auto-rows-[250px] lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0">
            {RAIL.map((r, i) => {
              const p = tileImage(r.slug);
              return (
                <Reveal
                  key={r.slug}
                  index={i}
                  className={cn(
                    "w-[42%] shrink-0 sm:w-[28%] lg:w-auto",
                    i === 0 && "lg:col-span-2 lg:row-span-2",
                  )}
                >
                  <Tilt max={7} className="h-full" innerClassName="h-full">
                    <Link
                      to="/collectie/$slug"
                      params={{ slug: r.slug }}
                      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-secondary shadow-soft transition duration-300 hover:shadow-lift lg:aspect-auto lg:h-full"
                    >
                      {p && (
                        <Photo
                          product={p}
                          width={i === 0 ? 800 : 500}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          sizes={
                            i === 0
                              ? "(min-width:1024px) 50vw, 42vw"
                              : "(min-width:1024px) 25vw, 42vw"
                          }
                        />
                      )}
                      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                      <span className="absolute inset-x-0 bottom-0 p-4 text-white lg:p-6">
                        <span
                          className={cn(
                            "block font-display font-extrabold",
                            i === 0 ? "text-lg lg:text-3xl" : "text-lg",
                          )}
                        >
                          {r.label}
                        </span>
                        <span className="text-xs text-white/80">{countIn(r.slug)} producten</span>
                      </span>
                    </Link>
                  </Tilt>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nieuw binnen */}
      <section className="bg-white py-20 md:py-24" aria-labelledby="nieuw-h">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 id="nieuw-h" className="font-display text-3xl tracking-tight md:text-5xl">
                Nieuw binnen
              </h2>
              <p className="mt-2 text-muted-foreground">
                De nieuwste aanwinsten in onze collectie.
              </p>
            </div>
            <Link
              to="/collectie/$slug"
              params={{ slug: "nieuw" }}
              className="hidden text-sm font-semibold underline-offset-4 hover:text-primary hover:underline sm:block"
            >
              Alles bekijken →
            </Link>
          </div>
          <div className="snap-row -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-x-4 md:gap-y-8 md:overflow-visible md:px-0">
            {nieuw.map((p, i) => (
              <Reveal key={p.h} index={i % 4} className="w-[62%] shrink-0 sm:w-[40%] md:w-auto">
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* USP-balk: groot en prominent */}
      <section className="bg-ink text-white" aria-label="Onze beloftes">
        <ul className="mx-auto grid max-w-7xl gap-px px-4 py-14 sm:grid-cols-2 md:py-16 lg:grid-cols-4 lg:px-6">
          {USPS.map((u, i) => (
            <Reveal
              as="li"
              key={u.title}
              index={i}
              className="flex flex-col items-start gap-4 rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/5"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cta text-white">
                <u.icon className="h-7 w-7" />
              </span>
              <span>
                <span className="block font-display text-xl font-extrabold">{u.title}</span>
                <span className="mt-1 block text-white/70">{u.text}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Sale + Instagram/UGC */}
      <section className="bg-cream py-20 md:py-24" aria-labelledby="sale-h">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white shadow-lift md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-50 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
            />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                  <Tag className="h-3.5 w-3.5" /> Sale
                </p>
                <h2 id="sale-h" className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
                  Tot <span className="text-primary">-{maxPct}%</span> korting
                </h2>
                <p className="mt-3 max-w-md text-white/75">
                  {countIn("sale")} producten met voordeel. Op = op: de voorraad per maat is
                  beperkt.
                </p>
              </div>
              <Link
                to="/collectie/$slug"
                params={{ slug: "sale" }}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cta px-8 py-4 font-semibold text-white shadow-lift transition duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Shop de sale
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {sale.map((p, i) => (
              <Reveal key={p.h} index={i}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>

          {UGC.length > 0 && (
            <div className="mt-16" aria-labelledby="ugc-h">
              <div className="mb-5 flex items-end justify-between">
                <h3 id="ugc-h" className="font-display text-2xl tracking-tight">
                  Gespot op Instagram
                </h3>
                {SITE.social.instagram && (
                  <a
                    href={SITE.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold underline-offset-4 hover:text-primary hover:underline"
                  >
                    Volg ons →
                  </a>
                )}
              </div>
              <div className="snap-row -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-6 md:overflow-visible md:px-0">
                {UGC.slice(0, 6).map((u) => (
                  <a
                    key={u.href}
                    href={u.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block aspect-square w-[40%] shrink-0 overflow-hidden rounded-2xl bg-secondary shadow-soft md:w-auto"
                  >
                    <img
                      src={u.image}
                      alt={u.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Waarom bij ons kopen */}
      <section className="relative bg-white py-20 md:py-28" aria-labelledby="waarom-h">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-20 lg:px-6">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2
              id="waarom-h"
              className="text-balance font-display text-3xl tracking-tight md:text-4xl"
            >
              Waarom bij GoedkopeSchoenen kopen?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sinds {SITE.founded} een vertrouwd adres uit Elst: betaalbaar, snel en met een mens
              aan de andere kant.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-4">
              {[
                { n: PRODUCTS.length, l: "producten" },
                { n: countIn("sale"), l: "in de sale" },
                { n: SUBS.length, l: "categorieën" },
              ].map((x) => (
                <Reveal key={x.l} className="rounded-2xl bg-cream p-4 text-center shadow-soft">
                  <dd className="font-display text-3xl font-extrabold text-primary">
                    <CountUp to={x.n} />
                  </dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{x.l}</dt>
                </Reveal>
              ))}
            </dl>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <Reveal
                key={w.title}
                index={i}
                className="group relative overflow-hidden rounded-3xl border border-border bg-background p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl transition duration-500 group-hover:bg-primary/20"
                />
                <Floaty factor={i % 2 ? 0.05 : -0.05} delay={i * 0.4} className="relative w-fit">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cta text-white shadow-lift">
                    <w.icon className="h-7 w-7" />
                  </span>
                </Floaty>
                <h3 className="relative mt-5 font-display text-xl">{w.title}</h3>
                <p className="relative mt-2 text-muted-foreground">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Deco3D className="absolute -bottom-20 right-10 z-10" />
      </section>

      {/* Social proof */}
      <section className="bg-cream py-20 md:py-24" aria-labelledby="trust-h">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[360px_1fr]">
            <Reveal className="rounded-3xl bg-white p-8 text-center shadow-lift">
              <p className="font-display text-7xl font-extrabold text-primary">
                <CountUp to={SITE.kiyoh.score} decimals={1} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">gemiddeld op een schaal van 10</p>
              <p className="mt-3 flex justify-center" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </p>
              <p className="mt-3 font-semibold">
                <CountUp to={SITE.kiyoh.count} /> beoordelingen op Kiyoh
              </p>
              {SITE.kiyoh.url && (
                <a
                  href={SITE.kiyoh.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm font-semibold underline underline-offset-4 hover:text-primary"
                >
                  Lees alle beoordelingen
                </a>
              )}
            </Reveal>
            <div>
              <h2 id="trust-h" className="font-display text-3xl tracking-tight md:text-5xl">
                Klanten waarderen ons met een{" "}
                <span className="text-primary">{SITE.kiyoh.score.toLocaleString("nl-NL")}</span>
              </h2>
              {REVIEWS.length > 0 ? (
                <div className="snap-row -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0">
                  {REVIEWS.map((r, i) => (
                    <Reveal
                      key={r.name}
                      index={i}
                      className="w-[82%] shrink-0 rounded-2xl border border-border bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/50 md:w-auto"
                    >
                      <p className="text-primary" aria-label={`${r.stars} van 5 sterren`}>
                        {"★".repeat(r.stars)}
                      </p>
                      <p className="mt-3">“{r.text}”</p>
                      <p className="mt-4 text-sm font-semibold">{r.name}</p>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="mt-4 max-w-xl text-muted-foreground">
                  Onze beoordelingen worden verzameld via Kiyoh, een onafhankelijk
                  beoordelingsplatform. Vragen over een bestelling? Bel of app ons op {SITE.phone}.
                </p>
              )}
              <p className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm text-muted-foreground shadow-soft">
                {SITE.name} · {SITE.address.street}, {SITE.address.zip} {SITE.address.city} · KvK{" "}
                {SITE.kvk} · BTW {SITE.btw}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Maatadvies */}
      <section className="mx-auto max-w-7xl px-4 pt-20 lg:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-secondary p-8 md:flex-row md:items-center md:p-12">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
              <Ruler className="h-6 w-6 text-primary" />
            </span>
            <div>
              <h2 className="font-display text-2xl md:text-3xl">Twijfel je over je maat?</h2>
              <p className="mt-1 max-w-lg text-muted-foreground">
                Meet je voet in een minuut en ontvang een maatadvies. Minder retouren, meer plezier.
              </p>
            </div>
          </div>
          <Link
            to="/maatadvies"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary"
          >
            Naar het maatadvies
          </Link>
        </div>
      </section>
    </>
  );
}
