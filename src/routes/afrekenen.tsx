import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Info, Lock, ShieldCheck } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CutoffNotice } from "@/components/site/CutoffNotice";
import { getProduct, money, variantLabel } from "@/lib/catalog";
import { priceLines } from "@/lib/bundles";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { KiyohBadge } from "@/components/site/product";
import { SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Photo } from "@/components/site/product";
import { PriceRows } from "@/components/site/cart";
import { cn } from "@/lib/utils";

type Search = { direct?: string | undefined; maat?: string | undefined };

export const Route = createFileRoute("/afrekenen")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["direct"] === "string" ? { direct: s["direct"].slice(0, 200) } : {}),
    // Een getypte ?maat=39 wordt door de router als getal gelezen; accepteer beide
    ...(typeof s["maat"] === "string" || typeof s["maat"] === "number"
      ? { maat: String(s["maat"]).slice(0, 240) }
      : {}),
  }),
  head: () => ({
    meta: [{ title: "Afrekenen — GoedkopeSchoenen.com" }, { name: "robots", content: "noindex" }],
  }),
  component: Checkout,
});

const field =
  "h-12 w-full rounded-lg border border-border bg-white px-3.5 text-sm outline-none transition focus:border-ink";
const METHODS = ["iDEAL", "Klarna (achteraf betalen)", "Creditcard", "Bancontact"];

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm font-medium", className)}>
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function Checkout() {
  const cart = useCart();
  const { direct, maat } = Route.useSearch();
  const { user } = useAuth();

  // "Bestel nu": één product rechtstreeks afrekenen, zonder de winkelwagen aan te raken
  const directLines = useMemo(() => {
    const product = direct ? getProduct(direct) : undefined;
    if (!product || !product.s) return null;
    if (product.m.length && !(maat && product.m.includes(maat))) return null;
    return [{ h: product.h, size: maat ?? "", qty: 1, product }];
  }, [direct, maat]);
  const isDirect = directLines !== null;
  const lines = directLines ?? cart.lines;
  const price = isDirect ? priceLines(lines) : cart;
  const digitalOnly = lines.length > 0 && lines.every((l) => l.product.g === "cadeaubon");
  const navigate = useNavigate();
  const [method, setMethod] = useState(METHODS[0]!);
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const steps = digitalOnly ? ["Gegevens", "Betalen"] : ["Gegevens", "Verzending", "Betalen"];
  const last = steps.length - 1;
  const goNext = () => {
    // Valideer alleen de velden van de stap waar je nu op zit
    const fields = formRef.current?.querySelectorAll<HTMLInputElement>(
      `[data-step="${step}"] input`,
    );
    for (const f of fields ?? []) if (!f.reportValidity()) return;
    setStep((n) => Math.min(n + 1, last));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (lines.length === 0)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold">Je winkelwagen is leeg</h1>
        <Link
          to="/collectie/$slug"
          params={{ slug: "nieuw" }}
          className="mt-6 inline-block rounded-full bg-cta px-6 py-3 font-semibold text-white"
        >
          Verder winkelen
        </Link>
      </div>
    );

  return (
    <>
      <Breadcrumbs
        items={
          isDirect ? [{ label: "Afrekenen" }] : [{ label: "Winkelwagen" }, { label: "Afrekenen" }]
        }
      />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 lg:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Afrekenen</h1>
        {isDirect && cart.lines.length > 0 && (
          <p className="mt-3 rounded-2xl bg-secondary px-4 py-3 text-sm">
            Je bestelt alleen <strong>{lines[0]!.product.t}</strong>. Je winkelwagen blijft
            ongewijzigd.{" "}
            <Link to="/winkelwagen" className="font-semibold underline underline-offset-4">
              Bekijk winkelwagen
            </Link>
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground">
            {user ? (
              <>Je bestelt als {user.email}.</>
            ) : (
              <>
                Bestellen als gast kan: je hoeft niet in te loggen. Liever met account?{" "}
                <Link
                  to="/inloggen"
                  search={{ redirect: "/afrekenen" }}
                  className="font-semibold text-ink underline underline-offset-4 hover:text-primary"
                >
                  Log in
                </Link>
              </>
            )}
          </p>
          <KiyohBadge />
        </div>
        {!SITE.checkoutLive && (
          <div
            role="note"
            className="mt-6 flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              <strong>Demo-checkout.</strong> De betaalprovider en bestelverwerking zijn nog niet
              gekoppeld. Als je hier op “Bestelling plaatsen” klikt, wordt er geen bestelling
              geplaatst en niets afgeschreven.
            </p>
          </div>
        )}
        <ol
          aria-label={`Stap ${step + 1} van ${steps.length}`}
          className="mt-8 flex items-center gap-2 text-sm"
        >
          {steps.map((label, i) => (
            <li
              key={label}
              className="flex items-center gap-2"
              aria-current={i === step ? "step" : undefined}
            >
              {i > 0 && (
                <span
                  className={cn("h-px w-6 sm:w-12", i <= step ? "bg-ink" : "bg-border")}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                disabled={i >= step}
                onClick={() => setStep(i)}
                className={cn(
                  "flex items-center gap-2 rounded-full py-1 pr-3 pl-1 font-semibold",
                  i === step ? "bg-ink text-white" : i < step ? "text-ink" : "text-soft",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs",
                    i === step
                      ? "bg-cta text-white"
                      : i < step
                        ? "bg-ink text-white"
                        : "border border-border",
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ol>
        <form
          ref={formRef}
          className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]"
          onSubmit={(e) => {
            e.preventDefault();
            if (step < last) return goNext();
            try {
              sessionStorage.setItem(
                "gs-last-order",
                JSON.stringify({
                  at: new Date().toISOString(),
                  lines: lines.map((l) => ({ h: l.h, size: l.size, qty: l.qty })),
                  price: {
                    subtotal: price.subtotal,
                    discount: price.discount,
                    shipping: price.shipping,
                    total: price.total,
                  },
                  digital: digitalOnly,
                }),
              );
            } catch {
              /* sessionStorage niet beschikbaar */
            }
            void navigate({ to: "/bedankt" });
          }}
        >
          <div className="space-y-8">
            <fieldset data-step="0" hidden={step !== 0} className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-4 font-display text-xl font-bold">
                {digitalOnly ? "Contact" : "Contact & bezorgadres"}
              </legend>
              <Field label="E-mailadres" className="sm:col-span-2">
                <input required type="email" autoComplete="email" className={field} />
              </Field>
              <Field label="Voornaam">
                <input required autoComplete="given-name" className={field} />
              </Field>
              <Field label="Achternaam">
                <input required autoComplete="family-name" className={field} />
              </Field>
              {!digitalOnly && (
                <>
                  <Field label="Straat en huisnummer" className="sm:col-span-2">
                    <input required autoComplete="street-address" className={field} />
                  </Field>
                  <Field label="Postcode">
                    <input
                      required
                      autoComplete="postal-code"
                      pattern="[1-9][0-9]{3}\s?[A-Za-z]{2}"
                      title="Bijvoorbeeld 6662 MD"
                      className={field}
                    />
                  </Field>
                  <Field label="Woonplaats">
                    <input required autoComplete="address-level2" className={field} />
                  </Field>
                </>
              )}
              <Field label="Telefoon (optioneel)" className="sm:col-span-2">
                <input type="tel" autoComplete="tel" className={field} />
              </Field>
            </fieldset>
            {!digitalOnly && (
              <fieldset data-step="1" hidden={step !== 1}>
                <legend className="mb-4 font-display text-xl font-bold">Verzending</legend>
                <div className="rounded-2xl border border-ink bg-white p-4 text-sm ring-1 ring-ink">
                  <p className="flex justify-between font-semibold">
                    <span>PostNL — standaard</span>
                    <span>{price.shipping === 0 ? "Gratis" : money(price.shipping)}</span>
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Gratis verzending vanaf {money(SITE.freeShippingFrom)}.
                  </p>
                </div>
                <CutoffNotice className="mt-4" />
              </fieldset>
            )}
            <fieldset data-step={last} hidden={step !== last}>
              <legend className="mb-4 font-display text-xl font-bold">Betaalmethode</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {METHODS.map((m) => (
                  <label
                    key={m}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 text-sm font-medium transition",
                      method === m
                        ? "border-ink ring-1 ring-ink"
                        : "border-border hover:border-ink",
                    )}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={method === m}
                      onChange={() => setMethod(m)}
                      className="accent-[var(--primary)]"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-white shadow-soft p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-bold">Je bestelling</h2>
            <ul className="divide-y divide-border">
              {lines.map((l) => (
                <li key={l.h + l.size} className="flex gap-3 py-3">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Photo
                      product={l.product}
                      width={160}
                      className="h-full w-full object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="line-clamp-2 font-medium leading-snug">{l.product.t}</p>
                    <p className="text-xs text-muted-foreground">
                      {variantLabel(l.product, l.size)} · {l.qty}×
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{money(l.product.p * l.qty)}</p>
                </li>
              ))}
            </ul>
            <PriceRows big className="border-t border-border pt-4" price={price} />
            {!digitalOnly && step === last && <CutoffNotice />}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-cta py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            >
              {step < last ? (
                <>Verder naar {steps[step + 1]!.toLowerCase()}</>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" /> Bestelling plaatsen
                </>
              )}
            </button>
            {step === last && (
              <div className="flex gap-3 rounded-2xl border border-border bg-cream p-3.5 text-xs">
                <ShieldCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p>
                  <strong className="block text-sm">Veilig betalen</strong>
                  Betalen gaat via een beveiligde (SSL) verbinding met je bank of betaalprovider.
                </p>
              </div>
            )}
            <p className="text-center text-xs text-muted-foreground">Incl. btw</p>
          </aside>
        </form>
      </section>
    </>
  );
}
