import { shippingCutoff } from "@/lib/cutoff";
import { describe, expect, it } from "vitest";
import { BUNDLES, priceLines } from "@/lib/bundles";
import { PRODUCTS, getProduct, variantLabel } from "@/lib/catalog";
import { orderConfirmationEmail } from "@/lib/emails/orderConfirmation";
import { adviseSize, footLengthFor } from "@/lib/sizing";
import { parseVoucherHandle, voucherHandle, voucherProduct, voucherVariant } from "@/lib/voucher";

const shoe = (n: number, sale = false) =>
  PRODUCTS.filter((p) => p.g === "schoenen" && p.s && (sale ? p.w : !p.w))[n]!;

describe("bundelkorting", () => {
  it("geeft 10% bij 2 paar schoenen buiten de sale", () => {
    const a = shoe(0);
    const b = shoe(1);
    const r = priceLines([
      { product: a, qty: 1 },
      { product: b, qty: 1 },
    ]);
    expect(r.bundle?.id).toBe(BUNDLES[0]!.id);
    expect(r.discount).toBeCloseTo((a.p + b.p) * 0.1, 2);
    expect(r.net).toBeCloseTo(r.subtotal - r.discount, 2);
  });

  it("geeft geen korting bij 1 paar maar wel een aanmoediging", () => {
    const r = priceLines([{ product: shoe(0), qty: 1 }]);
    expect(r.discount).toBe(0);
    expect(r.hint).toMatch(/Nog 1 paar erbij/);
  });

  it("telt sale-producten niet mee", () => {
    const r = priceLines([
      { product: shoe(0, true), qty: 1 },
      { product: shoe(1, true), qty: 1 },
    ]);
    expect(r.discount).toBe(0);
  });

  it("rekent verzending op het bedrag na korting", () => {
    const tas = PRODUCTS.find((p) => p.g === "tassen" && p.s && p.p >= 13 && p.p < 20)!;
    expect(priceLines([{ product: tas, qty: 1 }]).shipping).toBeGreaterThan(0);
    expect(priceLines([{ product: tas, qty: 5 }]).shipping).toBe(0);
  });
});

describe("cadeaubon", () => {
  it("is een virtueel product via getProduct en heeft geen verzendkosten", () => {
    const p = getProduct(voucherHandle(25))!;
    expect(p.t).toBe("Cadeaubon €25");
    expect(p.p).toBe(25);
    expect(priceLines([{ product: p, qty: 1 }]).shipping).toBe(0);
    expect(PRODUCTS).toHaveLength(750); // zit niet in de catalogus
  });

  it("weigert ongeldige bedragen", () => {
    expect(parseVoucherHandle("cadeaubon-1")).toBeNull();
    expect(parseVoucherHandle("cadeaubon-9999")).toBeNull();
    expect(parseVoucherHandle("cadeaubon-abc")).toBeNull();
    expect(getProduct("cadeaubon-0")).toBeUndefined();
  });

  it("toont voor wie de bon is in plaats van een maat", () => {
    const v = voucherVariant("Anna", "Veel plezier!");
    expect(variantLabel(voucherProduct(25), v)).toContain("Anna");
    expect(variantLabel(shoe(0), "38")).toBe("Maat 38");
  });
});

describe("maten en e-mail", () => {
  it("houdt de tabel consistent met het advies", () => {
    for (const n of [36, 39, 42]) expect(adviseSize(footLengthFor(n), "normaal")).toBe(n);
  });

  it("maakt een orderbevestiging zonder ongeëscapete invoer", () => {
    const mail = orderConfirmationEmail({
      orderNumber: "AB12CD34",
      name: "<script>x</script>",
      lines: [{ title: "Laars", variant: "Maat 38", qty: 1, price: 39.99 }],
      price: { subtotal: 39.99, discount: 0, shipping: 0, total: 39.99 },
    });
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("AB12CD34");
    expect(mail.text).toContain("Totaal");
  });
});

describe("verzendbelofte", () => {
  const at = (iso: string) => shippingCutoff(new Date(iso));
  it("telt af tot 15:00 Nederlandse tijd op werkdagen", () => {
    // di 13 okt 2026, 12:00 UTC = 14:00 in Amsterdam (zomertijd) → nog 1 uur
    expect(at("2026-10-13T12:00:00Z")).toEqual({ open: true, secondsLeft: 3600 });
  });
  it("verzendt na 15:00 morgen, en na vrijdag 15:00 of in het weekend maandag", () => {
    expect(at("2026-10-13T14:00:00Z")).toEqual({ open: false, shipsOn: "morgen" });
    expect(at("2026-10-16T14:00:00Z")).toEqual({ open: false, shipsOn: "maandag" });
    expect(at("2026-10-17T09:00:00Z")).toEqual({ open: false, shipsOn: "maandag" });
    expect(at("2026-10-18T09:00:00Z")).toEqual({ open: false, shipsOn: "maandag" });
  });
});
