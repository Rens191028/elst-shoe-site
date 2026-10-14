import { Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@/lib/catalog";
import { Badges, CardBuyActions, ColorDots, Photo, Price } from "@/components/site/product";

/** Knop op de productfoto die het product in een popup opent, zonder de lijst te verlaten. */
export function QuickView({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Snel bekijken: ${product.t}`}
        className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#141413] opacity-0 shadow-soft transition focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:hidden"
      >
        <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Snel bekijken
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl p-0">
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="relative aspect-[4/5] bg-secondary sm:aspect-auto">
              <Photo product={product} width={800} className="h-full w-full object-cover" />
              <div className="absolute left-3 top-3">
                <Badges product={product} />
              </div>
            </div>
            <div className="space-y-3 p-6 sm:p-8">
              <DialogTitle className="font-display text-2xl font-extrabold leading-tight">
                {product.t}
              </DialogTitle>
              <DialogDescription className="sr-only">Snel bekijken</DialogDescription>
              <Price product={product} size="lg" />
              {product.k.length > 0 && (
                <p className="text-sm text-muted-foreground">Kleur: {product.k.join(", ")}</p>
              )}
              <ColorDots product={product} />
              {product.m.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Maten {product.m[0]}–{product.m[product.m.length - 1]}
                </p>
              )}
              <CardBuyActions product={product} />
              <Link
                to="/products/$handle"
                params={{ handle: product.h }}
                onClick={() => setOpen(false)}
                className="inline-block text-sm font-semibold underline underline-offset-4"
              >
                Alle productdetails →
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
