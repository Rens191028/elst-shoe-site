import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ARTICLES } from "@/data/articles";
import { SITE } from "@/lib/site";

const DESC = "Tips en uitleg over schoenen kiezen, onderhouden en je maat bepalen.";

export const Route = createFileRoute("/kennisbank/")({
  head: () => ({
    meta: [
      { title: "Kennisbank: tips over schoenen | GoedkopeSchoenen.com" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Kennisbank | GoedkopeSchoenen.com" },
      { property: "og:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/kennisbank` }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Kennisbank" }]} />
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-4 lg:px-6">
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">Kennisbank</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">{DESC}</p>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <Link
                to="/kennisbank/$slug"
                params={{ slug: a.slug }}
                className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
              >
                <h2 className="font-display text-xl font-bold">{a.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.description}</p>
                <span className="mt-4 text-sm font-semibold text-primary-text">Lees verder →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
