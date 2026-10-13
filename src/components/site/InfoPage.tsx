import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={[{ label: title }]} />
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {intro && <p className="mt-3 text-lg text-muted-foreground">{intro}</p>}
        <div className="mt-8 space-y-8 leading-relaxed [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_p]:text-muted-foreground [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary">
          {children}
        </div>
      </section>
    </>
  );
}
