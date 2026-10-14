import { Link } from "@tanstack/react-router";
import { Hand, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { img, money, type Product } from "@/lib/catalog";
import { Photo } from "@/components/site/product";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Uitgelicht product met pseudo-3D: de foto zwaait zacht heen en weer, volgt je vinger of muis
 * als je sleept en draait subtiel mee met scrollen. Het is één foto (geen echt 3D-model), dus de
 * rotatie blijft bewust beperkt. Zonder beweging bij prefers-reduced-motion (slepen blijft werken).
 */
export function HeroProduct({ product }: { product: Product }) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const st = useRef({ dragging: false, sx: 0, sy: 0, bx: 0, by: 0, dx: 0, dy: 0, weight: 1 });
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const s = st.current;

    const frame = (t: number) => {
      if (visible && !document.hidden) {
        if (!s.dragging) {
          s.dx *= 0.94; // losgelaten: sleep-hoek zakt langzaam terug
          s.dy *= 0.94;
          s.weight = Math.min(1, s.weight + 0.012); // daarna neemt de auto-rotatie het weer over
        }
        const sway = reduce ? 0 : Math.sin(t / 1900) * 15 * s.weight;
        const bob = reduce ? 0 : Math.cos(t / 2300) * 2.5 * s.weight;
        const scroll = reduce ? 0 : (Math.min(window.scrollY, 700) / 700) * 16;
        const ry = s.dx + sway + scroll;
        const rx = s.dy + bob;
        if (card.current) card.current.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;
        if (floor.current) {
          floor.current.style.transform = `translateX(${-ry * 0.9}px) scaleX(${1 - Math.min(Math.abs(ry), 45) / 140})`;
          floor.current.style.opacity = String(0.55 - Math.min(Math.abs(ry), 45) / 200);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const down = (e: React.PointerEvent) => {
    const s = st.current;
    s.dragging = true;
    s.sx = e.clientX;
    s.sy = e.clientY;
    s.bx = s.dx;
    s.by = s.dy;
    s.weight = 0;
    moved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const s = st.current;
    if (!s.dragging) return;
    const ddx = e.clientX - s.sx;
    const ddy = e.clientY - s.sy;
    if (Math.abs(ddx) > 6 || Math.abs(ddy) > 6) moved.current = true;
    s.dx = clamp(s.bx + ddx * 0.35, -42, 42);
    s.dy = clamp(s.by - ddy * 0.2, -14, 14);
    if (moved.current) setHint(false);
  };
  const up = () => {
    st.current.dragging = false;
  };

  return (
    <div
      ref={wrap}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      // Een sleepgebaar mag de link niet openen
      onClickCapture={(e) => {
        if (moved.current) {
          e.preventDefault();
          e.stopPropagation();
          moved.current = false;
        }
      }}
      className="relative mx-auto w-full max-w-md cursor-grab touch-pan-y select-none [perspective:1100px] active:cursor-grabbing"
    >
      <div ref={card} className="relative [transform-style:preserve-3d] will-change-transform">
        <Link
          to="/products/$handle"
          params={{ handle: product.h }}
          draggable={false}
          className="hero-surface relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-lift"
          aria-label={`Bekijk ${product.t}`}
        >
          <Photo
            product={product}
            width={800}
            eager
            className="pointer-events-none h-full w-full object-cover"
            sizes="(min-width:1024px) 440px, 90vw"
          />
        </Link>
        <div className="pointer-events-none absolute -left-4 bottom-8 hidden rounded-2xl bg-white px-4 py-3 shadow-lift [transform:translateZ(60px)] sm:block">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-soft">Nu</p>
          <p className="font-display text-xl font-extrabold text-primary">{money(product.p)}</p>
          {product.w && <p className="text-xs text-soft line-through">{money(product.w)}</p>}
        </div>
        <div className="pointer-events-none absolute -right-3 top-8 hidden items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-white shadow-lift [transform:translateZ(80px)] sm:flex">
          <Truck className="h-4 w-4" />
          <span className="text-xs font-semibold">Voor 15:00 besteld, vandaag verzonden</span>
        </div>
      </div>

      {/* Diepte: zachte schaduw op de vloer en een vage reflectie onder het product */}
      <div
        ref={floor}
        aria-hidden="true"
        className="mx-auto mt-3 h-5 w-3/4 rounded-[50%] bg-ink/60 opacity-50 blur-xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto -mt-1 h-20 w-[92%] scale-y-[-1] overflow-hidden rounded-3xl opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      >
        <img
          src={img(product.i, 600)}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="absolute inset-x-0 bottom-0 h-auto w-full"
        />
      </div>

      <p
        aria-hidden="true"
        className={`pointer-events-none mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-soft transition-opacity duration-500 ${hint ? "opacity-100" : "opacity-0"}`}
      >
        <Hand className="h-3.5 w-3.5" /> Sleep om te draaien
      </p>
    </div>
  );
}
