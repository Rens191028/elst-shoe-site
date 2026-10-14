import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HeroProduct } from "@/components/site/HeroProduct";
import { img, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Hero-carrousel met echte sale-producten. Bewust zonder automatisch wisselen (projectregel:
 * geen autoplay-carrousels): wisselen kan met pijltjes, stipjes of toetsenbord.
 * De foto's van de andere producten worden voorgeladen zodra de hero in beeld is.
 */
export function HeroCarousel({ products }: { products: Product[] }) {
  const [i, setI] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const n = products.length;

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      for (const p of products) new Image().src = img(p.i, 800);
      io.disconnect();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [products]);

  if (n === 0) return null;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const p = products[i]!;

  return (
    <div
      ref={root}
      role="group"
      aria-roledescription="carrousel"
      aria-label="Producten in de sale"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div key={p.h} className="anim-fade-up" aria-live="polite">
        <HeroProduct product={p} />
      </div>
      {n > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Vorig product"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/80 backdrop-blur transition hover:border-ink"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <ul className="flex items-center gap-2">
            {products.map((x, k) => (
              <li key={x.h}>
                <button
                  type="button"
                  onClick={() => setI(k)}
                  aria-label={`Product ${k + 1} van ${n}: ${x.t}`}
                  aria-current={k === i}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    k === i ? "w-7 bg-primary" : "w-2.5 bg-ink/25 hover:bg-ink/50",
                  )}
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Volgend product"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/80 backdrop-blur transition hover:border-ink"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
