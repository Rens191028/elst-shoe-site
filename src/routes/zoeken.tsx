import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { money, searchProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductGrid } from "@/components/site/product";

export const Route = createFileRoute("/zoeken")({
  validateSearch: (s: Record<string, unknown>): { q?: string } =>
    s["q"] ? { q: String(s["q"]).slice(0, 120) } : {},
  head: () => ({
    meta: [{ title: "Zoeken — GoedkopeSchoenen.com" }, { name: "robots", content: "noindex" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const res = useMemo(() => searchProducts(q), [q]);
  const hints = [
    res.maxPrice ? `maximaal ${money(res.maxPrice)}` : "",
    res.colors.length ? `kleur ${res.colors.join(", ").toLowerCase()}` : "",
    res.onlySale ? "alleen sale" : "",
  ].filter(Boolean);

  return (
    <>
      <Breadcrumbs items={[{ label: "Zoeken" }]} />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 lg:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          {q ? `Zoekresultaten voor “${q}”` : "Zoeken"}
        </h1>
        <form
          role="search"
          className="mt-6 flex max-w-2xl items-center gap-3 rounded-full border border-border bg-white px-5 focus-within:border-ink"
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget).get("q");
            void navigate({ search: { q: String(v ?? "") } });
          }}
        >
          <Search className="h-5 w-5 text-soft" />
          <input
            name="q"
            defaultValue={q}
            key={q}
            aria-label="Zoek producten"
            placeholder='Bijv. "stevige winterboots onder €40"'
            className="h-14 flex-1 bg-transparent outline-none placeholder:text-soft"
          />
        </form>
        {q && (
          <p className="mt-4 text-sm text-muted-foreground">
            {res.results.length} resultaten
            {hints.length > 0 && <> · slim gezocht op: {hints.join(" · ")}</>}
          </p>
        )}
        <div className="mt-8">
          {q && res.results.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              Niets gevonden. Probeer een kleur (“zwart”), soort (“sneakers”) of een prijs (“onder
              €30”).
            </p>
          ) : (
            <ProductGrid products={res.results.slice(0, 48)} eagerCount={4} />
          )}
        </div>
      </section>
    </>
  );
}
