# Taak: FAQ-sectie, winkelwagen-meldingsfix & categoriepagina-verbeteringen — Elst Shoe Site

Project: goedkopeschoenen.com
Lovable project-id: `86ee57a7-1bbb-42ca-8d89-9042e8df4786`

Vervolg op eerdere documenten (o.a. `footer-task.md`, `homepage-herontwerp-task.md`, `visuele-stijl-animaties-header-task.md`, `sale-cadeaubon-checkout-content-task.md`). Dit document bundelt een nieuwe FAQ-sectie + losse FAQ-pagina, een bugfix in de checkout-melding, en visuele/functionele verbeteringen voor de categoriepagina's.

---

## 1. FAQ-sectie op de homepage (vervangt "Eerder bekeken")
- De huidige "Eerder bekeken"-sectie op de homepage **verwijderen** en vervangen door een nieuwe FAQ-sectie.
- **Vorm:** accordeon-stijl met 5-6 meest gestelde vragen (verzending, retour, betalen, maatadvies, levertijd, ruilen). Vraag/antwoord klapt open/dicht met een vloeiende animatie (hoogte + fade, pijltje dat ronddraait).
- **Visueel/3D:**
  - Naast de accordeon-lijst een zwevend, langzaam ronddraaiend decoratief 3D-object (bv. een schoendoos die licht open/dicht beweegt, of een klein schoen-icoon) — puur sfeer, geen productdata nodig.
  - Bij het openen van een vraag reageert het 3D-element licht mee (bv. kleine bounce/pulse).
  - Scroll-reveal: de sectie fadet/schuift in bij scrollen (sluit aan bij de motion-taal uit `visuele-stijl-animaties-header-task.md`).
  - Achtergrond van de sectie licht afwijkend van de rest van de pagina, zodat het een herkenbaar eigen blok is (vergelijkbaar met de aanpak bij de Sale-pagina).
- **Onderaan de sectie:** duidelijke knop "Bekijk alle vragen →" die doorlinkt naar de volledige FAQ-pagina.

## 2. Losse, volledige FAQ-pagina
- Dezelfde visuele stijl als de homepage-sectie (accordeon + decoratief 3D-element bovenaan als hero).
- Alle vragen gecategoriseerd (bv. Bestellen, Verzending, Retour & Ruilen, Betalen, Maten & Passen) met aanzienlijk meer vragen/antwoorden dan de homepage-selectie.
- Dit is de pagina waar de "FAQ"-link in de footer (zie `footer-task.md`) naartoe verwijst.

## 3. Bugfix — winkelwagen-melding bij lege winkelwagen
- Op de afrekenpagina verschijnt nu de melding "Je bestelt alleen [product]. Je winkelwagen blijft ongewijzigd. Bekijk winkelwagen" — ook wanneer de winkelwagen daadwerkelijk leeg is. Dit is verwarrend, want het winkelwagen-icoon toont dan "leeg"/0 items.
- **Gewenst gedrag:** deze melding (en elke verwijzing naar "je winkelwagen") mag alleen getoond worden wanneer er daadwerkelijk ook nog andere items in de winkelwagen zitten naast het "Bestel nu"-item. Is de winkelwagen leeg, dan wordt er nergens iets over de winkelwagen vermeld op de afrekenpagina.

## 4. Categoriepagina's — subtiele visuele differentiatie per categorie
Nu zien Schoenen, Tassen en Accessoires er qua lay-out en kleur identiek uit. Subtiel (niet zo uitgesproken als bij de Sale-pagina) onderscheid toevoegen:
- **Zachte accentkleur per categorie** in titel-onderstreping, actieve filter-knoppen en knop-randen — bv. Schoenen in een warme bruine tint, Tassen in zachte terracotta, Accessoires in goud/zand. Subtiel, geen vervanging van de huisstijl.
- **Licht decoratief achtergrondelement** boven de productgrid, net onder de titel (bv. een zeer lichte, vage lijntekening passend bij de categorie) — decoratief, niet storend.
- **Categorie-specifieke iconen** bij de subcategorie-filterknoppen (Laarzen/Sneakers/etc.) naast de tekst.
- **Categoriepagina-hero**: subtiele sfeerfoto/banner per categorie toevoegen, in plaats van alleen tekst bovenaan.

## 5. Categoriepagina's — functionele verbeteringen
- **Quick view**: product direct in een popup bekijken vanaf de categoriepagina, zonder naar de productpagina te hoeven.
- **Kleurvarianten op de productkaart**: kleine kleur-stipjes onder de productfoto tonen als een product in meerdere kleuren bestaat, i.p.v. losse bijna-identieke productkaarten per kleur.
- **Actieve filters als "chips"** boven de productgrid (bv. "Maat 39 ✕", "Zwart ✕"), makkelijk te verwijderen.
- **"Terug naar boven"-knop** die verschijnt na scrollen, relevant bij lange lijsten (bv. 582 producten bij Schoenen).
- **Paginering of "Laad meer"-knop** onderaan de productgrid — bewuste keuze maken i.p.v. onduidelijk oneindig scrollen.
- **Vergelijk-functie afmaken**: vaste, uitklapbare balk onderaan het scherm die verschijnt zodra 2+ producten zijn aangevinkt om te vergelijken, met een "Vergelijk nu"-knop (het "Vergelijk"-linkje per product bestaat al, zie screenshot).

---

## Relatie met andere documenten
- `footer-task.md` — FAQ-link in de footer verwijst naar de nieuwe volledige FAQ-pagina
- `homepage-herontwerp-task.md` — sectievolgorde homepage, "Eerder bekeken" hier vervangen door FAQ
- `visuele-stijl-animaties-header-task.md` — motion-taal, hier toegepast op FAQ-sectie
- `sale-cadeaubon-checkout-content-task.md` — Sale-pagina als referentie voor de subtielere categorie-aanpak; checkout-ervaring (voortgangsindicator etc.), hier aangevuld met de winkelwagen-meldingsfix
- `homepage-modernisering-header-voorraad-task.md` — voorraadweergave, relevant bij categoriepagina's

Niets uit dit document is al gebouwd — dit zijn vastgelegde requirements, te bouwen zodra akkoord.
