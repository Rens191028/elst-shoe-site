# Taak: Conversie, klantenservice, SEO, toegankelijkheid, marketing & extra UI — Elst Shoe Site

Project: goedkopeschoenen.com
Lovable project-id: `86ee57a7-1bbb-42ca-8d89-9042e8df4786`

Vervolg op eerdere documenten (`footer-task.md`, `accounts-task.md`, `homepage-herontwerp-task.md`, `homepage-modernisering-header-voorraad-task.md`). Dit document bundelt de extra verbeterpunten rond conversie, klantenservice, SEO, toegankelijkheid, marketing en losse UI/layout-verbeteringen.

---

## 0. Bugfix — winkelwagen-icoon (hoogste prioriteit)

- Het winkelwagen-icoon in de header verdwijnt op dit moment volledig na de uitklap-animatie (zie `homepage-modernisering-header-voorraad-task.md`, header-sectie).
- **Vereist gedrag:** het basis-winkelwagen-icoon + aantal-badge moet **altijd permanent zichtbaar blijven** in de header. Alleen de bredere balk (aantal + bedrag) klapt tijdelijk uit bij het toevoegen van een item en daarna weer in — maar het icoon zelf mag nooit verdwijnen, zodat de klant altijd in één oogopslag kan zien hoeveel items er in de winkelwagen zitten.

## 1. Conversie & klantvertrouwen

- Live/recente activiteit tonen (bv. "12 mensen bekeken dit product vandaag" of "Laatst besteld: 2 uur geleden") — subtiele social proof + urgentie.
- Vergelijk-functie: 2-3 producten naast elkaar kunnen zetten (handig bij vergelijkbare sneakers/laarzen).
- "Eerder bekeken"-sectie: recent bekeken producten van de bezoeker terugtonen, bv. onderaan productpagina's of homepage.

## 2. Klantenservice & na-verkoop

- FAQ-achtige veelgestelde vragen (maattabel, verzending, retour) ook laten beantwoorden door de bestaande chat-widget, zodat klanten niet eerst handmatig hoeven te zoeken.
- Track & trace-integratie zodra bestelgeschiedenis in het account staat (zichtbare status + link naar vervoerder, niet alleen "onderweg").
- "Retour aanvragen"-knop direct vanuit een bestelling in het account, i.p.v. alleen tekstuele uitleg over het beleid.

## 3. SEO & vindbaarheid (technisch, geen visuele wijziging)

- Metadata/title-tags per productpagina en categoriepagina controleren en optimaliseren.
- Structured data (schema.org Product/Review markup) toevoegen zodat Google sterren/prijs in zoekresultaten toont.
- Sitemap en interne linkstructuur controleren — belangrijk gezien het grote aantal producten (600+).

## 4. Toegankelijkheid

- Contrastratio's controleren (bv. de kleine grijze tekst onder de hero is vrij licht) — relevant voor leesbaarheid én Google-rankingsignalen.
- Toetsenbordnavigatie door menu's, filters en formulieren controleren/verbeteren.

## 5. Marketing-haakjes

- Verlaten-winkelwagen-herinnering (e-mail), zodra accounts + e-mailadres beschikbaar zijn — bekende, effectieve omzethefboom.
- Refer-a-friend / kortingscode delen — sluit aan bij de bestaande nieuwsbrief-flow (zie `footer-task.md`).

## 6. Layout / UI / visuele consistentie

- **Consistente kaart-stijl** door de hele site: productkaarten, categorietegels en eventuele andere kaarten (blog/kennisbank) moeten qua schaduw, border-radius en hover-gedrag identiek zijn — nu verschilt dit per sectie.
- **Breadcrumbs** op categorie- en productpagina's (bv. Home > Schoenen > Laarzen > productnaam) — ontbreken nu.
- **Productpagina-layout**: strak 2-koloms grid (afbeelding links, info rechts) met een sticky "koop-blok" (prijs/maatkeuze/toevoegen-knop blijft in beeld terwijl de bezoeker door beschrijving/reviews scrolt).
- **Lege staten (empty states)**: nette invulling voor lege winkelwagen, lege favorieten, en een zoekopdracht zonder resultaten — met duidelijke call-to-action (bv. "Nog niks in je winkelwagen — bekijk de sale") in plaats van een kale/lege pagina.
- **Consistente knoppen-hiërarchie**: primaire actie altijd dezelfde stijl (nu gevulde oranje knoppen en outline-knoppen door elkaar), secundaire actie altijd dezelfde andere stijl, overal op de site.
- **Favicon en social-share-preview** (Open Graph-afbeelding) controleren/toevoegen voor een complete visuele afwerking.
- Dark mode: expliciet als "nice to have", geen prioriteit.

---

## Relatie met andere documenten

- `footer-task.md` — footer-herstructurering
- `accounts-task.md` — account-omgeving + favorieten-flow
- `homepage-herontwerp-task.md` — sectievolgorde homepage + algemene visuele stijl-update
- `homepage-modernisering-header-voorraad-task.md` — 3D-hero, interactieve elementen, header-herstructurering, voorraadweergave

Niets uit dit document is al gebouwd — dit zijn vastgelegde requirements, te bouwen zodra akkoord.
