/**
 * Veelgestelde vragen. Alleen wat vaststaat (site.ts / winkelregels); geen verzonnen termijnen,
 * kosten of beloftes. Twijfelgevallen verwijzen door naar contact.
 */
export type Faq = { q: string; a: string; links?: { label: string; to: string }[] };
export type FaqCategory = { id: string; title: string; items: Faq[] };

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "bestellen",
    title: "Bestellen",
    items: [
      {
        q: "Moet ik een account maken om te bestellen?",
        a: "Nee, bestellen als gast kan. Met een account bewaar je favorieten en zie je je bestellingen terug.",
        links: [{ label: "Account maken", to: "/registreren" }],
      },
      {
        q: "Kan ik één product direct bestellen?",
        a: "Ja. Met “Bestel nu” reken je alleen dat product af; wat al in je winkelwagen zit blijft staan.",
      },
      {
        q: "Is er korting als ik meerdere schoenen koop?",
        a: "Ja, bij twee paar schoenen buiten de sale krijg je 10% bundelkorting. Die zie je direct in je winkelwagen.",
      },
      {
        q: "Hoe werkt een cadeaubon?",
        a: "Je kiest een bedrag, vult de naam van de ontvanger en een persoonlijke boodschap in en ontvangt de bon zelf. Zo geef je hem cadeau zoals jij wilt.",
        links: [{ label: "Cadeaubon kopen", to: "/cadeaubon" }],
      },
      {
        q: "Wat als iets uitverkocht is?",
        a: "Bij een uitverkocht product kun je aangeven dat je een bericht wilt als het terugkomt.",
      },
    ],
  },
  {
    id: "verzending",
    title: "Verzending",
    items: [
      {
        q: "Wanneer wordt mijn bestelling verzonden?",
        a: "Op werkdagen voor 15:00 besteld, verzenden we dezelfde dag met PostNL.",
      },
      {
        q: "Wat kost verzending?",
        a: "Verzenden kost €5,99. Vanaf €65 verzenden we gratis.",
      },
      {
        q: "Waar kan ik terecht met vragen over mijn pakket?",
        a: "Bel of app ons op 06-19671591, of stuur een e-mail. Dan zoeken we het voor je uit.",
        links: [{ label: "Contact", to: "/contact" }],
      },
    ],
  },
  {
    id: "retour",
    title: "Retour & ruilen",
    items: [
      {
        q: "Kan ik retourneren?",
        a: "Ja, je hebt 30 dagen de tijd. Meld je retour per e-mail en we vertellen je precies wat je moet doen.",
        links: [{ label: "Retourbeleid", to: "/verzending-retour" }],
      },
      {
        q: "Kan ik mijn bestelling ruilen voor een andere maat?",
        a: "Neem binnen de retourtermijn contact met ons op. We kijken samen wat de beste oplossing is.",
        links: [{ label: "Contact", to: "/contact" }],
      },
      {
        q: "Hoe voorkom ik dat ik moet retourneren?",
        a: "Gebruik ons maatadvies en de maattabel voordat je bestelt. Twijfel je tussen twee maten, kies dan de grotere.",
        links: [{ label: "Maatadvies", to: "/maatadvies" }],
      },
    ],
  },
  {
    id: "betalen",
    title: "Betalen",
    items: [
      {
        q: "Hoe kan ik betalen?",
        a: "Met iDEAL, Klarna (achteraf betalen), creditcard of Bancontact.",
      },
      {
        q: "Is betalen veilig?",
        a: "Betalen gaat via een beveiligde (SSL) verbinding met je bank of betaalprovider.",
      },
      {
        q: "Zijn de prijzen inclusief btw?",
        a: "Ja, alle prijzen zijn inclusief btw.",
      },
    ],
  },
  {
    id: "maten",
    title: "Maten & passen",
    items: [
      {
        q: "Welke maat past bij mij?",
        a: "Meet je voet en kijk in ons maatadvies. Daar vind je ook een maattabel.",
        links: [{ label: "Maatadvies", to: "/maatadvies" }],
      },
      {
        q: "Welke maten zijn er?",
        a: "Het merendeel van onze schoenen heb je in maat 36 t/m 41, een deel ook groter. Op de productpagina zie je welke maten er zijn.",
      },
      {
        q: "Hoe meet ik mijn voet?",
        a: "Meet aan het eind van de dag je langste voet op een vel papier. In onze kennisbank staat een stappenplan.",
        links: [{ label: "Lees het stappenplan", to: "/kennisbank/je-schoenmaat-bepalen" }],
      },
    ],
  },
];

/** Selectie voor de homepage: de meest gestelde vragen. */
const HOME = [
  "Wanneer wordt mijn bestelling verzonden?",
  "Wat kost verzending?",
  "Kan ik retourneren?",
  "Hoe kan ik betalen?",
  "Welke maat past bij mij?",
  "Kan ik mijn bestelling ruilen voor een andere maat?",
];
export const HOME_FAQ: Faq[] = HOME.flatMap((q) => {
  const f = FAQ_CATEGORIES.flatMap((c) => c.items).find((i) => i.q === q);
  return f ? [f] : [];
});
