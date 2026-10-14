import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — GoedkopeSchoenen.com" },
      { name: "description", content: "Bel, app of mail ons. We helpen je graag." },
    ],
  }),
  component: () => (
    <InfoPage
      title="Contact"
      intro="Een vraag over een product, je maat of je bestelling? Neem gerust contact op."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { l: "Bellen", v: SITE.phone, h: SITE.phoneHref },
          { l: "WhatsApp", v: SITE.phone, h: SITE.whatsappHref },
          { l: "E-mail", v: SITE.email, h: `mailto:${SITE.email}` },
        ].map((c) => (
          <a
            key={c.l}
            href={c.h}
            className="block rounded-2xl border border-border bg-white shadow-soft p-5 no-underline transition hover:-translate-y-0.5 hover:border-ink"
          >
            <p className="text-sm text-muted-foreground">{c.l}</p>
            <p className="font-display text-lg font-bold">{c.v}</p>
          </a>
        ))}
        <div className="rounded-2xl border border-border bg-white shadow-soft p-5">
          <p className="text-sm text-muted-foreground">Adres</p>
          <p className="font-display text-lg font-bold">{SITE.address.street}</p>
          <p>
            {SITE.address.zip} {SITE.address.city}
          </p>
        </div>
      </div>
      <p className="text-sm">
        KvK {SITE.kvk} · BTW {SITE.btw}
      </p>
    </InfoPage>
  ),
});
