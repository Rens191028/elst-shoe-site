import { Link } from "@tanstack/react-router";
import { Scale, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getProduct, type Product } from "@/lib/catalog";
import { MAX_COMPARE, useShopper } from "@/lib/shopper";
import { Photo, ProductGrid } from "@/components/site/product";
import { cn } from "@/lib/utils";

/** Knop om een product aan de vergelijklijst toe te voegen (max 3). */
export function CompareButton({ handle, className }: { handle: string; className?: string }) {
  const { inCompare, toggleCompare } = useShopper();
  const [full, setFull] = useState(false);
  const on = inCompare(handle);
  useEffect(() => {
    if (!full) return;
    const t = setTimeout(() => setFull(false), 2500);
    return () => clearTimeout(t);
  }, [full]);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setFull(!toggleCompare(handle))}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold transition",
        on ? "text-primary-text" : "text-muted-foreground hover:text-ink",
        className,
      )}
    >
      <Scale className="h-3.5 w-3.5" aria-hidden="true" />
      {full ? `Maximaal ${MAX_COMPARE} producten` : on ? "In vergelijking" : "Vergelijk"}
    </button>
  );
}

/** Zwevende balk met de gekozen producten; verschijnt zodra er minstens één is gekozen. */
export function CompareTray() {
  const { compare, toggleCompare, clearCompare } = useShopper();
  const items = compare.map(getProduct).filter((p): p is Product => !!p);
  if (items.length === 0) return null;
  return (
    <div
      role="region"
      aria-label="Vergelijken"
      className="fixed bottom-4 left-4 right-24 z-30 flex max-w-md items-center gap-3 rounded-2xl border border-border bg-white p-3 shadow-lift sm:right-auto"
    >
      <ul className="flex gap-2">
        {items.map((p) => (
          <li key={p.h} className="group relative">
            <span className="block h-12 w-10 overflow-hidden rounded-lg bg-secondary">
              <Photo product={p} width={120} className="h-full w-full object-cover" sizes="40px" />
            </span>
            <button
              type="button"
              onClick={() => toggleCompare(p.h)}
              aria-label={`Verwijder ${p.t} uit vergelijking`}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
      <Link
        to="/vergelijken"
        className="ml-auto whitespace-nowrap rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white"
      >
        Vergelijk ({items.length})
      </Link>
      <button
        type="button"
        onClick={clearCompare}
        aria-label="Vergelijking leegmaken"
        className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** "Eerder bekeken": toont alleen producten die deze bezoeker echt bekeken heeft. */
export function RecentlyViewed({ exclude, className }: { exclude?: string; className?: string }) {
  const { recent } = useShopper();
  const items = recent
    .filter((h) => h !== exclude)
    .map(getProduct)
    .filter((p): p is Product => !!p)
    .slice(0, 4);
  if (items.length === 0) return null;
  return (
    <section className={className} aria-labelledby="recent-h">
      <h2 id="recent-h" className="mb-6 font-display text-2xl tracking-tight md:text-3xl">
        Eerder bekeken
      </h2>
      <ProductGrid products={items} />
    </section>
  );
}
