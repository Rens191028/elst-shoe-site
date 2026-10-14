# Taak: Homepage-modernisering, header-herstructurering & voorraadweergave — Elst Shoe Site

Project: goedkopeschoenen.com
Lovable project-id: `86ee57a7-1bbb-42ca-8d89-9042e8df4786`

Dit document is een vervolg op `homepage-herontwerp-task.md` (sectievolgorde, visuele stijl-update) en bundelt de nieuwe afspraken: 3D-hero, interactieve/moderne elementen, header-herstructurering en voorraadweergave.

---

## 1. Hero — 3D-product beter benutten

- Het uitgelichte product in de hero (nu een platte productfoto tegen grijze studio-achtergrond) interactief maken met hetzelfde 3D-draai-effect dat al op productpagina's wordt gebruikt — bezoeker kan direct in de hero al aan het product "draaien".
- Subtiele auto-rotatie: het model langzaam laten ronddraaien uit zichzelf, stopt/neemt het over zodra de bezoeker er zelf aan sleept.
- Meer diepte: zachte drop-shadow of lichte vloer-reflectie onder het product i.p.v. volledig geïsoleerd op een vlak canvas.
- Optioneel: lichte scroll-interactie (model draait subtiel mee terwijl je naar beneden scrollt).

## 2. Homepage — interactieve/moderne elementen

- **"Waarom goedkopeschoenen.nl"-sectie**: eigen visuele sectie (geen platte tekst+icoon-rij), met per USP een subtiel bewegend/decoratief element (bv. licht zwevend icoon bij scroll).
- **Interactieve statistieken**: cijfers (6.531 reviews, 9,3 score) die optellen/animeren zodra de sectie in beeld scrollt.
- **Scroll-triggered reveals**: secties (categorieën, bestsellers, waarom-wij, reviews) faden/schuiven zachtjes in beeld bij scrollen, in plaats van direct zichtbaar.
- **Micro-interactie op categorietegels**: lichte tilt/parallax-effect bij hover in plaats van een platte hover-state.
- **Decoratief 3D-sfeerelement**: optioneel een los zwevend/ronddraaiend 3D-object (bv. een sneaker) tussen secties, puur sfeer, niet gekoppeld aan een specifiek product.

## 3. Header — herstructurering

**Volgorde rechts in de header (van buiten naar binnen):**

1. **Account-icoon** — helemaal rechts.
2. **Winkelwagen-icoon** — direct ernaast (links van account).
   - Bij leeg: alleen het icoon.
   - Bij toevoegen van een item: icoon klapt met een nette animatie uit naar een **brede balk** die het aantal items én het totaalbedrag toont (bv. "2 items · €49,98").
   - Na de animatie klapt de balk weer in tot alleen het icoon (met klein aantal-badge als blijvende indicator).
   - Dit uitklappen gebeurt **alleen bij het toevoegen** van een item — niet standaard zichtbaar, niet permanent open.
3. Zoeken/wishlist zoals nu, links van winkelwagen.

**Overige header-verbeteringen:**

- Sticky header die meegaat met scrollen.
- Mega-menu i.p.v. simpele dropdown bij Schoenen/Tassen/Accessoires: visueel grid met uitgelichte producten/beelden per categorie, inclusief "Populair in [categorie]"-rijtje (zoals eerder afgesproken).
- Zoekbalk directer zichtbaar/uitklapbaar met live suggesties (in plaats van alleen een icoon).
- Account-icoon verandert van status zodra ingelogd (bv. avatar/initiaal i.p.v. outline-icoon).
- Aankondigingsbalk bovenaan (nu "Gratis verzending vanaf €65") laten rouleren met meerdere boodschappen (sale, nieuw binnen, verzendinfo).
- Header verdwijnt bij naar beneden scrollen, verschijnt weer bij omhoog scrollen (i.p.v. permanent vastgeplakt).

## 4. Voorraadweergave

- Voorraadstatus tonen op productkaarten bij lage voorraad (bv. label "nog maar 2 op voorraad").
- Voorraadstatus per maat op de productpagina (zoals vastgelegd in `homepage-herontwerp-task.md`, sectie Productpagina — hier herbevestigd als onderdeel van deze taak).
- Voorraad/urgentie ook inzetten bij uitgelichte sale-items op de homepage (bv. "nog 3 op voorraad" als urgentie-signaal).

---

## Relatie met andere documenten

- `footer-task.md` — footer-herstructurering (los, nog te bouwen)
- `accounts-task.md` — account-omgeving + favorieten-flow (los, nog te bouwen)
- `homepage-herontwerp-task.md` — sectievolgorde homepage + algemene visuele stijl-update (basis waar dit document op voortbouwt)

Niets uit deze documenten is al gebouwd — dit zijn vastgelegde requirements, te bouwen zodra akkoord.
