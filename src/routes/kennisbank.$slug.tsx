import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ARTICLES, getArticle } from "@/data/articles";
import { getCollection } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/kennisbank/$slug")({
  loader: ({ params }) => {
    if (!getArticle(params.slug)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a) return {};
    const url = `${SITE.url}/kennisbank/${a.slug}`;
    return {
      meta: [
        { title: `${a.title} | GoedkopeSchoenen.com` },
        { name: "description", content: a.description },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.description },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.description,
            datePublished: a.date,
            mainEntityOfPage: url,
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">Dit artikel bestaat niet</h1>
      <Link to="/kennisbank" className="mt-6 inline-block underline underline-offset-4">
        Naar de kennisbank
      </Link>
    </div>
  ),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const a = getArticle(slug)!;
  const col = getCollection(a.collection);
  const more = ARTICLES.filter((x) => x.slug !== a.slug);
  return (
    <>
      <Breadcrumbs items={[{ label: "Kennisbank", to: "/kennisbank" }, { label: a.title }]} />
      <article className="mx-auto max-w-3xl px-4 pb-10 pt-4">
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">{a.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{a.description}</p>
        <div className="mt-8 space-y-8">
          {a.blocks.map((b) => (
            <section key={b.h}>
              <h2 className="mb-2 font-display text-2xl font-bold">{b.h}</h2>
              {b.p.map((t) => (
                <p key={t} className="mb-3 leading-relaxed text-muted-foreground">
                  {t}
                </p>
              ))}
            </section>
          ))}
        </div>
        {col && (
          <Link
            to="/collectie/$slug"
            params={{ slug: col.slug }}
            className="mt-10 inline-flex rounded-full bg-cta px-7 py-3.5 font-semibold text-white"
          >
            Bekijk {col.title.toLowerCase()}
          </Link>
        )}
        <div className="mt-12 border-t border-border pt-6">
          <h2 className="mb-3 font-display text-lg font-bold">Meer lezen</h2>
          <ul className="space-y-1.5">
            {more.map((m) => (
              <li key={m.slug}>
                <Link
                  to="/kennisbank/$slug"
                  params={{ slug: m.slug }}
                  className="underline underline-offset-4 hover:text-primary-text"
                >
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
