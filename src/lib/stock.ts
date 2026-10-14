import raw from "@/data/stock.json";
import type { Product } from "@/lib/catalog";

/**
 * Voorraad per maat: { [handle]: { [maat]: aantal } }.
 * De catalogus bevat alleen "op voorraad ja/nee"; aantallen komen pas in beeld als ze hier
 * (of later uit de database) worden aangeleverd. Zonder data tonen we nooit een aantal.
 */
type StockMap = Record<string, Record<string, number>>;
const STOCK = raw as StockMap;

/** Vanaf dit totaal (of lager) tonen we "nog maar X op voorraad". */
export const LOW_STOCK = 3;

export function sizeStock(p: Product, size: string): number | undefined {
  return STOCK[p.h]?.[size];
}

export function totalStock(p: Product): number | undefined {
  const s = STOCK[p.h];
  if (!s) return undefined;
  return Object.values(s).reduce((a, b) => a + b, 0);
}

/** Aantal als het product nog op voorraad is maar bijna op, anders undefined. */
export function lowStock(p: Product): number | undefined {
  if (!p.s) return undefined;
  const t = totalStock(p);
  return t !== undefined && t > 0 && t <= LOW_STOCK ? t : undefined;
}

export const lowStockLabel = (n: number) =>
  n === 1 ? "Nog maar 1 op voorraad" : `Nog maar ${n} op voorraad`;
