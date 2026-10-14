import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/bedankt")({
  head: () => ({
    meta: [
      { title: "Bedankt voor je bestelling — GoedkopeSchoenen.com" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Thanks,
});

function Thanks() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <CheckCircle2 className="anim-fade-up mx-auto h-14 w-14 text-primary" />
      <h1
        className="anim-fade-up mt-6 font-display text-4xl font-extrabold tracking-tight"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        Bedankt voor je bestelling!
      </h1>
      <p
        className="anim-fade-up mt-3 text-muted-foreground"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        Je ontvangt een bevestiging per e-mail. Op werkdagen voor 15:00 besteld, verzenden we
        dezelfde dag.
      </p>
      {!SITE.checkoutLive && (
        <p
          role="note"
          className="anim-fade-up mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <strong>Demo:</strong> de checkout is nog niet gekoppeld aan een betaalprovider. Er is
          geen bestelling geplaatst en je winkelwagen is niet leeggemaakt.
        </p>
      )}
      <Link
        to="/"
        className="anim-fade-up mt-8 inline-block rounded-full bg-cta px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        style={{ "--i": 4 } as React.CSSProperties}
      >
        Terug naar de winkel
      </Link>
    </section>
  );
}
