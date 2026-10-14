import { useEffect, useRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Dunne voortgangsbalk in de accentkleur bovenaan de pagina. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? d.scrollTop / max : 0})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-cta" />
    </div>
  );
}

/** Zachte ripple vanaf het klikpunt op primaire knoppen (en elementen met data-ripple). */
export function RippleInit() {
  useEffect(() => {
    if (reduced()) return;
    const onDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "button.bg-cta, a.bg-cta, [data-ripple]",
      );
      if (!el || (el as HTMLButtonElement).disabled) return;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const host = document.createElement("span");
      host.className = "ripple-host";
      host.setAttribute("aria-hidden", "true");
      const dot = document.createElement("span");
      dot.className = "ripple";
      Object.assign(dot.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${e.clientX - r.left - size / 2}px`,
        top: `${e.clientY - r.top - size / 2}px`,
      });
      host.appendChild(dot);
      el.appendChild(host);
      setTimeout(() => host.remove(), 650);
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}

/** Laat een knop licht meebewegen met de muis (alleen desktop, niet bij reduced motion). */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover)").matches || reduced()) return;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${clamp(x, 7)}px, ${clamp(y, 4)}px)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return ref;
}

/** Knop die licht met de muis meebeweegt; gewone <button> voor de rest. */
export function MagneticButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagnetic<HTMLButtonElement>();
  return <button ref={ref} className={cn("magnetic", className)} {...props} />;
}
