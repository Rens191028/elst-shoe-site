import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Info, Lock } from "lucide-react";
import { useState } from "react";
import { money } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { KiyohBadge } from "@/components/site/product";
import { SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Photo } from "@/components/site/product";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/afrekenen")({
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
  const { lines, subtotal, shipping, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState(METHODS[0]!);

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
        items={[{ label: "Winkelwagen" }, { label: "Afrekenen" }].map((c, i) =>
          i === 0 ? { ...c } : c,
        )}
      />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 lg:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Afrekenen</h1>
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
        <form
          className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ to: "/bedankt" });
          }}
        >
          <div className="space-y-8">
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-4 font-display text-xl font-bold">Contact & bezorgadres</legend>
              <Field label="E-mailadres" className="sm:col-span-2">
                <input required type="email" autoComplete="email" className={field} />
              </Field>
              <Field label="Voornaam">
                <input required autoComplete="given-name" className={field} />
              </Field>
              <Field label="Achternaam">
                <input required autoComplete="family-name" className={field} />
              </Field>
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
              <Field label="Telefoon (optioneel)" className="sm:col-span-2">
                <input type="tel" autoComplete="tel" className={field} />
              </Field>
            </fieldset>
            <fieldset>
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

          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-white p-6 lg:sticky lg:top-24">
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
                      {l.size ? `Maat ${l.size} · ` : ""}
                      {l.qty}×
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{money(l.product.p * l.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotaal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Verzending</dt>
                <dd>{shipping === 0 ? "Gratis" : money(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                <dt>Totaal</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-cta py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            >
              <Lock className="h-4 w-4" /> Bestelling plaatsen
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Incl. btw · Op werkdagen voor 15:00 besteld, dezelfde dag verzonden.
            </p>
          </aside>
        </form>
      </section>
    </>
  );
}
