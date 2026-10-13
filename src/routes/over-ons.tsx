import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/over-ons")({
  head: () => ({
    meta: [
      { title: "Over ons — GoedkopeSchoenen.com" },
      {
        name: "description",
        content:
          "Het verhaal van GoedkopeSchoenen.com: sinds 2012 betaalbare schoenen, tassen en accessoires uit Elst.",
      },
    ],
  }),
  component: () => (
    <InfoPage title="Over ons" intro="Betaalbare mode met een persoonlijk gezicht, sinds 2012.">
      <div>
        <h2>Ons verhaal</h2>
        <p>
          GoedkopeSchoenen.com begon in {SITE.founded} op beurzen als de Huishoudbeurs, de Libelle
          Zomerweek en de Margriet Winterfair, en vanuit een garage in Elst. In 2023 voegden we onze
          tassenwebshop Goedkope-tassen.com samen met de schoenenwinkel tot één site.
        </p>
      </div>
      <div>
        <h2>Wat we belangrijk vinden</h2>
        <p>
          Mooie schoenen, tassen en accessoires hoeven niet duur te zijn. We houden onze prijzen
          laag, verzenden snel en zijn gewoon bereikbaar als je een vraag hebt. Onze klanten
          waarderen ons met een {SITE.kiyoh.score.toLocaleString("nl-NL")} op Kiyoh.
        </p>
      </div>
      <div>
        <h2>Bedrijfsgegevens</h2>
        <address className="not-italic text-muted-foreground">
          {SITE.name}
          <br />
          {SITE.address.street}, {SITE.address.zip} {SITE.address.city}
          <br />
          KvK {SITE.kvk} · BTW {SITE.btw}
        </address>
      </div>
    </InfoPage>
  ),
});
