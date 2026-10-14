import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { COLLECTIONS, PRODUCTS, seoDescription, seoTitle } from "@/lib/catalog";

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const robots = readFileSync("public/robots.txt", "utf8");

describe("sitemap", () => {
  it("bevat alle producten en collecties", () => {
    for (const p of PRODUCTS) expect(sitemap).toContain(`/products/${p.h}</loc>`);
    for (const c of COLLECTIONS) expect(sitemap).toContain(`/collectie/${c.slug}</loc>`);
  });

  it("wordt in robots.txt aangewezen en sluit privé-pagina's uit", () => {
    expect(robots).toContain("Sitemap: https://goedkopeschoenen.com/sitemap.xml");
    for (const path of ["/account", "/afrekenen", "/winkelwagen"])
      expect(robots).toContain(`Disallow: ${path}`);
  });
});

describe("title en description", () => {
  it("houdt titels binnen 70 tekens en eindigt netjes", () => {
    for (const p of PRODUCTS) expect(seoTitle(p.t).length).toBeLessThanOrEqual(70);
    expect(seoTitle("Korte titel")).toBe("Korte titel | GoedkopeSchoenen.com");
  });

  it("kapt descriptions af op een woordgrens", () => {
    const long = "woord ".repeat(60);
    const d = seoDescription(long);
    expect(d.length).toBeLessThanOrEqual(160);
    expect(d.endsWith("…")).toBe(true);
  });
});
