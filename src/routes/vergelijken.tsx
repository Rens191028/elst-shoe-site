import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, X } from "lucide-react";
import { discountPct, getCollection, getProduct, money, SUBS, type Product } from "@/lib/catalog";
import { useShopper } from "@/lib/shopper";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Photo, Price } from "@/components/site/product";

export const Route = createFileRoute("/vergelijken")({
  head: () => ({
    meta: [
      { title: "Producten vergelijken — GoedkopeSchoenen.com" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Compare,
});

const rows: { label: string; value: (p: Product) => string }[] = [
  {
    label: "Categorie",
    value: (p) => SUBS.find((s) => s.cat === p.c)?.title ?? getCollection(p.g)?.title ?? "",
  },
  { label: "Kleur", value: (p) => p.k.join(", ") || "—" },
  {
    label: "Maten",
    value: (p) => (p.m.length ? `${p.m[0]} t/m ${p.m[p.m.length - 1]}` : "Eén maat"),
  },
  {
    label: "Korting",
    value: (p) => (p.w ? `-${discountPct(p)}% (je bespaart ${money(p.w - p.p)})` : "—"),
  },
  { label: "Beschikbaarheid", value: (p) => (p.s ? "Op voorraad" : "Uitverkocht") },
];

function Compare() {
  const { compare, toggleCompare, clearCompare } = useShopper();
  const items = compare.map(getProduct).filter((p): p is Product => !!p);

  return (
    <>
      <Breadcrumbs items={[{ label: "Vergelijken" }]} />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 lg:px-6">
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-display text-4xl tracking-tight">Producten vergelijken</h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="text-sm font-medium underline underline-offset-4 hover:text-primary"
            >
              Alles wissen
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border py-20 text-center">
            <Scale className="mx-auto h-10 w-10 text-soft" />
            <p className="mt-3 font-display text-xl font-bold">Nog niets om te vergelijken</p>
            <p className="mt-1 text-muted-foreground">
              Kies bij 2 of 3 producten “Vergelijk” en zet ze hier naast elkaar.
            </p>
            <Link
              to="/collectie/$slug"
              params={{ slug: "nieuw" }}
              className="mt-6 inline-block rounded-full bg-cta px-6 py-3 text-sm font-semibold text-white"
            >
              Bekijk nieuw binnen
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-x-4 text-sm">
              <thead>
                <tr>
                  <th className="w-32" />
                  {items.map((p) => (
                    <th
                      key={p.h}
                      scope="col"
                      className="w-1/3 pb-4 text-left align-top font-normal"
                    >
                      <div className="relative">
                        <Link
                          to="/products/$handle"
                          params={{ handle: p.h }}
                          className="block aspect-[4/5] overflow-hidden rounded-2xl bg-secondary shadow-soft"
                        >
                          <Photo
                            product={p}
                            width={500}
                            className="h-full w-full object-cover"
                            sizes="320px"
                          />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleCompare(p.h)}
                          aria-label={`Verwijder ${p.t}`}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <Link
                        to="/products/$handle"
                        params={{ handle: p.h }}
                        className="mt-3 block font-medium leading-snug hover:underline"
                      >
                        {p.t}
                      </Link>
                      <div className="mt-1">
                        <Price product={p} size="lg" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <th
                      scope="row"
                      className="border-t border-border py-3 text-left font-semibold text-muted-foreground"
                    >
                      {r.label}
                    </th>
                    {items.map((p) => (
                      <td key={p.h} className="border-t border-border py-3">
                        {r.value(p)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th className="border-t border-border" />
                  {items.map((p) => (
                    <td key={p.h} className="border-t border-border py-4">
                      <Link
                        to="/products/$handle"
                        params={{ handle: p.h }}
                        className="inline-block rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-white"
                      >
                        Bekijk product
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
