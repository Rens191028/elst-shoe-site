import { Link } from "@tanstack/react-router";
import { ChevronDown, Scale, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCollection, getProduct, related, type Product } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";
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

/** Vaste, uitklapbare balk onderaan; "Vergelijk nu" werkt zodra er minstens twee producten zijn gekozen. */
export function CompareTray() {
  const { compare, toggleCompare, clearCompare } = useShopper();
  const [collapsed, setCollapsed] = useState(false);
  const items = compare.map(getProduct).filter((p): p is Product => !!p);
  if (items.length === 0) return null;
  const ready = items.length >= 2;
  return (
    <div
      role="region"
      aria-label="Vergelijken"
      className="fixed bottom-4 left-4 right-24 z-30 max-w-md glass rounded-2xl border border-border p-3 shadow-lift sm:right-auto"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">
          Vergelijken ({items.length}/{MAX_COMPARE})
        </p>
        <button
          type="button"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Vergelijkbalk uitklappen" : "Vergelijkbalk inklappen"}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-ink"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>
      {!collapsed && (
        <div className="mt-2 flex items-center gap-3">
          <ul className="flex gap-2">
            {items.map((p) => (
              <li key={p.h} className="group relative">
                <span className="block h-12 w-10 overflow-hidden rounded-lg bg-secondary">
                  <Photo
                    product={p}
                    width={120}
                    className="h-full w-full object-cover"
                    sizes="40px"
                  />
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
          {ready ? (
            <Link
              to="/vergelijken"
              className="ml-auto whitespace-nowrap rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white"
            >
              Vergelijk nu
            </Link>
          ) : (
            <p className="ml-auto text-xs text-muted-foreground">Kies er nog 1 om te vergelijken</p>
          )}
          <button
            type="button"
            onClick={clearCompare}
            aria-label="Vergelijking leegmaken"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

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

/**
 * "Omdat je … bekeek": aanbevelingen uit dezelfde categorie als wat je laatst bekeek (of, als
 * je bent ingelogd en nog niets bekeek, als je laatste favoriet). Alleen lokale/eigen gegevens;
 * zonder geschiedenis tonen we niets.
 */
export function PersonalPicks({ className }: { className?: string }) {
  const { recent } = useShopper();
  const { handles } = useFavorites();
  const seed = getProduct(recent[0] ?? "") ?? getProduct(handles[handles.length - 1] ?? "");
  if (!seed) return null;
  const items = related(seed, 4, recent);
  if (items.length === 0) return null;
  const cat = (getCollection(seed.c)?.title ?? "dit").toLowerCase();
  const fromFav = !getProduct(recent[0] ?? "");
  return (
    <section className={className} aria-labelledby="picks-h">
      <h2 id="picks-h" className="mb-6 font-display text-2xl tracking-tight md:text-3xl">
        {fromFav ? `Omdat je ${cat} bewaarde` : `Omdat je ${cat} bekeek`}
      </h2>
      <ProductGrid products={items} />
    </section>
  );
}
