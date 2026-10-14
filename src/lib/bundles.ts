import { shippingFor, type GroupSlug, type Product } from "@/lib/catalog";

/**
 * Bundeldeals. De voorwaarden zijn een voorstel en horen bij de winkelier: pas ze hier aan.
 * Regel: bij minstens `minQty` artikelen uit `group` krijgt de klant `percent`% korting op die
 * artikelen. Sale-producten (met van-prijs) doen niet mee, zodat kortingen niet stapelen.
 */
export type BundleRule = {
  id: string;
  group: GroupSlug;
  minQty: number;
  percent: number;
  title: string;
  /** Eenheid in zinnen: "paar", "tas", ... */
  unit: string;
};

export const BUNDLES: BundleRule[] = [
  {
    id: "2-schoenen",
    group: "schoenen",
    minQty: 2,
    percent: 10,
    title: "Koop 2 paar schoenen, krijg 10% korting",
    unit: "paar",
  },
];

type Line = { product: Product; qty: number };
const round2 = (n: number) => Math.round(n * 100) / 100;

const eligible = (p: Product, rule: BundleRule) => p.g === rule.group && !p.w;

export function bundleFor(lines: Line[]) {
  for (const rule of BUNDLES) {
    const qty = lines.reduce((n, l) => (eligible(l.product, rule) ? n + l.qty : n), 0);
    const base = lines.reduce(
      (n, l) => (eligible(l.product, rule) ? n + l.product.p * l.qty : n),
      0,
    );
    if (qty >= rule.minQty)
      return { rule, amount: round2((base * rule.percent) / 100), hint: null as string | null };
  }
  // Net onder de drempel: laat zien hoeveel er nog bij moet
  for (const rule of BUNDLES) {
    const qty = lines.reduce((n, l) => (eligible(l.product, rule) ? n + l.qty : n), 0);
    if (qty > 0 && qty < rule.minQty) {
      const more = rule.minQty - qty;
      return {
        rule: null,
        amount: 0,
        hint: `Nog ${more} ${rule.unit} erbij en je krijgt ${rule.percent}% korting`,
      };
    }
  }
  return { rule: null as BundleRule | null, amount: 0, hint: null as string | null };
}

/** Eén plek voor alle bedragen: winkelwagen, lade en (directe) checkout. */
export function priceLines(lines: Line[]) {
  const subtotal = round2(lines.reduce((s, l) => s + l.product.p * l.qty, 0));
  const b = bundleFor(lines);
  const net = round2(subtotal - b.amount);
  // Verzending alleen voor fysieke producten
  const physical = lines.some((l) => l.product.g !== "cadeaubon");
  const shipping = physical ? shippingFor(net) : 0;
  return {
    subtotal,
    discount: b.amount,
    bundle: b.rule,
    hint: b.hint,
    net,
    shipping,
    total: round2(net + shipping),
  };
}
