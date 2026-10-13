import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 3D-tilt die meebeweegt met de muis. Uit bij prefers-reduced-motion en op touch. */
export function Tilt({
  children,
  max = 26,
  className,
  style,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const enabled = () =>
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(hover: hover)").matches;

  const move = (e: React.PointerEvent) => {
    if (!enabled()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) scale3d(1.02,1.02,1.02)`;
      el.style.boxShadow = `${-x * 22}px ${28 + y * 12}px 50px -18px rgba(20,20,19,0.38)`;
    });
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = "";
    el.style.boxShadow = "";
  };
  return (
    <div
      onPointerMove={move}
      onPointerLeave={reset}
      className={cn("[perspective:900px]", className)}
      style={style}
    >
      <div
        ref={ref}
        className="transition-[transform,box-shadow] duration-200 ease-out will-change-transform [transform-style:preserve-3d]"
      >
        {children}
      </div>
    </div>
  );
}
