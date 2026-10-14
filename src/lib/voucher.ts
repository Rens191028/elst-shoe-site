import type { Product } from "@/lib/catalog";

/** Digitale cadeaubon: een virtueel product dat via de gewone winkelwagen loopt. */
export const VOUCHER_AMOUNTS = [10, 25, 50, 75] as const;
export const VOUCHER_MIN = 5;
export const VOUCHER_MAX = 250;
const PREFIX = "cadeaubon-";

export const voucherHandle = (amount: number) => `${PREFIX}${amount}`;

export function parseVoucherHandle(handle: string): number | null {
  if (!handle.startsWith(PREFIX)) return null;
  const n = Number(handle.slice(PREFIX.length));
  return Number.isInteger(n) && n >= VOUCHER_MIN && n <= VOUCHER_MAX ? n : null;
}

export const isVoucher = (handle: string) => parseVoucherHandle(handle) !== null;

export function voucherProduct(amount: number): Product {
  return {
    h: voucherHandle(amount),
    t: `Cadeaubon €${amount}`,
    c: "cadeaubon",
    g: "cadeaubon",
    p: amount,
    w: null,
    s: true,
    k: [],
    m: [],
    i: "/cadeaubon.svg",
    a: "",
  };
}

/** De "variant" van een cadeaubon-regel: voor wie en met welke boodschap. */
export function voucherVariant(to: string, email: string, message: string) {
  const clean = (s: string) => s.replace(/\s+/g, " ").trim();
  const msg = clean(message);
  return `Voor ${clean(to)} (${clean(email)})${msg ? ` — “${msg}”` : ""}`.slice(0, 240);
}
