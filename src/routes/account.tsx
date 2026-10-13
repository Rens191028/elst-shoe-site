import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Mijn account — GoedkopeSchoenen.com" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountLayout,
});

const TABS = [
  { to: "/account", label: "Mijn bestellingen", exact: true },
  { to: "/account/gegevens", label: "Mijn gegevens", exact: false },
  { to: "/account/favorieten", label: "Mijn favorieten", exact: false },
] as const;

function AccountLayout() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // De sessie staat in de browser, dus de controle gebeurt hier en niet op de server.
  useEffect(() => {
    if (!loading && !user) {
      const here = router.state.location.pathname;
      void router.navigate({ to: "/inloggen", search: { redirect: here }, replace: true });
    }
  }, [loading, user, router]);

  if (loading || !user)
    return (
      <div
        className="mx-auto max-w-7xl px-4 py-24 text-center text-muted-foreground"
        aria-busy="true"
      >
        Account laden…
      </div>
    );

  const name = (user.user_metadata?.["full_name"] as string | undefined) ?? user.email;

  return (
    <>
      <Breadcrumbs items={[{ label: "Mijn account" }]} />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 lg:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          Hallo{name ? `, ${name}` : ""}
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav aria-label="Account" className="flex gap-2 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: t.exact }}
                className="whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-ink lg:rounded-lg"
                activeProps={{ className: cn("!bg-ink !text-white hover:!bg-ink") }}
              >
                {t.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                void router.navigate({ to: "/" });
              }}
              className="whitespace-nowrap rounded-full px-4 py-2.5 text-left text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-primary lg:rounded-lg"
            >
              Uitloggen
            </button>
          </nav>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
}
