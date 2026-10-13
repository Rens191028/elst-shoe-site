# GoedkopeSchoenen.com — Website-vernieuwing

Werkafspraken voor wie (mens of Claude) aan deze site bouwt.

## Stack en keuzes

- TanStack Start (React 19, file-routes in `src/routes`), Tailwind v4, shadcn/ui, Lovable-gekoppeld (geen git-history herschrijven).
- **Geen Shopify**: geen koppeling, geen vermelding in code/copy. (Alleen de bestaande productfoto-URL's in de catalogus staan nog op het oude CDN; zie "Open punten".)
- Catalogus: `src/data/products.json`, gegenereerd uit de xlsx met `python3 -I scripts/build-catalog.py <xlsx>` (normaliseert kleuren, categorieën en van-prijzen). Niet met de hand bewerken.
- Winkelwagen: `src/lib/cart.tsx` (localStorage).
- Accounts: Supabase Auth (e-mail + wachtwoord) via `src/lib/auth.tsx`; favorieten alleen met account (`src/lib/favorites.tsx`, geen gast-wishlist). Tabellen `profiles`, `favorites`, `orders` met RLS: zie `supabase/migrations/`. `src/integrations/supabase/*` is auto-gegenereerd, niet met de hand bewerken (behalve het bijwerken van `types.ts` na een migratie).
- Bedrijfsgegevens en winkelregels: `src/lib/site.ts`.

## Huisstijl

- Tokens in `src/styles.css`: achtergrond `#FAFAF8`, tekst `#141413`, accent terracotta `#B5582E` (hover `#99471F`). Accent spaarzaam: CTA's, sale-badges, highlights.
- Archivo (koppen/logo, 800, iets verbreed via `font-stretch: 112%`) + Inter (body, 400). Logo "Tempo": drie gekantelde staafjes + wordmark (`components/site/Logo.tsx`, `public/favicon.svg`).
- Animaties 200–400ms, rustig, respecteer `prefers-reduced-motion`. Geen autoplay-carrousels, nep-urgentie (countdowns zonder echte einddatum) of pop-ups. 3D-tilt alleen op hero en productpagina.

## Regels

- Kaarten/panelen `rounded-2xl`, grote vlakken `rounded-3xl`, knoppen en pills `rounded-full`. Primaire CTA's gebruiken `bg-cta` (gradient). Secties wisselen wit / `bg-cream` / donker.
- "Vaak samen gekocht"/cross-sell alleen binnen dezelfde categorie (`related`, `crossSell`).
- Van-prijs alleen tonen bij echte korting (`Product.w` is anders null).
- Filters alleen tonen bij collecties met ≥10 producten.
- Verzin geen reviews, klantnamen of statistieken. Echte citaten in `REVIEWS` (site.ts); Kiyoh-cijfers bij livegang controleren.
- Levertijdbelofte overal gelijk: op werkdagen voor 15:00 besteld, dezelfde dag verzonden.

## Open punten

- Checkout is een **demo** (`SITE.checkoutLive = false`): backend, betaalprovider (iDEAL/Klarna/creditcard/Bancontact) en orderverwerking ontbreken nog.
- Zet in Supabase (Authentication) "Confirm email" uit en voeg `<site-url>/wachtwoord-resetten` toe aan de toegestane redirect-URL's.
- `orders` wordt pas gevuld als de checkout een backend heeft (nu alleen lezen voor gebruikers).
- Instagram/UGC-strook (bij de sale) verschijnt zodra `UGC` in `site.ts` gevuld is; Kiyoh-profiel-URL in `SITE.kiyoh.url` maakt de badges klikbaar.
- Nog niet gedaan uit het homepage-document: sorteren op "populair" (geen verkoopdata), merkfilter (alle producten hebben hetzelfde merk) en een echte sale-countdown (geen einddatum bekend).
- Social-URL's invullen in `SITE.social`; ManyChat-widget nog niet geplaatst.
- Productfoto's staan nog op het oude CDN: verhuizen naar eigen opslag; achtergrondverwerking pas na testbatch.
- Data heeft één foto per product (geen hover-crossfade/swipe tussen foto's), geen verkoopdata (dus geen "Bestseller"-badge) en geen omschrijvingen (nu afgeleid uit titel).
- Kinderschoenen (6 producten, in "Overig schoenen") nog inhoudelijk nalopen.
