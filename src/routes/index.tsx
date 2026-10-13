import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, CreditCard, Ruler, ShieldCheck, Truck } from "lucide-react";
import {
  countIn,
  getCollection,
  inCollection,
  money,
  PRODUCTS,
  SUBS,
  type Product,
} from "@/lib/catalog";
import { REVIEWS, SITE } from "@/lib/site";
import { CountUp, Reveal } from "@/components/site/motion";
import { Tilt } from "@/components/site/Tilt";
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
  { icon: Truck, title: "Dezelfde dag verzonden", text: "Op werkdagen voor 15:00 besteld" },
  { icon: CreditCard, title: "Achteraf betalen", text: "Met Klarna, ook iDEAL & Bancontact" },
  { icon: ShieldCheck, title: "Gratis verzending", text: `Vanaf ${money(SITE.freeShippingFrom)}` },
  { icon: Clock, title: `Sinds ${SITE.founded}`, text: "Bekend van beurzen en tijdschriften" },
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
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white shadow-[0_8px_20px_-10px_var(--primary)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_14px_26px_-12px_var(--primary)] active:scale-[0.98]"
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

          <div
            className="anim-fade-up relative mx-auto w-full max-w-md"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <Tilt>
              <Link
                to="/products/$handle"
                params={{ handle: HERO_PRODUCT.h }}
                className="hero-surface relative block aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_30px_50px_-24px_rgba(20,20,19,0.35)]"
                aria-label={`Bekijk ${HERO_PRODUCT.t}`}
              >
                <Photo
                  product={HERO_PRODUCT}
                  width={800}
                  eager
                  className="h-full w-full object-cover"
                  sizes="(min-width:1024px) 440px, 90vw"
                />
              </Link>
              <div className="absolute -left-4 bottom-8 hidden rounded-2xl bg-white px-4 py-3 shadow-xl [transform:translateZ(60px)] sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-soft">Nu</p>
                <p className="font-display text-xl font-extrabold text-primary">
                  {money(HERO_PRODUCT.p)}
                </p>
                {HERO_PRODUCT.w && (
                  <p className="text-xs text-soft line-through">{money(HERO_PRODUCT.w)}</p>
                )}
              </div>
              <div className="absolute -right-3 top-8 hidden items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-white shadow-xl [transform:translateZ(80px)] sm:flex">
                <Truck className="h-4 w-4" />
                <span className="text-xs font-semibold">Vandaag nog verzonden</span>
              </div>
            </Tilt>
          </div>
        </div>
      </section>

      {/* Categorie-swipe-rail */}
      <section aria-label="Categorieën" className="pb-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="snap-row -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
            {RAIL.map((r, i) => {
              const p = tileImage(r.slug);
              return (
                <Reveal key={r.slug} index={i} className="w-[42%] shrink-0 sm:w-[28%] lg:w-auto">
                  <Link
                    to="/collectie/$slug"
                    params={{ slug: r.slug }}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-secondary"
                  >
                    {p && (
                      <Photo
                        product={p}
                        width={500}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width:1024px) 20vw, 42vw"
                      />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <span className="block font-display text-lg font-extrabold">{r.label}</span>
                      <span className="text-xs text-white/80">{countIn(r.slug)} producten</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* USP-band */}
      <section className="mt-12 bg-ink text-white" aria-label="Waarom GoedkopeSchoenen">
        <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          {USPS.map((u, i) => (
            <Reveal
              as="li"
              key={u.title}
              index={i}
              className="flex items-center gap-4 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                <u.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display font-bold">{u.title}</span>
                <span className="text-sm text-white/65">{u.text}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Nieuw binnen */}
      <section className="mx-auto max-w-7xl px-4 pt-16 lg:px-6" aria-labelledby="nieuw-h">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2
              id="nieuw-h"
              className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
            >
              Nieuw binnen
            </h2>
            <p className="mt-1 text-muted-foreground">De nieuwste aanwinsten in onze collectie.</p>
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
      </section>

      {/* Sale */}
      <section className="mx-auto max-w-7xl px-4 pt-20 lg:px-6" aria-labelledby="sale-h">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2
              id="sale-h"
              className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
            >
              Sale <span className="text-primary">tot -{maxPct}%</span>
            </h2>
            <p className="mt-1 text-muted-foreground">{countIn("sale")} producten met voordeel.</p>
          </div>
          <Link
            to="/collectie/$slug"
            params={{ slug: "sale" }}
            className="text-sm font-semibold underline-offset-4 hover:text-primary hover:underline"
          >
            Alle sale →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {sale.map((p, i) => (
            <Reveal key={p.h} index={i}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Statement */}
      <section className="relative mt-24 overflow-hidden bg-ink py-20 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <p className="max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Een eerlijke prijs. Een nette winkel. Al sinds {SITE.founded}.
            </p>
          </Reveal>
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { v: <CountUp to={PRODUCTS.length} />, l: "producten in de collectie" },
              {
                v: <CountUp to={SITE.kiyoh.score} decimals={1} suffix=" / 10" />,
                l: "gemiddelde Kiyoh-score",
              },
              { v: <CountUp to={SITE.kiyoh.count} />, l: "klantbeoordelingen" },
            ].map((s, i) => (
              <Reveal key={s.l} index={i}>
                <dd className="font-display text-5xl font-extrabold text-white">{s.v}</dd>
                <dt className="mt-1 text-white/65">{s.l}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Vertrouwen */}
      <section className="mx-auto max-w-7xl px-4 pt-20 lg:px-6" aria-labelledby="trust-h">
        <h2
          id="trust-h"
          className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
        >
          Klanten waarderen ons met een{" "}
          <span className="text-primary">{SITE.kiyoh.score.toLocaleString("nl-NL")}</span>
        </h2>
        {REVIEWS.length > 0 && (
          <div className="snap-row -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {REVIEWS.map((r, i) => (
              <Reveal
                key={r.name}
                index={i}
                className="w-[82%] shrink-0 rounded-2xl border border-border bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/50 md:w-auto"
              >
                <p className="text-primary" aria-label={`${r.stars} van 5 sterren`}>
                  {"★".repeat(r.stars)}
                </p>
                <p className="mt-3">“{r.text}”</p>
                <p className="mt-4 text-sm font-semibold">{r.name}</p>
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Snel in huis",
              d: "Op werkdagen voor 15:00 besteld, dezelfde dag verzonden met PostNL.",
            },
            { t: "Veilig betalen", d: "Betaal met iDEAL, Klarna, creditcard of Bancontact." },
            { t: "Gewoon bereikbaar", d: `Bel, app of mail ons: ${SITE.phone} · ${SITE.email}` },
          ].map((c, i) => (
            <Reveal
              key={c.t}
              index={i}
              className="rounded-2xl border border-border bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <h3 className="font-display text-lg font-bold">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 rounded-xl bg-secondary px-5 py-3 text-center text-sm text-muted-foreground">
          {SITE.name} · {SITE.address.street}, {SITE.address.zip} {SITE.address.city} · KvK{" "}
          {SITE.kvk} · BTW {SITE.btw}
        </p>
      </section>

      {/* Maatadvies teaser */}
      <section className="mx-auto max-w-7xl px-4 pt-16 lg:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-secondary p-8 md:flex-row md:items-center md:p-12">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
              <Ruler className="h-6 w-6 text-primary" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-extrabold md:text-3xl">
                Twijfel je over je maat?
              </h2>
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
