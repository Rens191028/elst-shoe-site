import { img, type Product } from "@/lib/catalog";

/**
 * Laat een mini-foto van het product van `from` naar het winkelwagen-icoon vliegen.
 * Doet niets bij prefers-reduced-motion of als het icoon niet in beeld is.
 */
export function flyToCart(from: Element | null | undefined, product: Pick<Product, "i">) {
  if (typeof window === "undefined" || !from) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector("[data-cart-target]");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (b.bottom < 0 || b.top > window.innerHeight) return; // header is weggeschoven

  const size = 56;
  const el = document.createElement("img");
  el.src = img(product.i, 160);
  el.alt = "";
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "14px",
    zIndex: "70",
    pointerEvents: "none",
    boxShadow: "0 10px 28px rgba(20,20,19,0.3)",
    background: "#f0eee8",
  });
  document.body.appendChild(el);

  const sx = a.left + a.width / 2 - size / 2;
  const sy = a.top + a.height / 2 - size / 2;
  const ex = b.left + b.width / 2 - size / 2;
  const ey = b.top + b.height / 2 - size / 2;
  const anim = el.animate(
    [
      { transform: `translate(${sx}px, ${sy}px) scale(1)`, opacity: 1 },
      {
        transform: `translate(${(sx + ex) / 2}px, ${Math.min(sy, ey) - 70}px) scale(0.8)`,
        opacity: 1,
        offset: 0.5,
      },
      { transform: `translate(${ex}px, ${ey}px) scale(0.2)`, opacity: 0.15 },
    ],
    { duration: 700, easing: "cubic-bezier(0.45, 0.05, 0.55, 0.95)" },
  );
  anim.onfinish = () => el.remove();
  anim.oncancel = () => el.remove();
}
