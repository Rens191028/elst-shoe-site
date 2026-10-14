import raw from "@/data/products.json";
import { SITE } from "@/lib/site";

export type Product = {
  h: string; // handle
  t: string; // titel
  c: CategorySlug;
  g: GroupSlug;
  p: number; // prijs
  w: number | null; // van-prijs (alleen bij echte korting)
  s: boolean; // op voorraad
  k: string[]; // kleuren
  m: string[]; // maten
  i: string; // foto
  a: string; // toegevoegd op (YYYY-MM-DD)
};

export type GroupSlug = "schoenen" | "tassen" | "accessoires";
export type CategorySlug =
  | "laarzen"
  | "sneakers"
  | "boots-festival"
  | "pantoffels"
  | "overig-schoenen"
  | "schoudertasjes"
  | "grote-tassen"
  | "portemonnees"
  | "sieraden";

export const PRODUCTS = raw as Product[];
const BY_HANDLE = new Map(PRODUCTS.map((p) => [p.h, p]));
export const getProduct = (handle: string) => BY_HANDLE.get(handle);

export type Collection = {
  slug: string;
  title: string;
  blurb: string;
  group?: GroupSlug;
  cat?: CategorySlug;
  sale?: boolean;
  nieuw?: boolean;
};

export const GROUPS: Collection[] = [
  {
    slug: "schoenen",
    title: "Schoenen",
    group: "schoenen",
    blurb: "Laarzen, sneakers, boots en pantoffels voor een eerlijke prijs.",
  },
  {
    slug: "tassen",
    title: "Tassen",
    group: "tassen",
    blurb: "Van handige telefoontasjes tot ruime shoppers.",
  },
  {
    slug: "accessoires",
    title: "Accessoires",
    group: "accessoires",
    blurb: "Portemonnees, sieraden en kleine extra's die het af maken.",
  },
];

export const SUBS: Collection[] = [
  {
    slug: "laarzen",
    title: "Laarzen",
    cat: "laarzen",
    group: "schoenen",
    blurb: "Van enkellaarsjes tot hoge laarzen.",
  },
  {
    slug: "sneakers",
    title: "Sneakers",
    cat: "sneakers",
    group: "schoenen",
    blurb: "Casual sneakers en air sneakers voor elke dag.",
  },
  {
    slug: "boots-festival",
    title: "Boots festival",
    cat: "boots-festival",
    group: "schoenen",
    blurb: "Stoere boots voor festival en daarna.",
  },
  {
    slug: "pantoffels",
    title: "Instappers & pantoffels",
    cat: "pantoffels",
    group: "schoenen",
    blurb: "Lekker zacht en makkelijk aan.",
  },
  {
    slug: "overig-schoenen",
    title: "Overig schoenen",
    cat: "overig-schoenen",
    group: "schoenen",
    blurb: "Sandalen, slippers, slingbacks, klompen en kinderschoenen.",
  },
  {
    slug: "schoudertasjes",
    title: "Telefoon- & schoudertasjes",
    cat: "schoudertasjes",
    group: "tassen",
    blurb: "Compact en handig voor onderweg.",
  },
  {
    slug: "grote-tassen",
    title: "Middel & grote tassen",
    cat: "grote-tassen",
    group: "tassen",
    blurb: "Ruim genoeg voor je hele dag.",
  },
  {
    slug: "portemonnees",
    title: "Portemonnees",
    cat: "portemonnees",
    group: "accessoires",
    blurb: "Portemonnees en pasjeshouders.",
  },
  {
    slug: "sieraden",
    title: "Sieraden",
    cat: "sieraden",
    group: "accessoires",
    blurb: "Kettingen, armbanden en meer.",
  },
];

export const SPECIAL: Collection[] = [
  { slug: "sale", title: "Sale", sale: true, blurb: "Scherp geprijsd, nu met extra voordeel." },
  {
    slug: "nieuw",
    title: "Nieuw binnen",
    nieuw: true,
    blurb: "De nieuwste aanwinsten in onze collectie.",
  },
];

export const COLLECTIONS = [...GROUPS, ...SUBS, ...SPECIAL];
export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);

// "Nieuw" is relatief t.o.v. de nieuwste productdatum, zodat server en browser hetzelfde renderen.
const NEWEST = PRODUCTS.reduce((m, p) => (p.a > m ? p.a : m), "");
const NEW_CUTOFF = new Date(new Date(NEWEST).getTime() - 21 * 864e5).toISOString().slice(0, 10);
export const isNew = (p: Product) => p.a >= NEW_CUTOFF;

