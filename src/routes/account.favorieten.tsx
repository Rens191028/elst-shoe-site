import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { getProduct, type Product } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";
import { ProductGrid } from "@/components/site/product";

export const Route = createFileRoute("/account/favorieten")({ component: Favorites });

function Favorites() {
  const { handles, loading } = useFavorites();
  const items = handles.map(getProduct).filter((p): p is Product => !!p);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Mijn favorieten</h2>
      {loading && items.length === 0 ? (
        <p className="mt-6 text-muted-foreground" aria-busy="true">
          Laden…
        </p>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border py-16 text-center">
          <Heart className="mx-auto h-9 w-9 text-soft" />
          <p className="mt-3 font-display text-lg font-bold">Nog geen favorieten</p>
          <p className="mt-1 text-muted-foreground">
            Tik op het hartje bij een product om het hier te bewaren.
          </p>
          <Link
            to="/collectie/$slug"
            params={{ slug: "nieuw" }}
            className="mt-5 inline-block rounded-full bg-cta px-6 py-3 text-sm font-semibold text-white transition "
          >
            Bekijk nieuw binnen
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Klik op het hartje om een product te verwijderen.
          </p>
          <ProductGrid products={items} />
        </div>
      )}
    </div>
  );
}
