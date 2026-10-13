import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/catalog";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account/")({ component: Orders });

type OrderItem = { handle?: string; title?: string; size?: string; qty?: number; price?: number };
type Order = { id: string; status: string; total: number; created_at: string; items: OrderItem[] };

const STATUS: Record<string, string> = {
  in_behandeling: "In behandeling",
  verzonden: "Verzonden",
  afgeleverd: "Afgeleverd",
  geannuleerd: "Geannuleerd",
};
const date = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" });

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase
      .from("orders")
      .select("id,status,total,created_at,items")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) return setFailed(true);
        setOrders(
          (data ?? []).map((o) => ({
            ...o,
            total: Number(o.total),
            items: Array.isArray(o.items) ? (o.items as OrderItem[]) : [],
          })),
        );
      });
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Mijn bestellingen</h2>
      {failed ? (
        <p role="alert" className="mt-6 text-primary">
          Je bestellingen konden niet worden geladen. Probeer het later opnieuw.
        </p>
      ) : orders === null ? (
        <p className="mt-6 text-muted-foreground" aria-busy="true">
          Laden…
        </p>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border py-16 text-center">
          <Package className="mx-auto h-9 w-9 text-soft" />
          <p className="mt-3 font-display text-lg font-bold">Je hebt nog geen bestellingen</p>
          <p className="mt-1 text-muted-foreground">
            Zodra je iets bestelt, vind je het hier terug.
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
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    Bestelling van {date.format(new Date(o.created_at))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nr. {o.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                  {STATUS[o.status] ?? o.status}
                </span>
              </div>
              <ul className="mt-4 divide-y divide-border text-sm">
                {o.items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4 py-2">
                    <span>
                      {it.qty ?? 1}× {it.title ?? it.handle}
                      {it.size ? (
                        <span className="text-muted-foreground"> · maat {it.size}</span>
                      ) : null}
                    </span>
                    {typeof it.price === "number" && <span>{money(it.price * (it.qty ?? 1))}</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-right font-bold">Totaal {money(o.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
