import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { getProduct, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductGrid } from "@/components/site/product";

export const Route = createFileRoute("/favorieten")({
  head: () => ({
    meta: [{ title: "Favorieten — GoedkopeSchoenen.com" }, { name: "robots", content: "noindex" }],
  }),
  component: Favorites,
});

function Favorites() {
  const { wishlist } = useCart();
  const items = wishlist.map(getProduct).filter((p): p is Product => !!p);
  return (
    <>
      <Breadcrumbs items={[{ label: "Favorieten" }]} />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 lg:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Favorieten</h1>
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <Heart className="mx-auto h-10 w-10 text-soft" />
            <p className="mt-3 font-display text-xl font-bold">Nog geen favorieten</p>
            <p className="mt-1 text-muted-foreground">
              Tik op het hartje bij een product om het hier te bewaren.
            </p>
            <Link
              to="/collectie/$slug"
              params={{ slug: "nieuw" }}
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              Bekijk nieuw binnen
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <ProductGrid products={items} />
          </div>
        )}
      </section>
    </>
  );
}
