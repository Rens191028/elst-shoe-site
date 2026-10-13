// Bedrijfsgegevens (CLAUDE.md §2) en winkelregels op één plek.
export const SITE = {
  name: "GoedkopeSchoenen.com",
  url: "https://goedkopeschoenen.com",
  address: { street: "Taminiausingel 15", zip: "6662MD", city: "Elst" },
  kvk: "84772018",
  btw: "NL863360324B01",
  phone: "06-19671591",
  phoneHref: "tel:+31619671591",
  whatsappHref: "https://wa.me/31619671591",
  email: "info@goedkopeschoenen.com",
  founded: 2012,
  // Controleer deze cijfers bij livegang (uit eerdere analyse van de live site).
  kiyoh: { score: 9.3, count: 6531, url: "" },
  freeShippingFrom: 65,
  shippingCost: 5.99,
  // Vul de echte profiel-URL's in; alleen ingevulde netwerken worden getoond.
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  } as Record<"instagram" | "facebook" | "tiktok", string>,
  // Zolang er geen betaalprovider/backend is gekoppeld blijft de checkout een demo.
  checkoutLive: false,
} as const;

// Echte klantcitaten hier invullen; de sectie op de homepage verschijnt zodra er items zijn.
export const REVIEWS: { name: string; stars: number; text: string }[] = [];

// Echte Instagram/UGC-foto's (klantfoto's of eigen posts); de strook bij de sale verschijnt zodra er items zijn.
export const UGC: { image: string; href: string; alt: string }[] = [];

export const ANNOUNCEMENTS = [
  "Gratis verzending vanaf €65",
  "Op werkdagen vóór 15:00 besteld, dezelfde dag verzonden",
  "Achteraf betalen met Klarna",
];
