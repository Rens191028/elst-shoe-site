import { Link } from "@tanstack/react-router";
import { Ruler } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adviseSize, footLengthFor } from "@/lib/sizing";
import { cn } from "@/lib/utils";

/** Voet van boven met de meetlijn: laat zien wát je meet. */
function FootDiagram() {
  return (
    <svg
      viewBox="0 0 160 260"
      className="mx-auto h-48 w-auto"
      role="img"
      aria-label="Meet de afstand van je hiel tot je langste teen"
    >
      <defs>
        <linearGradient id="foot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0e3d8" />
          <stop offset="1" stopColor="#ead2c0" />
        </linearGradient>
      </defs>
      <path
        d="M78 14c22 0 38 22 38 54 0 24-6 40-6 62 0 24 8 40 8 66 0 28-18 46-42 46s-40-18-40-46c0-26 10-42 10-64 0-22-14-36-14-60C32 40 54 14 78 14z"
        fill="url(#foot)"
        stroke="#b5582e"
        strokeWidth="2"
      />
      {[34, 54, 74, 92, 108].map((x, i) => (
        <circle
          key={x}
          cx={x + 10}
          cy={[40, 28, 24, 28, 38][i]}
          r={[9, 8, 8, 7, 6][i]}
          fill="#fff"
          opacity=".7"
        />
      ))}
      <line
        x1="146"
        y1="14"
        x2="146"
        y2="242"
        stroke="#141413"
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <path d="M140 20l6-8 6 8M140 236l6 8 6-8" fill="none" stroke="#141413" strokeWidth="2" />
      <text x="136" y="132" fontSize="13" fontWeight="700" fill="#141413" textAnchor="end">
        lengte
      </text>
    </svg>
  );
}

const ALL = Array.from({ length: 11 }, (_, i) => 36 + i);

export function SizeChartButton({
  available,
  className,
}: {
  available: string[];
  className?: string;
}) {
  const [cm, setCm] = useState("");
  const len = parseFloat(cm.replace(",", "."));
  const valid = len >= 20 && len <= 31;
  const advice = valid ? adviseSize(len, "normaal") : null;
  const have = new Set(available);
  const rows = available.length ? ALL.filter((n) => have.has(String(n))) : ALL;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:text-primary-text",
            className,
          )}
        >
          <Ruler className="h-4 w-4" /> Maattabel
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl">
        <DialogTitle className="font-display text-2xl">Maattabel</DialogTitle>
        <DialogDescription>
          Onze schoenen volgen de Europese maatvoering. De pasvorm verschilt per model: twijfel je
          tussen twee maten, kies dan de grotere.
        </DialogDescription>

        <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
          <div>
            <FootDiagram />
            <ol className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <li>1. Zet je voet met je hiel tegen een muur op een vel papier.</li>
              <li>2. Markeer je langste teen en meet de afstand tot de muur.</li>
              <li>3. Zoek die lengte in de tabel.</li>
            </ol>
          </div>
          <div>
            <table className="w-full text-sm">
              <caption className="sr-only">Schoenmaat en bijbehorende voetlengte</caption>
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th scope="col" className="pb-2 font-semibold">
                    EU-maat
                  </th>
                  <th scope="col" className="pb-2 font-semibold">
                    Voetlengte
                  </th>
                  <th scope="col" className="pb-2 text-right font-semibold">
                    Dit product
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((n) => (
                  <tr
                    key={n}
                    className={cn(
                      "border-t border-border",
                      advice === n && "bg-primary/10 font-semibold",
                    )}
                  >
                    <th scope="row" className="py-1.5 font-semibold">
                      {n}
                    </th>
                    <td className="py-1.5">{footLengthFor(n).toLocaleString("nl-NL")} cm</td>
                    <td className="py-1.5 text-right text-xs">
                      {available.length ? "Beschikbaar" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {available.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Alleen de maten van dit product worden getoond.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-secondary p-4">
          <label htmlFor="sc-cm" className="text-sm font-semibold">
            Weet je je voetlengte? Vul hem in (cm)
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="sc-cm"
              inputMode="decimal"
              value={cm}
              onChange={(e) => setCm(e.target.value)}
              placeholder="Bijv. 24,5"
              className="h-11 w-32 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-ink"
            />
            {advice && (
              <p role="status" className="text-sm">
                Advies: maat{" "}
                <strong className="font-display text-xl text-primary-text">{advice}</strong>
              </p>
            )}
          </div>
          {cm && !valid && (
            <p role="alert" className="mt-2 text-xs text-primary-text">
              Vul een lengte tussen 20 en 31 cm in.
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Dit is een advies, geen garantie.{" "}
          <Link to="/maatadvies" className="underline underline-offset-2">
            Naar het uitgebreide maatadvies
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
