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

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** De "variant" van een cadeaubon-regel: voor wie en met welke boodschap. */
export function voucherVariant(to: string, message: string) {
  const msg = clean(message);
  return `Voor ${clean(to)}${msg ? ` — “${msg}”` : ""}`.slice(0, 240);
}

/** Omgekeerde van `voucherVariant`, voor de bon die na aankoop getoond wordt. */
export function parseVoucherVariant(variant: string): { to: string; message: string } {
  const m = /^Voor (.*?)(?: — “(.*)”)?$/s.exec(variant);
  return { to: m?.[1] ?? "", message: m?.[2] ?? "" };
}

/**
 * Unieke, besteedbare code. Alleen aanroepen wanneer de bon echt is betaald en de code ook in
 * een backend wordt vastgelegd; een code die nergens geldt, mag niet getoond worden.
 */
export function generateVoucherCode(random: () => number = Math.random) {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () =>
    Array.from({ length: 4 }, () => abc[Math.floor(random() * abc.length)]).join("");
  return `GS-${part()}-${part()}-${part()}`;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrap(text: string, max: number, maxLines: number) {
  const lines: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1]!.replace(/.{0,2}$/, "…");
  }
  return lines;
}

/** De ontworpen cadeaubon als SVG (800×500): zelfde bron voor weergave, download en print. */
export function voucherSvg(o: {
  amount: number | null;
  to: string;
  message: string;
  code?: string | undefined;
}) {
  const amount = o.amount === null ? "€ —" : `€${o.amount}`;
  const to = o.to ? `Voor ${o.to}` : "Voor jou";
  const msg = wrap(o.message ? `“${o.message}”` : "", 44, 3);
  const font = "Archivo, 'Arial Black', Arial, sans-serif";
  const body = "Inter, Arial, sans-serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500" role="img">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9633A"/><stop offset="1" stop-color="#8F4220"/></linearGradient>
<clipPath id="c"><rect width="800" height="500" rx="32"/></clipPath></defs>
<g clip-path="url(#c)"><rect width="800" height="500" fill="url(#g)"/>
<g fill="#fff" opacity="0.07"><circle cx="720" cy="60" r="190"/><circle cx="660" cy="470" r="120"/></g>
<g fill="#fff" opacity="0.1"><path d="M470 0h60L330 500h-60z"/><path d="M570 0h30L400 500h-30z"/></g>
<g transform="translate(48 48)"><rect x="0" y="30" width="9" height="14" rx="2" fill="#fff" transform="skewX(-8)"/><rect x="14" y="22" width="9" height="22" rx="2" fill="#141413" transform="skewX(-8)"/><rect x="28" y="14" width="9" height="30" rx="2" fill="#141413" transform="skewX(-8)"/></g>
<text x="96" y="90" fill="#fff" font-family="${font}" font-weight="800" font-size="26">GoedkopeSchoenen</text>
<text x="48" y="210" fill="#fff" fill-opacity="0.85" font-family="${body}" font-weight="600" font-size="20" letter-spacing="5">CADEAUBON</text>
<text x="44" y="300" fill="#fff" font-family="${font}" font-weight="800" font-size="104">${esc(amount)}</text>
<text x="48" y="362" fill="#fff" font-family="${font}" font-weight="700" font-size="28">${esc(to.slice(0, 40))}</text>
${msg.map((l, i) => `<text x="48" y="${398 + i * 26}" fill="#fff" fill-opacity="0.92" font-family="${body}" font-size="20" font-style="italic">${esc(l)}</text>`).join("\n")}
${o.code ? `<rect x="480" y="418" width="272" height="46" rx="23" fill="#fff"/><text x="616" y="448" text-anchor="middle" fill="#141413" font-family="${body}" font-weight="700" font-size="20" letter-spacing="2">${esc(o.code)}</text>` : ""}
</g></svg>`;
}
