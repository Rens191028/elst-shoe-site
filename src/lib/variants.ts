import { PRODUCTS, type Product } from "@/lib/catalog";

/** Productgroep = zelfde model in dezelfde categorie, alleen de kleur (achtervoegsel in de titel) verschilt. */
export function modelKey(p: Product): string {
  const k = p.k[0];
  let t = p.t.toLowerCase();
  if (k && t.endsWith(` ${k.toLowerCase()}`)) t = t.slice(0, -k.length - 1);
  return `${p.c}|${t}`;
}

const GROUPS = new Map<string, Product[]>();
for (const p of PRODUCTS) {
  const key = modelKey(p);
  const g = GROUPS.get(key);
  if (g) g.push(p);
  else GROUPS.set(key, [p]);
}

/** Alle kleurvarianten van hetzelfde model (inclusief het product zelf), alleen met een bekende kleur. */
export function colorVariants(p: Product): Product[] {
  const g = GROUPS.get(modelKey(p)) ?? [p];
  return p.k.length ? g.filter((x) => x.k.length > 0) : [p];
}

/** Eén kaart per model (bij voorkeur een variant die op voorraad is); de rest is via kleurstipjes bereikbaar. */
export function collapseVariants(list: Product[]): Product[] {
  const pick = new Map<string, Product>();
  for (const p of list) {
    if (!p.k.length) continue;
    const key = modelKey(p);
    const cur = pick.get(key);
    if (!cur || (!cur.s && p.s)) pick.set(key, p);
  }
  const seen = new Set<string>();
  return list.flatMap((p) => {
    if (!p.k.length) return [p];
    const key = modelKey(p);
    if (seen.has(key)) return [];
    seen.add(key);
    return [pick.get(key)!];
  });
}

const HEX: Record<string, string> = {
  Zwart: "#1a1a19",
  Bruin: "#6b4429",
  Khaki: "#8a8458",
  Beige: "#d9c7a8",
  Roze: "#e8a0b4",
  Rood: "#b3262d",
  Camel: "#b98550",
  Blauw: "#3a5f9e",
  Taupe: "#8b7d72",
  Groen: "#3f7a4f",
  Wit: "#f7f5f0",
  Naturel: "#e6d8bd",
  Champagne: "#e9d8b4",
  Gold: "#c9a54b",
  Grijs: "#8d8d8a",
  Brons: "#9a6b3a",
  Oranje: "#e07a2c",
  Paars: "#7a4f9b",
  Geel: "#e5c33a",
  Silver: "#c3c4c6",
  Sand: "#d8c39a",
};
/** Patroon-/mixkleuren (Panter, Mix, Dier, Camouflage) krijgen een neutrale stip met kleurnaam. */
export const colorHex = (name: string) => HEX[name] ?? "linear-gradient(135deg,#d9c7a8,#6b4429)";
