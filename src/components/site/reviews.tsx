import { Star } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/site/motion";
import { KiyohBadge } from "@/components/site/product";
import { averageStars, reviewsFor, type Review } from "@/lib/reviews";

/** Vijf sterren die vloeiend vollopen zodra het omliggende `Reveal`-blok in beeld komt. */
export function StarsFill({ value, className }: { value: number; className?: string }) {
  const row = (filled: boolean) => (
    <span className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={
            filled ? "h-4 w-4 shrink-0 fill-primary text-primary" : "h-4 w-4 shrink-0 text-border"
          }
        />
      ))}
    </span>
  );
  return (
    <span className={className} role="img" aria-label={`${value} van 5 sterren`}>
      <span className="relative inline-block">
        {row(false)}
        <span
          className="stars-fill absolute inset-y-0 left-0 overflow-hidden"
          style={
            { "--w": `${(Math.min(5, Math.max(0, value)) / 5) * 100}%` } as React.CSSProperties
          }
        >
          {row(true)}
        </span>
      </span>
    </span>
  );
}

const dateFmt = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function ReviewCard({ r, index }: { r: Review; index: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <Reveal
      as="li"
      index={index}
      className="group rounded-2xl border border-border bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
    >
      <StarsFill value={r.stars} />
      <p className="mt-3 leading-relaxed">“{r.text}”</p>
      {r.photo && !broken && (
        <span className="mt-4 block aspect-[4/3] max-w-xs overflow-hidden rounded-xl bg-secondary">
          <img
            src={r.photo}
            alt={`Foto van ${r.name} bij deze review`}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition duration-500 hover:scale-110"
          />
        </span>
      )}
      <p className="mt-4 text-sm">
        <span className="font-semibold">{r.name}</span>
        {r.date && (
          <span className="text-muted-foreground"> · {dateFmt.format(new Date(r.date))}</span>
        )}
      </p>
    </Reveal>
  );
}

export function ProductReviews({ handle, className }: { handle: string; className?: string }) {
  const reviews = reviewsFor(handle);
  const avg = averageStars(reviews);
  return (
    <section className={className} aria-labelledby="reviews-h">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="reviews-h" className="font-display text-2xl tracking-tight md:text-3xl">
          Reviews
        </h2>
        {reviews.length > 0 && (
          <Reveal className="flex items-center gap-2 text-sm">
            <StarsFill value={avg} />
            <span>
              <strong>{avg.toLocaleString("nl-NL")}</strong> · {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </Reveal>
        )}
      </div>
      {reviews.length > 0 ? (
        <ul className="grid items-start gap-4 md:grid-cols-2">
          {reviews.map((r, i) => (
            <ReviewCard key={r.name + i} r={r} index={i} />
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-display text-lg font-bold">Nog geen reviews voor dit product</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Klanten beoordelen onze webshop als geheel via Kiyoh.
          </p>
          <KiyohBadge className="mt-4" />
        </div>
      )}
    </section>
  );
}
