// Genereert public/sitemap.xml uit de catalogus. Draai opnieuw na elke catalogus-update:
//   node scripts/build-sitemap.mjs
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://goedkopeschoenen.com";
const products = JSON.parse(readFileSync("src/data/products.json", "utf8"));

// Moet overeenkomen met COLLECTIONS in src/lib/catalog.ts (src/test/seo.test.ts bewaakt dat)
const collections = [
  "schoenen", "tassen", "accessoires",
  "laarzen", "sneakers", "boots-festival", "pantoffels", "overig-schoenen",
  "schoudertasjes", "grote-tassen", "portemonnees", "sieraden",
  "sale", "nieuw",
];
const pages = ["/", "/over-ons", "/contact", "/faq", "/verzending-retour", "/maatadvies", "/cadeaubon", "/kennisbank"];
// Artikelen uit src/data/articles.ts (slugs hieronder moeten overeenkomen; src/test/seo.test.ts bewaakt dat)
const articles = readFileSync("src/data/articles.ts", "utf8")
  .split("\n")
  .flatMap((l) => (l.match(/^\s{4}slug: "([^"]+)"/) ? [l.match(/"([^"]+)"/)[1]] : []));
const newest = products.reduce((m, p) => (p.a > m ? p.a : m), "");

const url = (loc, lastmod, priority) =>
  `  <url><loc>${BASE}${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<priority>${priority}</priority></url>`;

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((p) => url(p, p === "/" ? newest : undefined, p === "/" ? "1.0" : "0.5")),
  ...collections.map((c) => url(`/collectie/${c}`, newest, "0.8")),
  ...articles.map((a) => url(`/kennisbank/${a}`, undefined, "0.6")),
  ...products.map((p) => url(`/products/${p.h}`, p.a || undefined, "0.6")),
  "</urlset>",
  "",
].join("\n");

writeFileSync("public/sitemap.xml", xml);
console.log(`${pages.length + collections.length + articles.length + products.length} URL's in public/sitemap.xml`);