export const discountPct = (p: Product) => (p.w ? Math.round((1 - p.p / p.w) * 100) : 0);

export function inCollection(c: Collection): Product[] {
  let list = PRODUCTS;
  if (c.cat) list = list.filter((p) => p.c === c.cat);
  else if (c.group) list = list.filter((p) => p.g === c.group);
  else if (c.sale) list = list.filter((p) => p.w);
  else if (c.nieuw) list = list.filter(isNew);
  return [...list].sort((a, b) => b.a.localeCompare(a.a));
}

export const countIn = (slug: string) => {
  const c = getCollection(slug);
  return c ? inCollection(c).length : 0;
};

// Productfoto's komen van het bestaande CDN; `width` laat het CDN een kleinere variant leveren.
export function img(url: string, width?: number) {
  if (!width) return url;
  return url + (url.includes("?") ? "&" : "?") + `width=${width}`;
}

const eur = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });
export const money = (n: number) => eur.format(n);

export const sizeKey = (p: Product) => (p.m.length ? p.m : []);

export type Sort = "nieuw" | "prijs-oplopend" | "prijs-aflopend" | "korting";
export type Filters = {
  kleur?: string[] | undefined;
  maat?: string | undefined;
  max?: number | undefined;
  sale?: boolean | undefined;
  sort?: Sort | undefined;
};

export function applyFilters(list: Product[], f: Filters): Product[] {
  let out = list;
  if (f.kleur?.length) out = out.filter((p) => p.k.some((k) => f.kleur!.includes(k)));
  if (f.maat) out = out.filter((p) => p.m.includes(f.maat!));
  if (f.max) out = out.filter((p) => p.p <= f.max!);
  if (f.sale) out = out.filter((p) => p.w);
  const sorted = [...out];
  switch (f.sort) {
    case "prijs-oplopend":
      sorted.sort((a, b) => a.p - b.p);
      break;
    case "prijs-aflopend":
      sorted.sort((a, b) => b.p - a.p);
      break;
    case "korting":
      sorted.sort((a, b) => discountPct(b) - discountPct(a));
      break;
    default:
      break; // standaard: nieuwste eerst (inCollection levert dat al zo)
  }
  return sorted;
}

export function facets(list: Product[]) {
  const colors = new Map<string, number>();
  const sizes = new Map<string, number>();
  let max = 0;
  for (const p of list) {
    p.k.forEach((k) => colors.set(k, (colors.get(k) ?? 0) + 1));
    p.m.forEach((m) => sizes.set(m, (sizes.get(m) ?? 0) + 1));
    max = Math.max(max, p.p);
  }
  return {
    colors: [...colors].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n })),
    sizes: [...sizes].sort((a, b) => Number(a[0]) - Number(b[0])).map(([name, n]) => ({ name, n })),
    maxPrice: Math.ceil(max),
  };
}

// Vaak samen gekocht: alleen binnen dezelfde categorie (CLAUDE.md §6), stabiel gekozen per product.
export function related(p: Product, n = 4, exclude: string[] = []): Product[] {
  const pool = PRODUCTS.filter((x) => x.c === p.c && x.h !== p.h && x.s && !exclude.includes(x.h));
  const seed = [...p.h].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return pool
    .map((x, idx) => ({ x, r: ((seed + idx * 2654435761) >>> 0) % 9973 }))
    .sort((a, b) => a.r - b.r)
    .slice(0, n)
    .map((o) => o.x);
}

export function crossSell(handles: string[], n = 3): Product[] {
  const cart = handles.map(getProduct).filter((p): p is Product => !!p);
  const first = cart[0];
  if (!first) return [];
  const cats = [...new Set(cart.map((p) => p.c))];
  const out: Product[] = [];
  for (const cat of cats) {
    const base = cart.find((p) => p.c === cat)!;
    out.push(...related(base, n, handles));
  }
  return out.slice(0, n);
}

