import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Mail, PackageCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { PriceRows } from "@/components/site/cart";
import { Photo } from "@/components/site/product";
import { getProduct, variantLabel, type Product } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/bedankt")({
  head: () => ({
    meta: [
      { title: "Bedankt voor je bestelling | GoedkopeSchoenen.com" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Thanks,
});

type Snapshot = {
  lines: { h: string; size: string; qty: number }[];
  price: { subtotal: number; discount: number; shipping: number; total: number };
  digital: boolean;
};

function useSnapshot() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gs-last-order");
      if (raw) setSnap(JSON.parse(raw) as Snapshot);
    } catch {
      /* geen bestelling om te tonen */
    }
  }, []);
  return snap;
}

function Thanks() {
  const snap = useSnapshot();
  const lines = (snap?.lines ?? []).flatMap((l) => {
    const product = getProduct(l.h);
    return product ? [{ ...l, product }] : [];
  });
  const steps = [
    {
      icon: Mail,
      title: "Bevestiging per e-mail",
      text: "Je ontvangt zo een mail met je bestelling.",
    },
    snap?.digital
      ? {
          icon: PackageCheck,
          title: "Cadeaubon onderweg",
          text: "We sturen de cadeaubon per e-mail naar de ontvanger.",
        }
      : {
          icon: PackageCheck,
          title: "Wij pakken in",
          text: "Op werkdagen voor 15:00 besteld, verzenden we dezelfde dag.",
        },
    ...(snap?.digital
      ? []
      : [
          {
            icon: Truck,
            title: "PostNL bezorgt",
            text: "Je pakket is onderweg zodra het is verzonden.",
          },
        ]),
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <div className="text-center">
        <span className="anim-fade-up mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cta text-white shadow-lift">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </span>
        <h1
          className="anim-fade-up mt-6 font-display text-4xl tracking-tight md:text-5xl"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          Bedankt voor je bestelling!
        </h1>
        <p
          className="anim-fade-up mx-auto mt-3 max-w-md text-muted-foreground"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          Je ontvangt een bevestiging per e-mail.
        </p>
      </div>

      {!SITE.checkoutLive && (
        <p
          role="note"
          className="anim-fade-up mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <strong>Demo:</strong> de checkout is nog niet gekoppeld aan een betaalprovider. Er is
          geen bestelling geplaatst en je winkelwagen is niet leeggemaakt.
        </p>
      )}

      <ol
        className={`anim-fade-up mt-10 grid gap-4 ${steps.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
        style={{ "--i": 4 } as React.CSSProperties}
      >
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
              <s.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 font-display font-bold">
              <span className="text-muted-foreground">{i + 1}. </span>
              {s.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>

      {snap && lines.length > 0 && (
        <div
          className="anim-fade-up mt-8 rounded-3xl border border-border bg-white p-6 shadow-soft"
          style={{ "--i": 5 } as React.CSSProperties}
        >
          <h2 className="font-display text-xl font-bold">Je bestelling</h2>
          <ul className="mt-3 divide-y divide-border">
            {lines.map((l) => (
              <li key={l.h + l.size} className="flex items-center gap-3 py-3 text-sm">
                <span className="h-14 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Photo
                    product={l.product as Product}
                    width={120}
                    className="h-full w-full object-cover"
                    sizes="48px"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 font-medium">{l.product.t}</span>
                  <span className="text-xs text-muted-foreground">
                    {variantLabel(l.product, l.size)} · {l.qty}×
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <PriceRows
            big
            className="mt-3 border-t border-border pt-4"
            price={{
              ...snap.price,
              bundle: snap.price.discount > 0 ? { title: "Bundelkorting toegepast" } : null,
            }}
          />
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          to="/collectie/$slug"
          params={{ slug: "nieuw" }}
          className="rounded-full bg-cta px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Verder winkelen
        </Link>
        <Link
          to="/account"
          className="rounded-full border border-ink px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
        >
          Naar mijn account
        </Link>
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Vragen? Bel of app ons op {SITE.phone}.
      </p>
    </section>
  );
}
