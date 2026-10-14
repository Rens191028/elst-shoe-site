# GoedkopeSchoenen.com — Website-vernieuwing

Werkafspraken voor wie (mens of Claude) aan deze site bouwt.

## Stack en keuzes

- TanStack Start (React 19, file-routes in `src/routes`), Tailwind v4, shadcn/ui, Lovable-gekoppeld (geen git-history herschrijven).
- **Geen Shopify**: geen koppeling, geen vermelding in code/copy. (Alleen de bestaande productfoto-URL's in de catalogus staan nog op het oude CDN; zie "Open punten".)
- Catalogus: `src/data/products.json`, gegenereerd uit de xlsx met `python3 -I scripts/build-catalog.py <xlsx>` (normaliseert kleuren, categorieën en van-prijzen). Niet met de hand bewerken.
- Winkelwagen: `src/lib/cart.tsx` (localStorage). Toevoegen opent de lade niet: de header-winkelwagen toont een permanente balk met aantal en totaal zolang er items zijn (rustig: witte balk met dunne rand; "popt" en een mini-foto vliegt ernaartoe bij toevoegen via `addTick`/`flyToCart`); alleen een lege wagen toont het kale icoon. Bedragen komen uit `priceLines` (`src/lib/bundles.ts`).
- Bundelkorting: regels in `BUNDLES` (`src/lib/bundles.ts`); nu 10% bij 2 paar schoenen buiten de sale. De voorwaarden zijn een voorstel: laat de winkelier bevestigen.
- "Bestel nu" (kaart en productpagina) gaat naar `/afrekenen?direct=<handle>&maat=<maat>` en laat de winkelwagen ongemoeid.
- Cadeaubon: virtueel product `cadeaubon-<bedrag>` (`src/lib/voucher.ts`, niet in de catalogus); de "maat" is `Voor <naam> — “boodschap”` (geen e-mail ontvanger: de bon gaat naar de koper). Pagina `/cadeaubon` met live voorbeeldkaart; `VoucherCard`/`voucherSvg` is de ene bron voor weergave, PNG-download en print. Op `/bedankt` krijgt de koper de bon; de unieke code (`generateVoucherCode`) wordt alleen getoond als `SITE.checkoutLive`, en moet dan ook in een backend worden vastgelegd en bij het afrekenen gevalideerd.
- Reviews per product: `src/data/reviews.json` (`{handle: [{name, stars, text, date?, photo?}]}`), nu leeg; nooit verzinnen. Foto-upload door klanten vraagt een database + opslag + moderatie.
- Orderbevestigingsmail: `src/lib/emails/orderConfirmation.ts` (huisstijl-HTML + tekst), nog niet gekoppeld aan een mailservice.
- Vergelijken (max 3) en "eerder bekeken": `src/lib/shopper.tsx` (localStorage, geen account nodig); UI in `components/site/shopper-ui.tsx`, pagina `/vergelijken`.
- SEO: `public/sitemap.xml` genereren met `node scripts/build-sitemap.mjs` na elke catalogus-update (`src/test/seo.test.ts` bewaakt de dekking). Titels/descriptions via `seoTitle`/`seoDescription`; OG-afbeelding `public/og-image.png`.
- Voorraad: `src/lib/stock.ts` leest `src/data/stock.json` (`{handle: {maat: aantal}}`). De catalogus heeft alleen ja/nee; zonder aangeleverde aantallen wordt nooit een aantal getoond.
- Accounts: Supabase Auth (e-mail + wachtwoord) via `src/lib/auth.tsx`; favorieten alleen met account (`src/lib/favorites.tsx`, geen gast-wishlist). Tabellen `profiles`, `favorites`, `orders` met RLS: zie `supabase/migrations/`. `src/integrations/supabase/*` is auto-gegenereerd, niet met de hand bewerken (behalve het bijwerken van `types.ts` na een migratie).
- Checkout (`/afrekenen`): stappen Gegevens → Verzending → Betalen (cadeaubon: Gegevens → Betalen), live verzendbelofte via `src/lib/cutoff.ts` + `CutoffNotice` (15:00 Amsterdam, feestdagen niet meegenomen), "Veilig betalen"-blok bij de betaalknop.
- Sale (`/collectie/sale`): donker thema via `.sale-theme` (tokens overschreven), `SaleHero` ("Tot -X%" uit de catalogus), standaard sortering op korting. Countdown alleen als `SITE.saleEndsAt` gevuld is.
- Voorraadmelding (`StockAlert`): bij uitverkocht een "laat me weten"-knop; zonder backend een voorgevulde e-mail (mailto).
- Kennisbank: artikelen in `src/data/articles.ts`, routes `/kennisbank` en `/kennisbank/$slug` (Article JSON-LD); `build-sitemap.mjs` leest de slugs.
- Productpagina mobiel: vaste "Bestel nu"-balk zodra de gewone knoppen uit beeld zijn. Homepage: "Omdat je … bekeek" (`PersonalPicks`) uit lokaal bekeken/favorieten.
- Exit-intent (`ExitIntent`): alleen desktop met hover, 1× per week, niet in checkout/account, zelfde WELKOM10-aanbod als de footer.
- FAQ: inhoud in `src/data/faq.ts` (alleen vaststaande feiten; twijfelgevallen verwijzen naar contact). Homepage-sectie `FaqSection` (vervangt "Eerder bekeken" op de homepage; die blijft op de productpagina) en volledige pagina `/faq` (categorieën, FAQPage JSON-LD), met het decoratieve `ShoeBox3D` dat meereageert op open/dicht.
- Categoriepagina's: per hoofdcategorie een zachte accentkleur (`THEME` in `collectie.$slug.tsx`, via `--cat`), banner met lijnicoon, icoon per subcategorie, "Terug naar boven", quick view (`QuickView`), en één kaart per model met kleurstipjes (`src/lib/variants.ts`; bij een kleurfilter zie je de losse varianten). Vergelijkbalk (`CompareTray`) is inklapbaar; "Vergelijk nu" vanaf 2 producten.
- Afrekenen: de melding "je winkelwagen blijft ongewijzigd" verschijnt alleen als er daadwerkelijk andere items in de wagen zitten.
- Bedrijfsgegevens en winkelregels: `src/lib/site.ts`.

## Huisstijl

- Tokens in `src/styles.css`: achtergrond `#FAFAF8`, tekst `#141413`, accent terracotta `#B5582E` (hover `#99471F`). Accent spaarzaam: CTA's, sale-badges, highlights.
- Archivo (koppen/logo, 800, iets verbreed via `font-stretch: 112%`) + Inter (body, 400). Logo "Tempo": drie gekantelde staafjes + wordmark (`components/site/Logo.tsx`, `public/favicon.svg`).
- Motion-taal: hartje-pop, ripple op primaire knoppen (`RippleInit`), magnetische kaartknoppen (`MagneticButton`), "Bekijk"-cursorlabel op productfoto's, scrollvoortgangsbalk, hero-parallax, sale-prijs-flash, View Transitions voor paginawissels (`defaultViewTransition`). Alles uit bij `prefers-reduced-motion`.
- Zoeken is een icoon dat inline uitklapt (`InlineSearch`); het mega-menu heeft één categorielijst + één knop en één focus (nieuw in …).
- Animaties 200–400ms, rustig, respecteer `prefers-reduced-motion`. Geen autoplay-carrousels, nep-urgentie (countdowns zonder echte einddatum) of pop-ups; enige uitzondering is de rustige exit-intent op desktop (1× per week). 3D-tilt/pseudo-3D alleen op hero, categorietegels (licht) en productpagina; het zwevende merkicoon (`Deco3D`) is puur decoratief.

## Regels

- Knoppen: primair = `bg-cta` gevuld, secundair = `border border-ink` outline; donkere `bg-ink`-knoppen alleen op gekleurde vlakken. Accentkleur voor tekst: `text-primary-text` (contrast), `text-primary` alleen voor iconen/grote tekst/donkere vlakken.
- Toegankelijkheid: houd axe (WCAG 2.1 AA) schoon; `--soft` is bewust donker genoeg voor kleine tekst.
- Kaarten/panelen `rounded-2xl`, grote vlakken `rounded-3xl`, knoppen en pills `rounded-full`. Primaire CTA's gebruiken `bg-cta` (gradient). Secties wisselen wit / `bg-cream` / donker.
- "Vaak samen gekocht"/cross-sell alleen binnen dezelfde categorie (`related`, `crossSell`).
- Van-prijs alleen tonen bij echte korting (`Product.w` is anders null).
- Filters alleen tonen bij collecties met ≥10 producten.
- Verzin geen reviews, klantnamen of statistieken. Echte citaten in `REVIEWS` (site.ts); Kiyoh-cijfers bij livegang controleren.
- Levertijdbelofte overal gelijk: op werkdagen voor 15:00 besteld, dezelfde dag verzonden.

## Open punten

- Categoriebanners zijn gradient + lijnicoon: een echte sfeerfoto per categorie vraagt eigen beeldmateriaal.
- FAQ-antwoord over ruilen verwijst naar contact: laat de winkelier de ruilregels bevestigen.

- Sale-einddatum: vul `SITE.saleEndsAt` (ISO) voor een echte countdown; leeg = geen countdown.
- Cadeaubon: code-uitgifte, e-mailbezorging en inwisselen bij het afrekenen vragen een backend; nu toont de bon in de demo geen code.
- Voorraadmelding gaat via mailto; een echte melding bij herbevoorrading vraagt een tabel + mail (database-wijziging eerst bevestigen).
- Duurzaamheid/herkomst per product niet gebouwd: er is geen data over herkomst; niets verzinnen. Het onderhoudsartikel noemt alleen langer dragen.

- Checkout is een **demo** (`SITE.checkoutLive = false`): backend, betaalprovider (iDEAL/Klarna/creditcard/Bancontact) en orderverwerking ontbreken nog.
- Zet in Supabase (Authentication) "Confirm email" uit en voeg `<site-url>/wachtwoord-resetten` toe aan de toegestane redirect-URL's.
- `orders` wordt pas gevuld als de checkout een backend heeft (nu alleen lezen voor gebruikers).
- Instagram/UGC-strook (bij de sale) verschijnt zodra `UGC` in `site.ts` gevuld is; Kiyoh-profiel-URL in `SITE.kiyoh.url` maakt de badges klikbaar.
- Nog niet gedaan uit het homepage-document: sorteren op "populair" (geen verkoopdata), merkfilter (alle producten hebben hetzelfde merk) en een echte sale-countdown (geen einddatum bekend).
- Voorraadlabels ("nog maar X op voorraad", per maat) verschijnen pas als `src/data/stock.json` gevuld wordt of de voorraad uit een database komt.
- Hero is één foto met pseudo-3D (slepen, zachte zwaai, scroll); een echt 360°-model vraagt om extra foto's of een 3D-bestand.
- Mega-menu toont "Nieuw in …" i.p.v. "Populair in …" (geen verkoopdata).
- Niet gebouwd uit het conversie-document, bewust: "X mensen bekeken dit"/"laatst besteld" (geen echte activiteitsdata; verzonnen cijfers zijn misleidend), track & trace (orders hebben geen vervoerder-/trackingvelden), verlaten-winkelwagen-mail en refer-a-friend (vragen een e-mailbackend), dark mode (nice to have).
- "Retour aanvragen" in het account opent een voorgevuld e-mailtje (geen retourportaal).
- Openingstijden: `SITE.hours` (site.ts) is leeg; de tijden zijn nergens vastgelegd. Vul in, dan verschijnen ze in de footer en op /contact.
- Mobiel: onder 640px verbergt het logo zijn woordnaam zodra er items in de wagen zitten (ruimte voor de balk); op 320px breed loopt de header nog ~25px over.
- Social-URL's invullen in `SITE.social`; ManyChat-widget nog niet geplaatst.
- Productfoto's staan nog op het oude CDN: verhuizen naar eigen opslag; achtergrondverwerking pas na testbatch.
- Data heeft één foto per product (geen hover-crossfade/swipe tussen foto's), geen verkoopdata (dus geen "Bestseller"-badge) en geen omschrijvingen (nu afgeleid uit titel).
- Kinderschoenen (6 producten, in "Overig schoenen") nog inhoudelijk nalopen.
