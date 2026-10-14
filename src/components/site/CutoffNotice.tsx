import { Clock, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { formatLeft, shippingCutoff, type Cutoff } from "@/lib/cutoff";
import { cn } from "@/lib/utils";

/** Live verzendbelofte; pas na hydratie gerenderd zodat server en client niet verschillen. */
export function CutoffNotice({ className }: { className?: string }) {
  const [c, setC] = useState<Cutoff | null>(null);
  useEffect(() => {
    const tick = () => setC(shippingCutoff());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const Icon = c?.open ? Clock : Truck;
  return (
    <div
      className={cn("flex items-start gap-3 rounded-2xl bg-secondary px-4 py-3 text-sm", className)}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      {c === null ? (
        <p>Op werkdagen voor 15:00 besteld, dezelfde dag verzonden.</p>
      ) : c.open ? (
        <p>
          Bestel binnen{" "}
          <strong className="tabular-nums" aria-live="off">
            {formatLeft(c.secondsLeft)}
          </strong>{" "}
          en je bestelling wordt <strong>vandaag</strong> verzonden.
        </p>
      ) : (
        <p>
          Bestel je nu, dan verzenden we <strong>{c.shipsOn}</strong>. Op werkdagen voor 15:00
          besteld, verzenden we dezelfde dag.
        </p>
      )}
    </div>
  );
}
