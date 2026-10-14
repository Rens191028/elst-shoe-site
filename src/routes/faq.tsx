import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FaqList, ShoeBox3D } from "@/components/site/Faq";
import { FAQ_CATEGORIES } from "@/data/faq";
import { SITE } from "@/lib/site";

const desc =
  "Antwoorden over verzending, retourneren, betalen en maatadvies bij GoedkopeSchoenen.com.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Veelgestelde vragen — GoedkopeSchoenen.com" },
      { name: "description", content: desc },
      { property: "og:title", content: "Veelgestelde vragen — GoedkopeSchoenen.com" },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/faq` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_CATEGORIES.flatMap((c) => c.items).map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  return (
    <>
      <Breadcrumbs items={[{ label: "Veelgestelde vragen" }]} />
      <section className="bg-gradient-to-b from-[#f6ebe0] to-background">
        <div className="mx-auto grid max-w-5xl items-center gap-6 px-4 pb-10 pt-6 md:grid-cols-[1fr_280px]">
          <div>
            <h1 className="font-display text-4xl tracking-tight md:text-5xl">
              Veelgestelde vragen
            </h1>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">
              Alles over bestellen, verzenden, retourneren, betalen en maten. Staat je vraag er niet
              bij? Bel of app ons op {SITE.phone}.
            </p>
            <nav aria-label="Categorieën" className="mt-6 flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium transition hover:border-ink"
                >
                  {c.title}
                </a>
              ))}
            </nav>
          </div>
          <ShoeBox3D open={open} pulse={pulse} className="hidden h-[260px] md:flex" />
        </div>
      </section>
      <div className="mx-auto max-w-3xl space-y-12 px-4 pb-16 pt-6">
        {FAQ_CATEGORIES.map((c) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-28">
            <h2 id={`${c.id}-h`} className="mb-4 font-display text-2xl font-bold">
              {c.title}
            </h2>
            <FaqList
              items={c.items}
              onToggle={(o) => {
                setOpen(o);
                setPulse((n) => n + 1);
              }}
            />
          </section>
        ))}
        <p className="text-center text-muted-foreground">
          Nog iets anders?{" "}
          <Link to="/contact" className="font-semibold text-ink underline underline-offset-4">
            Neem contact op
          </Link>
        </p>
      </div>
    </>
  );
}