// ---- Slimme zoekfunctie: begrijpt kleur, categorie, seizoen en prijs ("stevige winterboots onder €40")
const SYNONYMS: Record<string, string[]> = {
  winter: [
    "laars",
    "laarzen",
    "boots",
    "furry",
    "warm",
    "pantoffel",
    "gevoerd",
    "teddy",
    "suèdine",
  ],
  zomer: ["sandalen", "slippers", "slingbacks", "sandaal"],
  stevig: ["boots", "laarzen", "stoere", "stevige", "klompen"],
  stevige: ["boots", "laarzen", "stoere", "klompen"],
  warm: ["furry", "pantoffels", "gevoerd", "laarzen"],
  festival: ["boots festival", "boots", "stoere"],
  kinder: ["kids", "kinderschoenen"],
  kids: ["kids"],
  tas: ["tas", "tasje", "tassen", "schoudertas"],
  tassen: ["tas", "tasje", "tassen"],
  portemonnee: ["portemonnee"],
  sloffen: ["pantoffels", "slippers"],
  hak: ["hak", "hakje", "blokhak"],
};
const STOP = new Set([
  "een",
  "de",
  "het",
  "met",
  "voor",
  "en",
  "of",
  "in",
  "op",
  "van",
  "mijn",
  "te",
  "naar",
  "onder",
  "tot",
  "max",
  "maximaal",
  "goedkope",
  "goedkoop",
  "euro",
]);
const ALL_COLORS = [...new Set(PRODUCTS.flatMap((p) => p.k))];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export type SearchResult = {
  results: Product[];
  maxPrice?: number;
  colors: string[];
  onlySale: boolean;
};

export function searchProducts(query: string): SearchResult {
  const q = norm(query.trim());
  const empty: SearchResult = { results: [], colors: [], onlySale: false };
  if (!q) return empty;

  let maxPrice: number | undefined;
  const priceMatch = q.match(
    /(?:onder|tot|max(?:imaal)?|<)\s*€?\s*(\d+(?:[.,]\d+)?)|€\s*(\d+(?:[.,]\d+)?)\s*(?:of minder|max)?/,
  );
  if (priceMatch) maxPrice = parseFloat((priceMatch[1] ?? priceMatch[2] ?? "").replace(",", "."));
  const text = q.replace(
    /(?:onder|tot|max(?:imaal)?|<)\s*€?\s*\d+(?:[.,]\d+)?|€\s*\d+(?:[.,]\d+)?/g,
    " ",
  );

  // Ook verbogen vormen ("zwarte", "rode") tellen als kleur
  const colorRe = (c: string) => new RegExp(`^${norm(c)}(?:e|en)?$`);
  const colors = ALL_COLORS.filter((c) => text.split(/[^a-z0-9]+/).some((w) => colorRe(c).test(w)));
  const onlySale = /\b(sale|aanbieding|korting|afgeprijsd)\b/.test(text);
  const words = text
    .split(/[^a-z0-9è]+/)
    .filter(
      (w) =>
        w.length > 1 &&
        !STOP.has(w) &&
        !colors.some((c) => colorRe(c).test(w)) &&
        !["sale", "aanbieding", "korting", "afgeprijsd"].includes(w),
    );

  const scored = PRODUCTS.map((p) => {
    if (maxPrice && p.p > maxPrice) return null;
    if (colors.length && !p.k.some((k) => colors.includes(k))) return null;
    if (onlySale && !p.w) return null;
    const hay = norm(`${p.t} ${p.c.replace("-", " ")} ${p.g}`);
    let score = 0;
    for (const w of words) {
      const stem = w.length > 4 ? w.replace(/(s|en|je|jes)$/, "") : w;
      if (hay.includes(w) || hay.includes(stem)) score += 3;
      else {
        const syn = SYNONYMS[w] ?? SYNONYMS[stem];
        if (syn?.some((s) => hay.includes(norm(s)))) score += 1.5;
        else if (words.length === 1 || !SYNONYMS[w]) return null; // onbekend woord: sluit uit
      }
    }
    if (!words.length) score = 1;
    return score > 0 ? { p, score } : null;
  }).filter((x): x is { p: Product; score: number } => !!x);

  scored.sort(
    (a, b) => b.score - a.score || Number(b.p.s) - Number(a.p.s) || b.p.a.localeCompare(a.p.a),
  );
  return { results: scored.map((x) => x.p), colors, onlySale, ...(maxPrice ? { maxPrice } : {}) };
}

export const shippingFor = (subtotal: number) =>
  subtotal === 0 ? 0 : subtotal >= SITE.freeShippingFrom ? 0 : SITE.shippingCost;

/** Title-tag: merknaam erachter als het past, anders alleen de titel (afgekort tot ~70 tekens). */
export function seoTitle(title: string, brand = "GoedkopeSchoenen.com", max = 70): string {
  const full = `${title} | ${brand}`;
  if (full.length <= max) return full;
  if (title.length <= max) return title;
  return title.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

/** Meta-description: afgekapt op ~160 tekens, op een woordgrens. */
export function seoDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}
