import { Bell } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { sizeStock } from "@/lib/stock";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * "Laat me weten als dit weer op voorraad is". Zonder backend gaat de melding als e-mail van de
 * klant zelf naar de winkel (mailto); met een database kan dit een echte melding-tabel worden.
 */
export function StockAlert({ product, className }: { product: Product; className?: string }) {
  const sizes = product.m.filter((m) => !product.s || sizeStock(product, m) === 0);
  const [size, setSize] = useState("");
  const href = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `Voorraadmelding: ${product.t}`,
  )}&body=${encodeURIComponent(
    `Hallo,\n\nLaat me weten als dit weer op voorraad is:\n${product.t}${size ? `\nMaat ${size}` : ""}\n${SITE.url}/products/${product.h}\n\nGroet`,
  )}`;
  return (
    <div className={cn("rounded-2xl border border-border bg-cream p-4", className)}>
      <p className="flex items-center gap-2 font-semibold">
        <Bell className="h-4 w-4 text-primary" aria-hidden="true" /> Weer op voorraad?
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Laat het ons weten, dan mailen we je zodra dit terug is.
      </p>
      {sizes.length > 0 && (
        <label className="mt-3 block text-sm font-medium">
          <span className="mb-1 block">Maat</span>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
          >
            <option value="">Welke maat dan ook</option>
            {sizes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      )}
      <a
        href={href}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cta font-semibold text-white transition active:scale-[0.98]"
      >
        Laat me weten als dit weer op voorraad is
      </a>
    </div>
  );
}
