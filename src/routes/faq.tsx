import { createFileRoute, Link } from "@tanstack/react-router";
import { money } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { InfoPage } from "@/components/site/InfoPage";

const desc = "Antwoorden over verzending, retourneren, betalen en maatadvies bij GoedkopeSchoenen.com.";

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
  }),
  component: () => (
    <InfoPage title="Veelgestelde vragen">
      <div>
        <h2>Wanneer wordt mijn bestelling verzonden?</h2>
        <p>Op werkdagen voor 15:00 besteld, verzenden we dezelfde dag met PostNL.</p>
      </div>
      <div>
        <h2>Wat kost verzending?</h2>
        <p>
          {money(SITE.shippingCost)}; vanaf {money(SITE.freeShippingFrom)} verzenden we gratis.
        </p>
      </div>
      <div>
        <h2>Kan ik retourneren?</h2>
        <p>
          Ja, binnen 30 dagen. Lees ons <Link to="/verzending-retour" hash="retour">retourbeleid</Link>.
        </p>
      </div>
      <div>
        <h2>Hoe kan ik betalen?</h2>
        <p>Met iDEAL, Klarna (achteraf betalen), creditcard of Bancontact.</p>
      </div>
      <div>
        <h2>Welke maat past bij mij?</h2>
        <p>
          Bekijk ons <Link to="/maatadvies">maatadvies</Link> of{" "}
          <Link to="/contact">neem contact op</Link>.
        </p>
      </div>
    </InfoPage>
  ),
});
