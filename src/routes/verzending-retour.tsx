import { createFileRoute } from "@tanstack/react-router";
import { money } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/verzending-retour")({
  head: () => ({
    meta: [
      { title: "Verzending & retour — GoedkopeSchoenen.com" },
      {
        name: "description",
        content: "Gratis verzending vanaf €65, dezelfde dag verzonden en eenvoudig retourneren.",
      },
    ],
  }),
  component: () => (
    <InfoPage title="Verzending & retour">
      <div>
        <h2>Verzending</h2>
        <p>
          Op werkdagen voor 15:00 besteld, verzenden we dezelfde dag met PostNL. Verzendkosten zijn{" "}
          {money(SITE.shippingCost)}; vanaf {money(SITE.freeShippingFrom)} verzenden we gratis.
        </p>
      </div>
      <div>
        <h2>Betalen</h2>
        <p>Betaal met iDEAL, Klarna (achteraf betalen), creditcard of Bancontact.</p>
      </div>
      <div>
        <h2>Retourneren</h2>
        <p>
          Past of bevalt je bestelling niet? Meld je retour via{" "}
          <a href={`mailto:${SITE.email}?subject=Retour`}>{SITE.email}</a> en we vertellen je
          precies wat je moet doen. Twijfel je over je maat? Gebruik eerst ons maatadvies.
        </p>
      </div>
    </InfoPage>
  ),
});
