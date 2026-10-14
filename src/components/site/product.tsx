import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, ImageOff, Plus, Check, Star } from "lucide-react";
import { colorVariants, colorHex } from "@/lib/variants";
import { discountPct, img, isNew, money, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { useAuth } from "@/lib/auth";
import { flyToCart } from "@/lib/fly";
import { MagneticButton } from "@/components/site/motion-extras";
import { lowStock, lowStockLabel } from "@/lib/stock";
import { CompareButton } from "@/components/site/shopper-ui";
import { QuickView } from "@/components/site/QuickView";
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
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // Een afbeelding die al klaar was (of faalde) voordat React hydrateerde, krijgt geen onLoad/onError meer
  useEffect(() => {
    const el = ref.current;
    if (!el?.complete) return;
    if (el.naturalWidth === 0) setFailed(true);
    else setLoaded(true);
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
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cn(className, !loaded && "skeleton")}
    />
  );
}

export function Price({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span
        className={cn(
          "font-bold",
          product.w ? "price-flash text-primary-text" : "text-ink",
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

/** Sale-prijs: oude prijs wordt doorgestreept zodra hij in beeld komt, nieuwe prijs springt eruit. */
export function SalePrice({ product }: { product: Product }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setOn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.8 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5">
      <span className="font-display text-2xl font-extrabold text-primary">{money(product.p)}</span>
      {product.w && (
        <span ref={ref} className="text-sm text-soft">
          <span className="sr-only">Van-prijs </span>
          <span className="strike" data-on={on}>
            {money(product.w)}
          </span>
        </span>
      )}
    </div>
  );
}

export function Badges({ product, sale }: { product: Product; sale?: boolean }) {
  const pct = discountPct(product);
  return (
    <div className="flex flex-col items-start gap-1.5">
      {!product.s && (
        <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
          Uitverkocht
        </span>
      )}
      {product.s && pct > 0 && (
        <span
          className={cn(
            "bg-primary font-bold text-white",
            sale
              ? "sale-badge rounded-md px-3 py-1.5 font-display text-xl font-extrabold"
              : "badge-pulse rounded-full px-2.5 py-1 text-[11px]",
          )}
        >
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
  const { has, toggle } = useFavorites();
  const { user } = useAuth();
  const [pulse, setPulse] = useState(false);
  const on = has(handle);
  return (
    <button
      type="button"
      onClick={() => {
        if (user && !on) {
          setPulse(true);
          setTimeout(() => setPulse(false), 520);
        }
        void toggle(handle);
      }}
      aria-pressed={on}
      aria-label={on ? "Verwijder van favorieten" : "Bewaar als favoriet"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#141413] shadow-sm transition active:scale-90 hover:-translate-y-0.5",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-[18px] w-[18px] transition-[fill,color] duration-300",
          on && "fill-primary text-primary",
          pulse && "heart-pop",
        )}
      />
    </button>
  );
}

/** Primair "Bestel nu" (direct naar de checkout) en secundair "Toevoegen aan winkelwagen". */
export function CardBuyActions({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"buy" | "add" | null>(null);
  const [added, setAdded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  if (!product.s) return null;

  const run = (kind: "buy" | "add", size: string) => {
    setMode(null);
    if (kind === "buy") {
      void navigate({
        to: "/afrekenen",
        search: { direct: product.h, ...(size ? { maat: size } : {}) },
      });
      return;
    }
    add(product.h, size);
    // de foto van het product vliegt naar het winkelwagen-icoon
    flyToCart(root.current?.closest("article")?.querySelector("img") ?? root.current, product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };
  const choose = (kind: "buy" | "add") => (product.m.length ? setMode(kind) : run(kind, ""));

  if (mode)
    return (
      <div
        ref={root}
        className="mt-2 rounded-2xl bg-secondary p-2.5"
        role="group"
        aria-label="Kies je maat"
      >
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs font-semibold">Kies je maat</p>
          <button
            type="button"
            onClick={() => setMode(null)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-ink"
          >
            Annuleer
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {product.m.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => run(mode, m)}
              className="h-8 min-w-8 rounded-md border border-border bg-white px-1.5 text-xs font-semibold transition hover:border-ink hover:bg-ink hover:text-white"
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div ref={root} className="mt-2 grid gap-1.5">
      <MagneticButton
        type="button"
        onClick={() => choose("buy")}
        className="h-9 rounded-full bg-cta px-3 text-xs font-semibold text-white transition active:scale-[0.98]"
      >
        Bestel nu
      </MagneticButton>
      <MagneticButton
        type="button"
        onClick={() => choose("add")}
        className="flex h-9 items-center justify-center gap-1.5 rounded-full border border-ink px-3 text-xs font-semibold text-ink transition hover:bg-ink hover:text-white active:scale-[0.98]"
      >
        {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        {added ? "Toegevoegd" : "Toevoegen aan winkelwagen"}
      </MagneticButton>
    </div>
  );
}

export function ProductCard({
  product,
  index = 0,
  eager,
  view = "grid",
  sale,
}: {
  product: Product;
  index?: number;
  eager?: boolean;
  view?: "grid" | "list";
  sale?: boolean;
}) {
  const list = view === "list";

  return (
    <article className={cn("group relative", list && "flex gap-4 sm:gap-6")} data-index={index}>
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lift",
          list && "w-32 shrink-0 sm:w-44",
        )}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--cx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--cy", `${e.clientY - r.top}px`);
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[var(--cx,50%)] top-[var(--cy,50%)] z-10 ml-3 mt-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100 [@media(hover:none)]:hidden"
        >
          Bekijk
        </span>
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
          <Badges product={product} sale={!!sale} />
        </div>
        <WishButton handle={product.h} className="absolute right-2.5 top-2.5" />
        <QuickView product={product} />
      </div>
      <div className={cn("space-y-1 px-0.5", list ? "flex-1 pt-2" : "mt-3")}>
        <h3
          className={cn(
            "line-clamp-2 font-sans font-medium leading-snug tracking-normal text-ink",
            list ? "text-base" : "min-h-[2.6em] text-sm",
          )}
        >
          <Link to="/products/$handle" params={{ handle: product.h }} className="hover:underline">
            {product.t}
          </Link>
        </h3>
        {sale && product.w ? <SalePrice product={product} /> : <Price product={product} />}
        {lowStock(product) !== undefined && (
          <p
            className={cn(
              "text-xs font-semibold text-primary-text",
              sale && "inline-block rounded-full bg-primary px-2.5 py-1 text-white",
            )}
          >
            {lowStockLabel(lowStock(product)!)}
          </p>
        )}
        <ColorDots product={product} />
        <CardBuyActions product={product} />
        <CompareButton handle={product.h} className="pt-1" />
        {list && (
          <p className="pt-1 text-sm text-muted-foreground">
            {product.k.length > 0 && <span>{product.k.join(", ")}</span>}
            {product.m.length > 0 && (
              <span>
                {product.k.length > 0 ? " · " : ""}maat {product.m[0]}–
                {product.m[product.m.length - 1]}
              </span>
            )}
          </p>
        )}
      </div>
    </article>
  );
}

/** Kleurstipjes van de andere varianten van dit model; elk stipje linkt naar die variant. */
export function ColorDots({ product }: { product: Product }) {
  const variants = colorVariants(product);
  if (variants.length < 2) return null;
  return (
    <ul className="flex flex-wrap items-center gap-1.5 pt-0.5" aria-label="Beschikbare kleuren">
      {variants.map((v) => {
        const name = v.k[0]!;
        const current = v.h === product.h;
        return (
          <li key={v.h}>
            <Link
              to="/products/$handle"
              params={{ handle: v.h }}
              aria-label={`${name}${current ? " (deze)" : ""}`}
              title={name}
              className={cn(
                "block h-5 w-5 rounded-full border border-black/20 transition hover:scale-125",
                current && "ring-2 ring-ink ring-offset-1 ring-offset-background",
              )}
              style={{ background: colorHex(name) }}
            />
          </li>
        );
      })}
    </ul>
  );
}

export function KiyohBadge({ className, dark }: { className?: string; dark?: boolean }) {
  const inner = (
    <>
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
    </>
  );
  const cls = cn(
    "inline-flex items-center gap-2 text-sm",
    dark ? "text-white" : "text-ink",
    className,
  );
  return SITE.kiyoh.url ? (
    <a
      href={SITE.kiyoh.url}
      target="_blank"
      rel="noreferrer"
      className={cn(cls, "hover:opacity-80")}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function ProductGrid({
  products,
  eagerCount = 0,
  view = "grid",
  sale,
}: {
  products: Product[];
  eagerCount?: number;
  view?: "grid" | "list";
  sale?: boolean;
}) {
  return (
    <div
      className={
        view === "list"
          ? "grid gap-6 md:grid-cols-2"
          : "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4"
      }
    >
      {products.map((p, i) => (
        <Reveal key={p.h} index={i % 4}>
          <ProductCard product={p} index={i} eager={i < eagerCount} view={view} sale={!!sale} />
        </Reveal>
      ))}
    </div>
  );
}
