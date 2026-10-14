import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Zweeft zachtjes en schuift licht mee met scrollen (parallax). Vast bij prefers-reduced-motion. */
export function Floaty({
  children,
  factor = 0.06,
  delay = 0,
  className,
}: {
  children: ReactNode;
  factor?: number;
  delay?: number;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = outer.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const raw = (r.top + r.height / 2 - window.innerHeight / 2) * factor;
      const offset = Math.max(-14, Math.min(14, raw)); // blijft binnen de kaart
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = !!e?.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [factor]);
  return (
    <div ref={outer} className={className}>
      <div className="float-y" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </div>
  );
}

function Bar({ w, h, d, tone }: { w: number; h: number; d: number; tone: "accent" | "ink" }) {
  const front =
    tone === "accent"
      ? "linear-gradient(160deg,#c4663b,#a24d27)"
      : "linear-gradient(160deg,#3a3a37,#141413)";
  const side = tone === "accent" ? "#8f4322" : "#0b0b0a";
  const face = "absolute inset-0 rounded-[3px]";
  return (
    <div
      className="relative [transform-style:preserve-3d]"
      style={{ width: w, height: h, transform: "skewX(-18deg)" }}
    >
      <div className={face} style={{ background: front, transform: `translateZ(${d / 2}px)` }} />
      <div
        className={face}
        style={{ background: side, transform: `rotateY(180deg) translateZ(${d / 2}px)` }}
      />
      <div
        className={face}
        style={{
          background: side,
          width: d,
          left: (w - d) / 2,
          transform: `rotateY(-90deg) translateZ(${w / 2}px)`,
        }}
      />
      <div
        className={face}
        style={{
          background: side,
          width: d,
          left: (w - d) / 2,
          transform: `rotateY(90deg) translateZ(${w / 2}px)`,
        }}
      />
    </div>
  );
}

/** Puur decoratief: het merkicoon (drie gekantelde balken) als langzaam draaiend 3D-object. */
export function Deco3D({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none hidden [perspective:700px] lg:block", className)}
    >
      <div className="spin-3d flex items-end gap-3 [transform-style:preserve-3d]">
        <Bar w={26} h={64} d={26} tone="accent" />
        <Bar w={26} h={104} d={26} tone="ink" />
        <Bar w={26} h={144} d={26} tone="ink" />
      </div>
    </div>
  );
}
