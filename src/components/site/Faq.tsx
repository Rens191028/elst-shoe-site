import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { Faq } from "@/data/faq";
import { Reveal } from "@/components/site/motion";
import { cn } from "@/lib/utils";

/** Accordeon: hoogte + fade, pijltje draait mee. `onToggle` laat het 3D-object meereageren. */
export function FaqList({
  items,
  onToggle,
  className,
}: {
  items: Faq[];
  onToggle?: (open: boolean) => void;
  className?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const uid = useId();
  return (
    <ul
      className={cn("divide-y divide-border rounded-2xl border border-border bg-white", className)}
    >
      {items.map((f, i) => {
        const open = openIdx === i;
        return (
          <li key={f.q}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${uid}-${i}`}
                onClick={() => {
                  setOpenIdx(open ? null : i);
                  onToggle?.(!open);
                }}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-sans text-base font-semibold tracking-normal"
              >
                {f.q}
                <ChevronDown
                  className="faq-chevron h-5 w-5 shrink-0 text-primary"
                  data-open={open}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div id={`${uid}-${i}`} className="faq-panel" data-open={open} inert={!open}>
              <div>
                <p className="px-5 pb-4 leading-relaxed text-muted-foreground">
                  {f.a}
                  {f.links?.map((l) => (
                    <span key={l.to}>
                      {" "}
                      <Link
                        to={l.to}
                        className="font-semibold text-ink underline underline-offset-4 hover:text-primary-text"
                      >
                        {l.label} →
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const W = 150;
const H = 70;
const D = 110;
const face = "absolute left-1/2 top-1/2";
const place = (w: number, h: number, t: string): React.CSSProperties => ({
  width: w,
  height: h,
  marginLeft: -w / 2,
  marginTop: -h / 2,
  transform: t,
});

/** Puur decoratief: een draaiende schoendoos; het deksel gaat open als er een vraag openstaat. */
export function ShoeBox3D({
  open,
  pulse,
  className,
}: {
  open: boolean;
  pulse: number;
  className?: string;
}) {
  const body = "linear-gradient(160deg,#c4663b,#a24d27)";
  const dark = "#8f4322";
  const lidCol = "linear-gradient(160deg,#d27a4d,#b5582e)";
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none flex items-center justify-center", className)}
      style={{ perspective: 900 }}
    >
      <div key={pulse} className={pulse ? "box-bounce" : undefined}>
        <div style={{ transform: "rotateX(-22deg)", transformStyle: "preserve-3d" }}>
          <div className="box-spin relative" style={{ width: 0, height: 0 }}>
            <div
              className={face}
              style={{ ...place(W, H, `translateZ(${D / 2}px)`), background: body }}
            />
            <div
              className={face}
              style={{ ...place(W, H, `rotateY(180deg) translateZ(${D / 2}px)`), background: body }}
            />
            <div
              className={face}
              style={{ ...place(D, H, `rotateY(90deg) translateZ(${W / 2}px)`), background: dark }}
            />
            <div
              className={face}
              style={{ ...place(D, H, `rotateY(-90deg) translateZ(${W / 2}px)`), background: dark }}
            />
            <div
              className={face}
              style={{
                ...place(W, D, `rotateX(-90deg) translateZ(${H / 2}px)`),
                background: "#6f361b",
              }}
            />
            {/* binnenkant met tissuepapier */}
            <div
              className={face}
              style={{
                ...place(W - 8, D - 8, `rotateX(90deg) translateZ(${H / 2 - 14}px)`),
                background: "#f4ead8",
              }}
            />
            <div
              className="box-lid absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
              style={{
                width: 0,
                height: 0,
                transform: `translate3d(0,${-H / 2}px,${-D / 2}px) rotateX(${open ? 108 : 0}deg)`,
              }}
            >
              <div
                className={cn(face, "flex items-center justify-center gap-1")}
                style={{
                  ...place(W + 6, D + 6, `translate3d(0,0,${D / 2}px) rotateX(90deg)`),
                  background: lidCol,
                }}
              >
                {[14, 22, 30].map((h, i) => (
                  <span
                    key={h}
                    className="block w-2 -skew-x-12 rounded-[2px]"
                    style={{ height: h, background: i === 0 ? "#fff" : "#141413" }}
                  />
                ))}
              </div>
              <div
                className={face}
                style={{ ...place(W + 6, 16, `translate3d(0,8px,${D + 3}px)`), background: dark }}
              />
              <div
                className={face}
                style={{
                  ...place(
                    D + 6,
                    16,
                    `translate3d(${-(W + 6) / 2}px,8px,${D / 2}px) rotateY(-90deg)`,
                  ),
                  background: dark,
                }}
              />
              <div
                className={face}
                style={{
                  ...place(
                    D + 6,
                    16,
                    `translate3d(${(W + 6) / 2}px,8px,${D / 2}px) rotateY(90deg)`,
                  ),
                  background: dark,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Homepage-sectie: korte FAQ naast het 3D-object, met doorlink naar de volledige pagina. */
export function FaqSection({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  return (
    <section
      aria-labelledby="faq-h"
      className="bg-gradient-to-b from-[#f6ebe0] to-[#f1e1d3] py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20 lg:px-6">
        <Reveal className="hidden lg:block">
          <ShoeBox3D open={open} pulse={pulse} className="h-[340px]" />
        </Reveal>
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-text">
            Veelgestelde vragen
          </p>
          <h2 id="faq-h" className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
            Snel antwoord op je vraag
          </h2>
          <FaqList
            className="mt-8"
            items={items}
            onToggle={(o) => {
              setOpen(o);
              setPulse((n) => n + 1);
            }}
          />
          <Link
            to="/faq"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Bekijk alle vragen →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
