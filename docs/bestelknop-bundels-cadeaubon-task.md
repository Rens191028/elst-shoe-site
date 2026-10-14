# Taak: Bestel nu-knop, winkelwagen-balk (update), bundels, maatadvies, cadeaubon, orderbevestiging & moderne reviews — Elst Shoe Site

Project: goedkopeschoenen.com
Lovable project-id: `86ee57a7-1bbb-42ca-8d89-9042e8df4786`

Vervolg op eerdere documenten (`footer-task.md`, `accounts-task.md`, `homepage-herontwerp-task.md`, `homepage-modernisering-header-voorraad-task.md`, `conversie-ui-extra-task.md`).

---

## 1. "Bestel nu" + "Toevoegen aan winkelwagen" — op twee plekken

Op **zowel de productkaart (categorie-/overzichtspagina's) als de productpagina zelf**:

- **"Bestel nu"** — primaire knop (gevuld, oranje). Leidt de klant **direct naar de bestel-/checkoutpagina** met dit ene product, zonder tussenstap via de winkelwagen.
- **"Toevoegen aan winkelwagen"** — secundaire knop (outline), eronder geplaatst. Voegt het product toe aan de winkelwagen zodat de klant kan doorshoppen.

## 2. Winkelwagen-icoon & balk — BELANGRIJKE UPDATE op eerdere afspraak

Dit vervangt het eerder vastgelegde gedrag in `conversie-ui-extra-task.md` (sectie 0) en `homepage-modernisering-header-voorraad-task.md` (header-sectie):

- Het winkelwagen-icoon in de header blijft **altijd zichtbaar**, zoals al afgesproken.
- **Nieuw/aangescherpt:** zodra er één of meer producten in de winkelwagen zitten, blijft de **brede balk met aantal + totaalbedrag permanent zichtbaar** naast het icoon — dit klapt dus niet meer terug naar alleen een klein icoon met badge.
- Bij het **toevoegen** van een product speelt er een nette animatie (bv. de balk/icoon die even "springt" of de balk die soepel groter wordt/oplicht) om de toevoeging te bevestigen — maar de balk zelf blijft daarna gewoon staan zolang er items in de winkelwagen zitten.
- Alleen wanneer de winkelwagen weer leeg is, verdwijnt de balk en blijft alleen het kale icoon over.

## 3. Bundeldeals

- Promotieblok voor combi-aanbiedingen (bv. "Koop 2, krijg 10% korting" of "schoenen + bijpassende tas met korting").
- Plaatsen in de Sale-sectie op de homepage (zie `homepage-herontwerp-task.md`) en eventueel op relevante productpagina's als suggestie.

## 4. Maatadvies — visueel element

- Een echte visuele maattabel-popup per product (niet alleen tekstueel advies), rekening houdend met merkverschillen in maatvoering.
- Toegankelijk vanaf de productpagina, dicht bij de maatkeuze.

## 5. Cadeaubon

- Digitale cadeaubon die klanten kunnen kopen en versturen (zelf te kiezen bedrag of vaste bedragen).
- Eigen plek in de navigatie of als apart product in de catalogus.

## 6. Orderbevestigingspagina/-mail

- De huidige bevestigingspagina/-mail na het plaatsen van een bestelling visueel laten aansluiten bij de rest van de site (huisstijl, typografie, kleuren) in plaats van een kaal standaardsjabloon.

## 7. Reviews — modern en professioneel, met animatie

- Reviews per product (zoals eerder vastgelegd) uitbreiden met:
  - Mogelijkheid voor klanten om een **foto** bij hun review te uploaden.
  - **Animatie**: reviews faden/schuiven één voor één in zodra de sectie in beeld scrollt (staggered reveal, niet alles tegelijk).
  - Sterren die vloeiend "vullen"/oplichten bij het in beeld komen.
  - Lichte hover-vergroting op reviewfoto's.

---

## Relatie met andere documenten

- `footer-task.md` — footer-herstructurering
- `accounts-task.md` — account-omgeving + favorieten-flow
- `homepage-herontwerp-task.md` — sectievolgorde homepage + visuele stijl-update
- `homepage-modernisering-header-voorraad-task.md` — 3D-hero, interactieve elementen, header, voorraad (winkelwagen-gedrag hier bijgewerkt, zie sectie 2)
- `conversie-ui-extra-task.md` — conversie/klantenservice/SEO/toegankelijkheid/marketing/UI (winkelwagen-fix hier bijgewerkt, zie sectie 2)

Niets uit dit document is al gebouwd — dit zijn vastgelegde requirements, te bouwen zodra akkoord.
