import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ImageOff, Plus, Check, Star } from "lucide-react";
import { discountPct, img, isNew, money, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/motion";

export function Photo({
  product,
  width = 600,
  className,
  eager,
  sizes,
}: {
  product: Product;
  width?: number;
  className?: string | undefined;
  eager?: boolean | undefined;
  sizes?: string | undefined;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // Een afbeelding die al faalde voordat React hydrateerde, krijgt geen onError meer
  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  if (failed)
    return (
      <div
        className={cn("flex items-center justify-center bg-secondary text-soft", className)}
        role="img"
        aria-label={product.t}
      >
        <ImageOff className="h-8 w-8" />
      </div>
    );
  return (
    <img
      ref={ref}
      src={img(product.i, width)}
      srcSet={`${img(product.i, Math.round(width / 2))} ${Math.round(width / 2)}w, ${img(product.i, width)} ${width}w, ${img(product.i, width * 2)} ${width * 2}w`}
      sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
      alt={product.t}
      width={width}
      height={Math.round(width * 1.25)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function Price({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span
        className={cn(
          "font-bold",
          product.w ? "text-primary" : "text-ink",
          size === "lg" ? "text-2xl" : "text-[0.95rem]",
        )}
      >
        {money(product.p)}
      </span>
      {product.w && (
        <span className={cn("text-soft line-through", size === "lg" ? "text-base" : "text-sm")}>
          <span className="sr-only">Van-prijs </span>
          {money(product.w)}
        </span>
      )}
    </div>
  );
}

export function Badges({ product }: { product: Product }) {
  const pct = discountPct(product);
  return (
    <div className="flex flex-col items-start gap-1.5">
      {!product.s && (
        <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
          Uitverkocht
        </span>
      )}
      {product.s && pct > 0 && (
        <span className="badge-pulse rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white">
          -{pct}%
        </span>
      )}
      {product.s && isNew(product) && (
        <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">
          Nieuw
        </span>
      )}
    </div>
  );
}

export function WishButton({ handle, className }: { handle: string; className?: string }) {
  const { wishlist, toggleWish } = useCart();
  const on = wishlist.includes(handle);
  return (
    <button
      type="button"
      onClick={() => toggleWish(handle)}
      aria-pressed={on}
      aria-label={on ? "Verwijder van favorieten" : "Bewaar als favoriet"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition active:scale-90 hover:-translate-y-0.5",
        className,
      )}
    >
      <Heart className={cn("h-[18px] w-[18px]", on && "fill-primary text-primary")} />
    </button>
  );
}

export function ProductCard({
  product,
  index = 0,
  eager,
}: {
  product: Product;
  index?: number;
  eager?: boolean;
}) {
  const { add } = useCart();
  const [picking, setPicking] = useState(false);
  const [added, setAdded] = useState(false);

  const quickAdd = (size: string) => {
    add(product.h, size);
    setPicking(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group relative" data-index={index}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_30px_-14px_rgba(20,20,19,0.35)]">
        <Link
          to="/products/$handle"
          params={{ handle: product.h }}
          className="absolute inset-0 block"
          aria-label={product.t}
        >
          <Photo
            product={product}
            eager={eager}
            className={cn(
              "h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]",
              !product.s && "opacity-60",
            )}
          />
        </Link>
        <div className="pointer-events-none absolute left-2.5 top-2.5">
          <Badges product={product} />
        </div>
        <WishButton handle={product.h} className="absolute right-2.5 top-2.5" />

        {product.s && (
          <div className="absolute inset-x-2 bottom-2">
            {picking ? (
              <div
                className="rounded-lg bg-white/95 p-2 shadow-md backdrop-blur"
                role="group"
                aria-label="Kies je maat"
              >
                <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">
                  Kies je maat
                </p>
                <div className="flex flex-wrap gap-1">
                  {product.m.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => quickAdd(m)}
                      className="h-8 min-w-8 rounded-md border border-border bg-white px-1.5 text-xs font-semibold transition hover:border-ink hover:bg-ink hover:text-white"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => (product.m.length ? setPicking(true) : quickAdd(""))}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/95 py-2 text-xs font-semibold text-ink opacity-100 shadow-sm backdrop-blur transition hover:bg-ink hover:text-white md:translate-y-2 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100"
              >
                {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {added ? "Toegevoegd" : "Snel toevoegen"}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1 px-0.5">
        <h3 className="line-clamp-2 min-h-[2.6em] font-sans text-sm font-medium leading-snug tracking-normal text-ink">
          <Link to="/products/$handle" params={{ handle: product.h }} className="hover:underline">
            {product.t}
          </Link>
        </h3>
        <Price product={product} />
      </div>
    </article>
  );
}

export function KiyohBadge({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-sm",
        dark ? "text-white" : "text-ink",
        className,
      )}
    >
      <span className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </span>
      <span>
        <strong className="font-bold">{SITE.kiyoh.score.toLocaleString("nl-NL")}</strong>
        <span className={dark ? "text-white/70" : "text-muted-foreground"}>
          {" "}
          · {SITE.kiyoh.count.toLocaleString("nl-NL")} beoordelingen op Kiyoh
        </span>
      </span>
    </div>
  );
}

export function ProductGrid({
  products,
  eagerCount = 0,
}: {
  products: Product[];
  eagerCount?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <Reveal key={p.h} index={i % 4}>
          <ProductCard product={p} index={i} eager={i < eagerCount} />
        </Reveal>
      ))}
    </div>
  );
}
