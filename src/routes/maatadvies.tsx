import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/maatadvies")({
  head: () => ({
    meta: [
      { title: "Maatadvies — vind jouw schoenmaat | GoedkopeSchoenen.com" },
      {
        name: "description",
        content: "Meet je voet in drie stappen en ontvang direct een advies voor je schoenmaat.",
      },
    ],
  }),
  component: SizeAdvice,
});

type Fit = "smal" | "normaal" | "breed";
const FITS: { v: Fit; l: string; d: string }[] = [
  { v: "smal", l: "Smal", d: "Schoenen zitten vaak wat ruim" },
  { v: "normaal", l: "Normaal", d: "Standaard pasvorm is prima" },
  { v: "breed", l: "Breed", d: "Schoenen knellen soms" },
];

// EU-maat ≈ (voetlengte + 1,5 cm ruimte) × 1,5; bij een brede voet een maat groter.
export function adviseSize(lengthCm: number, fit: Fit) {
  const base = Math.round((lengthCm + 1.5) * 1.5);
  return base + (fit === "breed" ? 1 : 0);
}

function SizeAdvice() {
  const [step, setStep] = useState(1);
  const [len, setLen] = useState("");
  const [fit, setFit] = useState<Fit>("normaal");
  const cm = parseFloat(len.replace(",", "."));
  const valid = cm >= 20 && cm <= 31;
  const size = valid ? adviseSize(cm, fit) : null;

  return (
    <>
      <Breadcrumbs items={[{ label: "Maatadvies" }]} />
      <section className="mx-auto max-w-2xl px-4 pb-8 pt-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Maatadvies</h1>
        <p className="mt-2 text-muted-foreground">In drie stappen naar de maat die bij jou past.</p>

        <ol className="mt-8 flex gap-2" aria-label="Voortgang">
          {[1, 2, 3].map((n) => (
            <li
              key={n}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                n <= step ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </ol>

        <div className="mt-8 rounded-2xl border border-border bg-white p-6 md:p-8">
          {step === 1 && (
            <div className="anim-fade-up">
              <h2 className="font-display text-xl font-bold">Stap 1 · Meet je voet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Zet je voet met je hiel tegen een muur op een vel papier. Markeer de punt van je
                langste teen en meet de afstand tot de muur. Doe dit het liefst aan het eind van de
                dag.
              </p>
              <label className="mt-5 block text-sm font-medium">
                Lengte van je voet (cm)
                <input
                  inputMode="decimal"
                  value={len}
                  onChange={(e) => setLen(e.target.value)}
                  placeholder="Bijv. 24,5"
                  className="mt-1.5 h-12 w-full rounded-lg border border-border px-3.5 text-base outline-none focus:border-ink"
                />
              </label>
              {len && !valid && (
                <p role="alert" className="mt-2 text-sm text-primary">
                  Vul een lengte tussen 20 en 31 cm in.
                </p>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="anim-fade-up">
              <h2 className="font-display text-xl font-bold">Stap 2 · Hoe zit je voet?</h2>
              <div
                className="mt-5 grid gap-3 sm:grid-cols-3"
                role="radiogroup"
                aria-label="Pasvoorkeur"
              >
                {FITS.map((f) => (
                  <button
                    key={f.v}
                    type="button"
                    role="radio"
                    aria-checked={fit === f.v}
                    onClick={() => setFit(f.v)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition active:scale-[0.98]",
                      fit === f.v ? "border-ink ring-1 ring-ink" : "border-border hover:border-ink",
                    )}
                  >
                    <span className="block font-semibold">{f.l}</span>
                    <span className="text-xs text-muted-foreground">{f.d}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && size && (
            <div className="anim-fade-up text-center">
              <h2 className="font-display text-xl font-bold">Jouw advies</h2>
              <p className="mt-4 font-display text-7xl font-extrabold text-primary">{size}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Voetlengte {cm.toLocaleString("nl-NL")} cm · pasvorm {fit}
              </p>
              {(size < 36 || size > 46) && (
                <p className="mt-3 text-sm">
                  Let op: onze schoenen zijn verkrijgbaar in de maten 36 t/m 46; deze maat valt
                  buiten ons assortiment.
                </p>
              )}
              <Link
                to="/collectie/$slug"
                params={{ slug: "schoenen" }}
                search={{ maat: String(size) }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Bekijk schoenen in maat {size} <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-6 text-xs text-muted-foreground">
                Dit is een advies, geen garantie: de pasvorm verschilt per model. Past het toch
                niet? Lees ons{" "}
                <Link to="/verzending-retour" className="underline">
                  retourbeleid
                </Link>
                .
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold hover:bg-secondary",
              step === 1 && "invisible",
            )}
          >
            <ArrowLeft className="h-4 w-4" /> Terug
          </button>
          {step < 3 && (
            <button
              type="button"
              disabled={step === 1 && !valid}
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
            >
              {step === 2 ? "Toon advies" : "Volgende"} <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>
    </>
  );
}
