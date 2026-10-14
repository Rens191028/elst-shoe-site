import { IconSneaker } from "@/components/site/icons";
import { cn } from "@/lib/utils";

/** Merk-laadanimatie: een stuiterende sneaker met schaduw (rustig, uit bij reduced motion). */
export function BrandLoader({
  className,
  label = "Laden…",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      className={cn("flex min-h-[50vh] flex-col items-center justify-center gap-2", className)}
    >
      <IconSneaker className="shoe-hop h-12 w-12 text-primary" />
      <span aria-hidden="true" className="shoe-shadow h-1.5 w-10 rounded-[50%] bg-ink" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Zachte golf als overgang tussen secties. `from` = kleur van de sectie erboven. */
export function Wave({
  fill,
  flip,
  className,
}: {
  /** CSS-kleur van de sectie eronder (wat de golf "vult") */
  fill: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 70"
      preserveAspectRatio="none"
      className={cn("block h-[34px] w-full md:h-[56px]", flip && "rotate-180", className)}
    >
      <path d="M0 40c240 50 480 50 720 20S1200 0 1440 30v40H0z" fill={fill} />
    </svg>
  );
}

const COLORS = ["#b5582e", "#141413", "#e8a97e", "#f4d9c4", "#99471f"];
/** Eenmalige sprankel-/confettiburst achter de checkmark. Puur decoratief. */
export function ConfettiBurst() {
  const pieces = Array.from({ length: 26 }, (_, k) => {
    const a = (k / 26) * Math.PI * 2 + (k % 3) * 0.2;
    const d = 90 + (k % 5) * 28;
    return {
      "--tx": `${Math.cos(a) * d}px`,
      "--ty": `${Math.sin(a) * d - 20}px`,
      "--r": `${(k * 47) % 360}deg`,
      background: COLORS[k % COLORS.length],
      animationDelay: `${(k % 4) * 40}ms`,
    } as React.CSSProperties;
  });
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {pieces.map((s, k) => (
        <span key={k} className="confetti" style={s} />
      ))}
    </span>
  );
}
