import { createFileRoute } from "@tanstack/react-router";
import {
  Footprints,
  MapPin,
  Tag,
  Truck,
  RotateCcw,
  Phone,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "GoedkopeSchoenen.com — Betaalbare schoenen uit Elst" },
      {
        name: "description",
        content:
          "GoedkopeSchoenen.com uit Elst: trendy heren-, dames- en kinderschoenen voor een eerlijke, lage prijs. Gratis verzending en 30 dagen retour.",
      },
      { property: "og:title", content: "GoedkopeSchoenen.com — Betaalbare schoenen uit Elst" },
      {
        property: "og:description",
        content:
          "Trendy schoenen voor het hele gezin, voor een eerlijke lage prijs. Uit Elst, voor heel Nederland.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const categories = [
  {
    name: "Herenschoenen",
    description: "Sneakers, veterschoenen en boots — altijd scherp geprijsd.",
  },
  {
    name: "Damesschoenen",
    description: "Van sneakers tot pumps en laarzen, voor elke gelegenheid.",
  },
  {
    name: "Kinderschoenen",
    description: "Stevig, comfortabel en betaalbaar — gemaakt om in te spelen.",
  },
  {
    name: "Sportschoenen",
    description: "Hardloopschoenen en trainers voor elke workout.",
  },
];

const usps = [
  {
    icon: Tag,
    title: "Altijd lage prijzen",
    text: "Wij houden onze kosten laag, zodat jij nooit te veel betaalt.",
  },
  {
    icon: Truck,
    title: "Snelle verzending",
    text: "Besteld op werkdagen vóór 16:00, dezelfde dag verzonden.",
  },
  {
    icon: RotateCcw,
    title: "30 dagen retour",
    text: "Niet goed? Stuur ze gratis terug binnen 30 dagen.",
  },
  {
    icon: MapPin,
    title: "Uit Elst",
    text: "Een lokaal bedrijf met persoonlijke service, voor heel Nederland.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Footprints className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">
              GoedkopeSchoenen<span className="text-primary">.com</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#categorieen" className="transition-colors hover:text-foreground">
              Categorieën
            </a>
            <a href="#waarom" className="transition-colors hover:text-foreground">
              Waarom wij
            </a>
            <a href="#over-ons" className="transition-colors hover:text-foreground">
              Over ons
            </a>
            <a href="#contact" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
          <a
            href="#categorieen"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Bekijk assortiment
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
              <MapPin className="h-3.5 w-3.5" /> Trots uit Elst
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Mooie schoenen hoeven niet duur te zijn
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Bij GoedkopeSchoenen.com vind je trendy schoenen voor het hele
              gezin — voor een prijs waar je blij van wordt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#categorieen"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Ontdek het assortiment <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#over-ons"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-secondary"
              >
                Meer over ons
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Schoenen in het schap bij GoedkopeSchoenen.com"
              width={1600}
              height={912}
              className="rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorieen" className="border-t border-border bg-card py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-extrabold md:text-4xl">Onze categorieën</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Ons assortiment wordt binnenkort gevuld. Hier vind je straks alles
            voor heren, dames en kinderen — altijd betaalbaar.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="group rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Footprints className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{cat.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{cat.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Binnenkort beschikbaar
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USPs */}
      <section id="waarom" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-extrabold md:text-4xl">Waarom GoedkopeSchoenen.com?</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {usps.map((usp) => (
              <div key={usp.title}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <usp.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold">{usp.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{usp.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="over-ons" className="border-t border-border bg-accent py-16 text-accent-foreground md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Een schoenenwinkel uit Elst, voor heel Nederland
            </h2>
            <p className="mt-4 text-accent-foreground/80">
              GoedkopeSchoenen.com is gestart in Elst met één simpel idee:
              iedereen verdient goede schoenen zonder de hoofdprijs te betalen.
              Wij selecteren ons assortiment met zorg en houden onze prijzen
              eerlijk en laag.
            </p>
            <p className="mt-4 text-accent-foreground/80">
              Heb je een vraag over een paar schoenen of je bestelling? Wij
              staan persoonlijk voor je klaar.
            </p>
          </div>
          <div className="rounded-3xl bg-background/10 p-8">
            <h3 className="text-xl font-bold">Contactgegevens</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0" /> Elst, Gelderland
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" /> info@goedkopeschoenen.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" /> Bereikbaar op werkdagen
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0" /> Ma–vr 9:00–17:00
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Footprints className="h-4 w-4" />
            </span>
            <span className="font-display font-bold text-foreground">
              GoedkopeSchoenen<span className="text-primary">.com</span>
            </span>
          </div>
          <p>© {new Date().getFullYear()} GoedkopeSchoenen.com — Elst, Gelderland</p>
        </div>
      </footer>
    </div>
  );
}
