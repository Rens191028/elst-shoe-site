import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { crossSell, money, type Product } from "@/lib/catalog";
import { useCart, type DetailedLine } from "@/lib/cart";
import { SITE } from "@/lib/site";
import { Photo, Price } from "@/components/site/product";
import { cn } from "@/lib/utils";

export function ShippingBar({ subtotal, className }: { subtotal: number; className?: string }) {
  const left = Math.max(0, SITE.freeShippingFrom - subtotal);
  const pct = Math.min(100, (subtotal / SITE.freeShippingFrom) * 100);
  return (
    <div className={className}>
      <p className="mb-2 flex items-center gap-2 text-sm">
        <Truck className="h-4 w-4 text-primary" />
        {left > 0 ? (
          <span>
            Nog <strong>{money(left)}</strong> voor gratis verzending
          </span>
        ) : (
          <span className="font-semibold">Gratis verzending voor deze bestelling</span>
        )}
      </p>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-label="Voortgang gratis verzending"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function QtyStepper({ line, compact }: { line: DetailedLine; compact?: boolean }) {
  const { setQty } = useCart();
  const btn = cn(
    "flex items-center justify-center rounded-full border border-border bg-white transition hover:border-ink active:scale-90",
    compact ? "h-7 w-7" : "h-8 w-8",
  );
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        className={btn}
        onClick={() => setQty(line.h, line.size, line.qty - 1)}
        aria-label="Minder"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-4 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {line.qty}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => setQty(line.h, line.size, line.qty + 1)}
        aria-label="Meer"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function CartLineRow({ line, big }: { line: DetailedLine; big?: boolean }) {
  const { remove } = useCart();
  const [leaving, setLeaving] = useState(false);
  const p = line.product;
  return (
    <li
      className={cn(
        "flex gap-3 border-b border-border py-4 transition-all duration-300",
        leaving && "-translate-x-3 opacity-0",
      )}
    >
      <Link
        to="/products/$handle"
        params={{ handle: p.h }}
        className={cn(
          "shrink-0 overflow-hidden rounded-lg bg-secondary",
          big ? "h-28 w-24" : "h-24 w-20",
        )}
      >
        <Photo product={p} width={240} className="h-full w-full object-cover" sizes="120px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            to="/products/$handle"
            params={{ handle: p.h }}
            className="line-clamp-2 text-sm font-medium leading-snug hover:underline"
          >
            {p.t}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {line.size ? `Maat ${line.size}` : "Eén maat"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <QtyStepper line={line} compact />
          <span className="text-sm font-bold">{money(p.p * line.qty)}</span>
        </div>
      </div>
      <button
        type="button"
        aria-label={`Verwijder ${p.t}`}
        onClick={() => {
          setLeaving(true);
          setTimeout(() => remove(line.h, line.size), 260);
        }}
        className="self-start rounded-full p-1.5 text-soft transition hover:bg-secondary hover:text-ink"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

/** Cross-sell binnen dezelfde categorie, mét maatkeuze. */
export function CrossSell({
  items,
  title = "Past hier goed bij",
}: {
  items: Product[];
  title?: string;
}) {
  const { add } = useCart();
  const [sizes, setSizes] = useState<Record<string, string>>({});
  if (!items.length) return null;
  return (
    <div>
      <h3 className="font-display text-base font-bold">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((p) => {
          const size = sizes[p.h] ?? "";
          const needsSize = p.m.length > 0;
          return (
            <li key={p.h} className="flex items-center gap-3">
              <Link
                to="/products/$handle"
                params={{ handle: p.h }}
                className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-secondary"
              >
                <Photo
                  product={p}
                  width={160}
                  className="h-full w-full object-cover"
                  sizes="64px"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-medium">{p.t}</p>
                <Price product={p} />
                {needsSize && (
                  <select
                    aria-label={`Maat voor ${p.t}`}
                    value={size}
                    onChange={(e) => setSizes((s) => ({ ...s, [p.h]: e.target.value }))}
                    className="mt-1 h-7 rounded-md border border-border bg-white px-1.5 text-xs"
                  >
                    <option value="">Maat</option>
                    {p.m.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <button
                type="button"
                disabled={needsSize && !size}
                onClick={() => add(p.h, size)}
                className="rounded-full border border-ink px-3 py-1.5 text-xs font-semibold transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
              >
                Toevoegen
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, shipping, total, count } = useCart();
  const suggestions = crossSell(lines.map((l) => l.h));
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-display text-lg font-extrabold">
            Winkelwagen ({count})
          </SheetTitle>
          <SheetDescription className="sr-only">
            Overzicht van de producten in je winkelwagen
          </SheetDescription>
        </SheetHeader>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-soft" />
            <p className="font-display text-lg font-bold">Je winkelwagen is leeg</p>
            <p className="text-sm text-muted-foreground">
              Ontdek onze nieuwste laarzen, sneakers en tassen.
            </p>
            <Link
              to="/collectie/$slug"
              params={{ slug: "nieuw" }}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-cta px-6 py-3 text-sm font-semibold text-white transition "
            >
              Bekijk nieuw binnen
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ShippingBar subtotal={subtotal} className="border-b border-border py-4" />
              <ul>
                {lines.map((l) => (
                  <CartLineRow key={l.h + l.size} line={l} />
                ))}
              </ul>
              <div className="py-5">
                <CrossSell items={suggestions} />
              </div>
            </div>
            <div className="space-y-3 border-t border-border bg-white px-5 py-4">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotaal</dt>
                  <dd>{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Verzending</dt>
                  <dd>{shipping === 0 ? "Gratis" : money(shipping)}</dd>
                </div>
                <div className="flex justify-between pt-1 text-base font-bold">
                  <dt>Totaal</dt>
                  <dd>{money(total)}</dd>
                </div>
              </dl>
              <Link
                to="/afrekenen"
                onClick={() => setOpen(false)}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-cta py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                Afrekenen
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/winkelwagen"
                onClick={() => setOpen(false)}
                className="block text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
              >
                Bekijk winkelwagen
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
