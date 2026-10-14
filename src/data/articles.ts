/** Kennisbank: algemene schoen- en maatadvies. Geen productbeloftes of cijfers verzinnen. */
export type Block = { h: string; p: string[] };
export type Article = {
  slug: string;
  title: string;
  description: string;
  /** ISO-datum van publicatie */
  date: string;
  /** Collectie waar het artikel naar doorverwijst */
  collection: string;
  blocks: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "zo-kies-je-de-juiste-laarzen",
    title: "Zo kies je de juiste laarzen",
    description:
      "Enkellaarsjes, cowboylaarzen of hoge laarzen? Zo kies je laarzen die goed zitten en bij je outfit passen.",
    date: "2026-10-14",
    collection: "laarzen",
    blocks: [
      {
        h: "Begin bij waar je ze voor draagt",
        p: [
          "Draag je ze vooral naar werk of stad, dan werkt een lage tot middelhoge laars met een stabiele hak het prettigst. Voor festivals en uitgaan mag het stoerder: boots met een dikkere zool of een opvallend model.",
          "Denk ook aan wat je erboven draagt. Enkellaarsjes combineren makkelijk met jurken, rokken en cropped broeken. Hoge laarzen komen het mooist uit onder een rok of over een slanke broek.",
        ],
      },
      {
        h: "Let op de pasvorm",
        p: [
          "Bij hoge laarzen is niet alleen je voetmaat belangrijk, maar ook de wijdte van de schacht rond je kuit. Meet je kuit op het breedste punt en vergelijk dat met de productinformatie als die er staat.",
          "Twijfel je tussen twee maten? Meet je voet (zie ons maatadvies) en kies bij een dikke sok of een ruimere voet liever de grotere maat.",
        ],
      },
      {
        h: "Materiaal en kleur",
        p: [
          "Leatherlook is makkelijk schoon te maken en hoeft nauwelijks verzorging. Suèdine heeft een zachte, matte uitstraling maar neemt sneller vlekken op; behandel het met een beschermspray.",
          "Zwart en bruin gaan met bijna alles. Een opvallende kleur maakt van je laarzen het middelpunt van je outfit, dus houd de rest dan rustig.",
        ],
      },
    ],
  },
  {
    slug: "schoenen-onderhouden",
    title: "Schoenen onderhouden: zo gaan ze langer mee",
    description:
      "Eenvoudige tips om leatherlook, suèdine en sneakers schoon en mooi te houden, zodat je er langer plezier van hebt.",
    date: "2026-10-14",
    collection: "schoenen",
    blocks: [
      {
        h: "Laat schoenen drogen en rusten",
        p: [
          "Draag niet elke dag dezelfde schoenen. Zo kunnen ze na het dragen helemaal uitdrogen, wat geur en slijtage beperkt.",
          "Zijn ze nat geworden? Stop er opgevouwen papier in en laat ze op kamertemperatuur drogen, niet op de verwarming: warmte kan het materiaal laten kromtrekken of scheuren.",
        ],
      },
      {
        h: "Leatherlook en kunststof",
        p: [
          "Neem ze af met een vochtige doek en een druppel milde zeep. Droog na met een zachte doek. Vermijd agressieve schoonmaakmiddelen.",
        ],
      },
      {
        h: "Suèdine",
        p: [
          "Borstel het oppervlak voorzichtig met een zachte suèdeborstel, steeds in dezelfde richting. Gebruik voor het eerste gebruik een beschermspray en vermijd water zoveel mogelijk.",
        ],
      },
      {
        h: "Sneakers",
        p: [
          "Haal de veters eruit en was ze apart. Maak de zool schoon met een zachte borstel en wat lauw water met zeep. Doe sneakers niet in de wasmachine, tenzij de verzorgingsinstructies dat uitdrukkelijk toestaan.",
        ],
      },
      {
        h: "Langer dragen is ook duurzamer",
        p: [
          "Hoe langer je schoenen mooi blijven, hoe minder vaak je ze hoeft te vervangen. Goed onderhoud is dus de makkelijkste manier om bewuster met mode om te gaan.",
        ],
      },
    ],
  },
  {
    slug: "je-schoenmaat-bepalen",
    title: "Je schoenmaat bepalen: zo meet je je voet",
    description:
      "In drie stappen je voetlengte meten en omrekenen naar de juiste schoenmaat, zodat je online zeker de juiste maat bestelt.",
    date: "2026-10-14",
    collection: "schoenen",
    blocks: [
      {
        h: "Meet aan het eind van de dag",
        p: [
          "Je voeten zijn aan het eind van de dag het grootst. Meet daarom in de avond, op blote voeten, staand op een vlakke ondergrond.",
        ],
      },
      {
        h: "In drie stappen",
        p: [
          "1. Zet je voet op een vel papier met je hiel tegen een muur en markeer het uiteinde van je langste teen.",
          "2. Meet de afstand van de muur tot het streepje in millimeters.",
          "3. Meet beide voeten en kies de langste. Gebruik die lengte in onze maattabel of in het maatadvies op de site.",
        ],
      },
      {
        h: "Tussen twee maten in?",
        p: [
          "Kies bij een bredere voet, dikke sokken of een gesloten model de grotere maat. Bij open of ruim vallende modellen mag de kleinere. Past het toch niet, dan kun je binnen de retourtermijn ruilen of retourneren.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
