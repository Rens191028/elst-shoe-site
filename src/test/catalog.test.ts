import { describe, expect, it } from "vitest";
import {
  applyFilters,
  crossSell,
  facets,
  inCollection,
  getCollection,
  PRODUCTS,
  related,
  searchProducts,
} from "@/lib/catalog";
import { adviseSize } from "@/routes/maatadvies";

describe("catalogus", () => {
  it("bevat alle 750 producten met geldige prijzen", () => {
    expect(PRODUCTS).toHaveLength(750);
    expect(PRODUCTS.every((p) => p.p > 0 && (p.w === null || p.w > p.p))).toBe(true);
  });

  it("normaliseert kleuren (geen 'bruin'/'Bruin'-dubbelen)", () => {
    const colors = facets(PRODUCTS).colors.map((c) => c.name);
    expect(new Set(colors.map((c) => c.toLowerCase())).size).toBe(colors.length);
  });

  it("verdeelt alle producten over schoenen, tassen en accessoires", () => {
    const total = ["schoenen", "tassen", "accessoires"].reduce(
      (n, s) => n + inCollection(getCollection(s)!).length,
      0,
    );
    expect(total).toBe(750);
  });

  it("sale bevat alleen producten met echte korting", () => {
    expect(inCollection(getCollection("sale")!).every((p) => p.w && p.w > p.p)).toBe(true);
  });

  it("filtert op maat, prijs en kleur", () => {
    const res = applyFilters(PRODUCTS, { maat: "38", max: 30, kleur: ["Zwart"] });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((p) => p.m.includes("38") && p.p <= 30 && p.k.includes("Zwart"))).toBe(true);
  });

  it("toont gerelateerde producten alleen binnen dezelfde categorie", () => {
    const p = PRODUCTS.find((x) => x.c === "sieraden")!;
    expect(related(p, 4).every((x) => x.c === "sieraden")).toBe(true);
    expect(crossSell([p.h]).every((x) => x.c === "sieraden")).toBe(true);
  });
});

describe("slim zoeken", () => {
  it("begrijpt kleur, categorie en maximumprijs", () => {
    const r = searchProducts("zwarte laarzen onder €40");
    expect(r.maxPrice).toBe(40);
    expect(r.results.length).toBeGreaterThan(0);
    expect(r.results.every((p) => p.p <= 40)).toBe(true);
  });

  it("geeft niets terug voor onzin", () => {
    expect(searchProducts("xqzvw").results).toHaveLength(0);
  });
});

describe("maatadvies", () => {
  it("rekent voetlengte om naar EU-maat", () => {
    expect(adviseSize(25, "normaal")).toBe(40);
    expect(adviseSize(25, "breed")).toBe(41);
  });
});
