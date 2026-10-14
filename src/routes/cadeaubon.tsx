import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Gift, Mail } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Field, FormError, inputCls } from "@/components/site/auth-ui";
import { LogoMark } from "@/components/site/Logo";
import { money } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { SITE } from "@/lib/site";
import {
  VOUCHER_AMOUNTS,
  VOUCHER_MAX,
  VOUCHER_MIN,
  voucherHandle,
  voucherVariant,
} from "@/lib/voucher";
import { cn } from "@/lib/utils";

const DESC =
  "Geef een digitale cadeaubon van GoedkopeSchoenen.com cadeau, met een bedrag naar keuze.";

export const Route = createFileRoute("/cadeaubon")({
  head: () => ({
    meta: [
      { title: "Cadeaubon kopen | GoedkopeSchoenen.com" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Cadeaubon kopen | GoedkopeSchoenen.com" },
      { property: "og:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/cadeaubon` }],
  }),
  component: Voucher,
});

const schema = z.object({
  to: z.string().trim().min(1, "Vul in voor wie de cadeaubon is.").max(60),
  email: z.string().trim().email("Vul een geldig e-mailadres in van de ontvanger."),
  message: z.string().trim().max(160, "Houd je boodschap onder de 160 tekens."),
});

function Voucher() {
  const { add } = useCart();
  const navigate = useNavigate();
  const [preset, setPreset] = useState<number | "eigen">(25);
  const [custom, setCustom] = useState("");
  const [to, setTo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const amount = preset === "eigen" ? Math.round(Number(custom.replace(",", "."))) : preset;
  const amountOk = Number.isFinite(amount) && amount >= VOUCHER_MIN && amount <= VOUCHER_MAX;

  const prepare = () => {
    if (!amountOk) {
      setError(`Kies een bedrag tussen ${money(VOUCHER_MIN)} en ${money(VOUCHER_MAX)}.`);
      return null;
    }
    const parsed = schema.safeParse({ to, email, message });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Controleer je gegevens.");
      return null;
    }
    setError("");
    return {
      h: voucherHandle(amount),
      variant: voucherVariant(parsed.data.to, parsed.data.email, parsed.data.message),
    };
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Cadeaubon" }]} />
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-4 lg:px-6">
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">Cadeaubon</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Het perfecte cadeau als je de maat of smaak niet kent. Kies een bedrag; de ontvanger kiest
          zelf.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <form
            className="space-y-6"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const v = prepare();
              if (!v) return;
              void navigate({ to: "/afrekenen", search: { direct: v.h, maat: v.variant } });
            }}
          >
            <FormError>{error}</FormError>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Bedrag</legend>
              <div className="flex flex-wrap gap-2">
                {VOUCHER_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={preset === a}
                    onClick={() => setPreset(a)}
                    className={cn(
                      "h-12 min-w-20 rounded-full border px-5 text-sm font-semibold transition",
                      preset === a
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-white hover:border-ink",
                    )}
                  >
                    {money(a)}
                  </button>
                ))}
                <button
                  type="button"
                  aria-pressed={preset === "eigen"}
                  onClick={() => setPreset("eigen")}
                  className={cn(
                    "h-12 rounded-full border px-5 text-sm font-semibold transition",
                    preset === "eigen"
                      ? "border-ink bg-ink text-white"
                      : "border-border bg-white hover:border-ink",
                  )}
                >
                  Ander bedrag
                </button>
              </div>
              {preset === "eigen" && (
                <div className="mt-3 flex items-center gap-2">
                  <label htmlFor="v-custom" className="text-sm">
                    Bedrag in euro’s
                  </label>
                  <input
                    id="v-custom"
                    inputMode="numeric"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder={`${VOUCHER_MIN}–${VOUCHER_MAX}`}
                    className={cn(inputCls, "h-11 w-28")}
                  />
                </div>
              )}
            </fieldset>

            <Field label="Voor wie is de cadeaubon?" id="v-to">
              <input
                id="v-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field
              label="E-mailadres van de ontvanger"
              id="v-email"
              hint="Hier sturen we de cadeaubon naartoe."
            >
              <input
                id="v-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field
              label="Persoonlijke boodschap (optioneel)"
              id="v-msg"
              hint={`${message.length}/160`}
            >
              <textarea
                id="v-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 160))}
                rows={3}
                className={cn(inputCls, "h-auto py-3")}
              />
            </Field>

            <div className="grid gap-2.5 sm:max-w-sm">
              <button
                type="submit"
                className="h-14 rounded-full bg-cta font-semibold text-white transition active:scale-[0.98]"
              >
                Bestel nu
              </button>
              <button
                type="button"
                onClick={() => {
                  const v = prepare();
                  if (!v) return;
                  add(v.h, v.variant);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1600);
                }}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink font-semibold text-ink transition hover:bg-ink hover:text-white active:scale-[0.98]"
              >
                {added && <Check className="h-4 w-4" />}
                {added ? "Toegevoegd aan winkelwagen" : "Toevoegen aan winkelwagen"}
              </button>
            </div>
            {!SITE.checkoutLive && (
              <p role="note" className="text-xs text-muted-foreground">
                De checkout is nog een demo: de cadeaubon wordt pas verstuurd zodra bestellen live
                is.
              </p>
            )}
          </form>

          <aside
            aria-label="Voorbeeld van de cadeaubon"
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="relative aspect-[8/5] overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover p-7 text-white shadow-lift">
              <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center gap-3">
                  <LogoMark className="[&_span:nth-child(1)]:!bg-white [&_span:nth-child(n+2)]:!bg-ink" />
                  <span className="font-display text-lg font-extrabold">GoedkopeSchoenen</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                    Cadeaubon
                  </p>
                  <p className="font-display text-5xl font-extrabold">
                    {amountOk ? money(amount) : "€ —"}
                  </p>
                </div>
                <p className="line-clamp-2 text-sm text-white/90">
                  {to ? `Voor ${to}` : "Voor jou"}
                  {message && ` — “${message}”`}
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" /> Per e-mail bezorgd
              </li>
              <li className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" aria-hidden="true" /> Geschikt voor schoenen,
                tassen en accessoires
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
