import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { crossSell, money } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CartLineRow, CrossSell, PriceRows, ShippingBar } from "@/components/site/cart";

export const Route = createFileRoute("/winkelwagen")({
  head: () => ({
    meta: [{ title: "Winkelwagen — GoedkopeSchoenen.com" }, { name: "robots", content: "noindex" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, net, subtotal, discount, bundle, bundleHint, shipping, total } = useCart();
  const suggestions = crossSell(
    lines.map((l) => l.h),
    3,
  );

  return (
    <>
      <Breadcrumbs items={[{ label: "Winkelwagen" }]} />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 lg:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Winkelwagen</h1>
        {lines.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-soft" />
            <p className="mt-3 font-display text-xl font-bold">Je winkelwagen is leeg</p>
            <Link
              to="/collectie/$slug"
              params={{ slug: "nieuw" }}
              className="mt-6 inline-block rounded-full bg-cta px-6 py-3 text-sm font-semibold text-white transition "
            >
              Verder winkelen
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <ShippingBar
                subtotal={net}
                className="rounded-2xl border border-border bg-white shadow-soft p-4"
              />
              <ul className="mt-2">
                {lines.map((l) => (
                  <CartLineRow key={l.h + l.size} line={l} big />
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-secondary p-6">
                <CrossSell items={suggestions} title="Vaak samen gekocht" />
              </div>
            </div>
            <aside className="h-fit space-y-4 rounded-2xl border border-border bg-white shadow-soft p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-bold">Overzicht</h2>
              <PriceRows
                big
                price={{ subtotal, discount, bundle, hint: bundleHint, shipping, total }}
              />
              <p className="text-xs text-muted-foreground">Incl. btw.</p>
              <Link
                to="/afrekenen"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-cta py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                Afrekenen <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/collectie/$slug"
                params={{ slug: "nieuw" }}
                className="block text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
              >
                Verder winkelen
              </Link>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
