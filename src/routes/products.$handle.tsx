import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, CreditCard, Link2, PackageCheck, Ruler, Truck } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { discountPct, getCollection, getProduct, img, related, SUBS, money } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ShippingBar } from "@/components/site/cart";
import { Tilt } from "@/components/site/Tilt";
import {
  Badges,
  KiyohBadge,
  Photo,
  Price,
  ProductGrid,
  WishButton,
} from "@/components/site/product";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$handle")({
  loader: ({ params }) => {
    const product = getProduct(params.handle);
    if (!product) throw notFound();
    return { handle: product.h };
  },
  head: ({ params }) => {
    const p = getProduct(params.handle);
    if (!p) return {};
    const title = `${p.t} — ${money(p.p)} | GoedkopeSchoenen.com`;
    const desc = `${p.t} voor ${money(p.p)}${p.w ? ` (van ${money(p.w)})` : ""}. Op werkdagen voor 15:00 besteld, dezelfde dag verzonden. Gratis verzending vanaf €65.`;
    const url = `${SITE.url}/products/${p.h}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:image", content: img(p.i, 1000) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.t,
            image: [p.i],
            brand: { "@type": "Brand", name: SITE.name },
            color: p.k.join(", ") || undefined,
            offers: {
              "@type": "Offer",
              url,
              priceCurrency: "EUR",
              price: p.p.toFixed(2),
              availability: p.s ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">Dit product vonden we niet</h1>
      <p className="mt-2 text-muted-foreground">Mogelijk is het uitverkocht of verplaatst.</p>
      <Link
        to="/collectie/$slug"
        params={{ slug: "nieuw" }}
        className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-white"
      >
        Bekijk nieuw binnen
      </Link>
    </div>
  ),
  component: ProductPage,
});

const MATERIALS: [RegExp, string][] = [
  [/leatherlook/i, "Leatherlook (imitatieleer)"],
  [/su[èe]dine|suede/i, "Suèdine (suède-look)"],
  [/furry|teddy/i, "Zachte furry afwerking"],
  [/gevlochten/i, "Gevlochten materiaal"],
  [/glitter/i, "Glitterafwerking"],
];

function ProductPage() {
  const { handle } = Route.useParams();
  const p = getProduct(handle)!;
  const { add, subtotal } = useCart();
  const [size, setSize] = useState("");
  const [warn, setWarn] = useState(false);
  const [copied, setCopied] = useState(false);

  const sub = SUBS.find((s) => s.cat === p.c);
  const group = getCollection(p.g);
  const materials = MATERIALS.filter(([re]) => re.test(p.t)).map(([, l]) => l);
  const needsSize = p.m.length > 0;
  const pct = discountPct(p);
  const together = related(p, 4);

  const submit = () => {
    if (needsSize && !size) {
      setWarn(true);
      return;
    }
    add(p.h, size);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${SITE.url}/products/${p.h}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* klembord niet beschikbaar */
    }
  };

  const specs: [string, string][] = [
    ["Categorie", sub?.title ?? group?.title ?? ""],
    ...(p.k.length ? ([["Kleur", p.k.join(", ")]] as [string, string][]) : []),
    ...(materials.length
      ? ([["Materiaal / afwerking", materials.join(", ")]] as [string, string][])
      : []),
    ["Maten", needsSize ? `${p.m[0]} t/m ${p.m[p.m.length - 1]}` : "Eén maat"],
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          ...(group ? [{ label: group.title, slug: group.slug }] : []),
          ...(sub ? [{ label: sub.title, slug: sub.slug }] : []),
          { label: p.t },
        ]}
      />
      <article className="mx-auto grid max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-6">
        <div className="relative lg:sticky lg:top-24 lg:self-start">
          <Tilt max={9}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
              <Photo
                product={p}
                width={1000}
                eager
                className={cn("h-full w-full object-cover", !p.s && "opacity-60")}
                sizes="(min-width:1024px) 55vw, 100vw"
              />
              <div className="absolute left-3 top-3">
                <Badges product={p} />
              </div>
              <WishButton handle={p.h} className="absolute right-3 top-3" />
            </div>
          </Tilt>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-soft">
            {sub?.title ?? group?.title}
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            {p.t}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <Price product={p} size="lg" />
            {pct > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                Je bespaart {money(p.w! - p.p)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Incl. btw ·{" "}
            {p.p >= SITE.freeShippingFrom
              ? "gratis verzending"
              : `gratis verzending vanaf ${money(SITE.freeShippingFrom)}`}
          </p>
          <KiyohBadge className="mt-4" />

          {p.k.length > 0 && (
            <p className="mt-6 text-sm">
              <span className="font-semibold">Kleur:</span> {p.k.join(", ")}
            </p>
          )}

          {needsSize && (
            <fieldset className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <legend className="text-sm font-semibold">Kies je maat</legend>
                <Link
                  to="/maatadvies"
                  className="flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:text-primary"
                >
                  <Ruler className="h-4 w-4" /> Maatadvies
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.m.map((m) => (
                  <button
                    key={m}
                    type="button"
                    disabled={!p.s}
                    aria-pressed={size === m}
                    onClick={() => {
                      setSize(m);
                      setWarn(false);
                    }}
                    className={cn(
                      "h-12 min-w-12 rounded-lg border px-3 text-sm font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
                      size === m
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-white hover:border-ink",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {warn && (
                <p role="alert" className="mt-2 text-sm font-medium text-primary">
                  Kies eerst je maat.
                </p>
              )}
            </fieldset>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={!p.s}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-white shadow-[0_8px_20px_-10px_var(--primary)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_14px_26px_-12px_var(--primary)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground disabled:shadow-none disabled:hover:translate-y-0"
          >
            {p.s ? "Aan winkelwagen toevoegen" : "Uitverkocht"}
          </button>

          <ShippingBar
            subtotal={subtotal + (p.s ? p.p : 0)}
            className="mt-5 rounded-xl border border-border bg-white p-4"
          />

          <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <li className="rounded-xl bg-secondary p-4">
              <Truck className="mb-2 h-5 w-5 text-primary" />
              <p className="font-semibold">Dezelfde dag verzonden</p>
              <p className="text-muted-foreground">Op werkdagen voor 15:00 besteld, met PostNL.</p>
            </li>
            <li className="rounded-xl bg-secondary p-4">
              <CreditCard className="mb-2 h-5 w-5 text-primary" />
              <p className="font-semibold">Veilig betalen</p>
              <p className="text-muted-foreground">iDEAL, Klarna, creditcard of Bancontact.</p>
            </li>
            <li className="rounded-xl bg-secondary p-4">
              <PackageCheck className="mb-2 h-5 w-5 text-primary" />
              <p className="font-semibold">Retourneren</p>
              <p className="text-muted-foreground">
                Via ons{" "}
                <Link to="/verzending-retour" className="underline">
                  retourbeleid
                </Link>
                .
              </p>
            </li>
          </ul>

          <Accordion type="multiple" defaultValue={["omschrijving"]} className="mt-6">
            <AccordionItem value="omschrijving">
              <AccordionTrigger className="font-display text-base font-bold">
                Omschrijving
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <p>
                  {p.t} uit onze collectie {sub?.title.toLowerCase() ?? group?.title.toLowerCase()}
                  {p.k.length ? `, in de kleur ${p.k.join(" / ").toLowerCase()}` : ""}
                  {materials.length ? ` en uitgevoerd in ${materials[0]!.toLowerCase()}` : ""}.
                  {needsSize
                    ? ` Verkrijgbaar in de maten ${p.m[0]} t/m ${p.m[p.m.length - 1]}.`
                    : ""}
                </p>
                <p>
                  Twijfel je over de pasvorm of de afmetingen? Stuur ons een berichtje via{" "}
                  <a className="underline" href={SITE.whatsappHref}>
                    WhatsApp
                  </a>{" "}
                  of{" "}
                  <a className="underline" href={`mailto:${SITE.email}`}>
                    e-mail
                  </a>
                  , dan helpen we je graag.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
              <AccordionTrigger className="font-display text-base font-bold">
                Specificaties
              </AccordionTrigger>
              <AccordionContent>
                <dl className="divide-y divide-border text-sm">
                  {specs.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-2">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="verzending">
              <AccordionTrigger className="font-display text-base font-bold">
                Verzending & retour
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Op werkdagen voor 15:00 besteld, dezelfde dag verzonden met PostNL. Verzendkosten{" "}
                  {money(SITE.shippingCost)}, gratis vanaf {money(SITE.freeShippingFrom)}.
                </p>
                <p>
                  Lees alles over{" "}
                  <Link to="/verzending-retour" className="underline">
                    verzending en retourneren
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <button
            type="button"
            onClick={copy}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-ink"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Link gekopieerd" : "Link kopiëren"}
          </button>
        </div>
      </article>

      {together.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-6" aria-labelledby="samen-h">
          <h2
            id="samen-h"
            className="mb-6 font-display text-2xl font-extrabold tracking-tight md:text-3xl"
          >
            Vaak samen gekocht
          </h2>
          <ProductGrid products={together} />
        </section>
      )}
    </>
  );
}
