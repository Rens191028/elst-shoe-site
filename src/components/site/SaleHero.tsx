import { Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { discountPct, PRODUCTS } from "@/lib/catalog";
import { SITE, UGC } from "@/lib/site";

const MAX_PCT = Math.max(0, ...PRODUCTS.filter((p) => p.s).map(discountPct));

/** Resterende tijd tot `SITE.saleEndsAt`; null zolang er geen (toekomstige) einddatum is. */
function useSaleCountdown() {
  const end = SITE.saleEndsAt ? Date.parse(SITE.saleEndsAt) : NaN;
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!Number.isFinite(end)) return;
    const tick = () => setLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [end]);
  return left && left > 0 ? left : null;
}

export function SaleHero({ count }: { count: number }) {
  const left = useSaleCountdown();
  const parts =
    left === null
      ? null
      : [
          ["dagen", Math.floor(left / 86400)],
          ["uur", Math.floor((left % 86400) / 3600)],
          ["min", Math.floor((left % 3600) / 60)],
          ["sec", left % 60],
        ];
  return (
    <section
      aria-labelledby="sale-hero-h"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <div aria-hidden="true" className="sale-stripes absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="sale-glow pointer-events-none absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20 lg:px-6">
        <p className="inline-block -skew-x-12 bg-primary px-4 py-1 font-display text-sm font-extrabold uppercase tracking-[0.25em] text-white">
          Sale
        </p>
        <h1
          id="sale-hero-h"
          className="mt-4 font-display text-[clamp(3.5rem,14vw,9.5rem)] font-extrabold leading-[0.9] tracking-tight"
        >
          Tot <span className="text-primary">-{MAX_PCT}%</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {count} producten met echt voordeel. Op = op: de voorraad per maat is beperkt.
        </p>
        {parts && (
          <div role="timer" aria-label="Tijd tot het einde van de sale" className="mt-8 flex gap-3">
            {parts.map(([label, n]) => (
              <div
                key={label}
                className="min-w-[4.5rem] -skew-x-6 rounded-xl border border-primary/40 bg-white/5 px-3 py-2 text-center"
              >
                <p className="font-display text-3xl font-extrabold tabular-nums">
                  {String(n).padStart(2, "0")}
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Instagram/UGC-strook in sale-stijl; verschijnt alleen met echte items in `UGC`. */
export function SaleUgc() {
  if (UGC.length === 0) return null;
  return (
    <section aria-labelledby="sale-ugc-h" className="mx-auto mt-20 max-w-7xl px-4 lg:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2
          id="sale-ugc-h"
          className="flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl"
        >
          <Instagram className="h-7 w-7 text-primary" aria-hidden="true" /> Gespot op Instagram
        </h2>
        {SITE.social.instagram && (
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-white"
          >
            Volg ons
          </a>
        )}
      </div>
      <div className="snap-row -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-6 md:overflow-visible md:px-0">
        {UGC.slice(0, 6).map((u, i) => (
          <a
            key={u.href}
            href={u.href}
            target="_blank"
            rel="noreferrer"
            className="group relative block aspect-square w-[44%] shrink-0 overflow-hidden rounded-2xl border-2 border-primary/50 shadow-lift transition duration-300 hover:-translate-y-1 md:w-auto"
            style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
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
    </section>
  );
}
