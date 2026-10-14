import { describe, expect, it } from "vitest";
import { LOW_STOCK, lowStock, lowStockLabel, sizeStock, totalStock } from "@/lib/stock";
import { PRODUCTS } from "@/lib/catalog";

describe("voorraad", () => {
  const p = PRODUCTS.find((x) => x.s)!;

  it("toont zonder aangeleverde voorraaddata nooit een aantal", () => {
    expect(sizeStock(p, p.m[0] ?? "")).toBeUndefined();
    expect(totalStock(p)).toBeUndefined();
    expect(lowStock(p)).toBeUndefined();
  });

  it("formuleert het label in enkelvoud en meervoud", () => {
    expect(lowStockLabel(1)).toBe("Nog maar 1 op voorraad");
    expect(lowStockLabel(2)).toBe("Nog maar 2 op voorraad");
    expect(LOW_STOCK).toBeGreaterThan(0);
  });
});
