# Taak: Header/dropdown vereenvoudigen, openingstijden, visuele stijl & motion-taal — Elst Shoe Site

Project: goedkopeschoenen.com
Lovable project-id: `86ee57a7-1bbb-42ca-8d89-9042e8df4786`

Vervolg op eerdere documenten (`footer-task.md`, `accounts-task.md`, `homepage-herontwerp-task.md`, `homepage-modernisering-header-voorraad-task.md`, `conversie-ui-extra-task.md`, `bestelknop-bundels-cadeaubon-task.md`, `maatadvies-optimalisatie-task.md`). Dit document bundelt de vereenvoudiging van header/mega-menu, de openingstijden in de footer, en een overkoepelende visuele stijl- en animatie-taal voor de hele site.

---

## 1. Header vereenvoudigen (huidige situatie voelt druk/vol)

- **Zoekveld**: niet langer permanent volledig open/breed in de header. Terugbrengen naar alleen een zoek-icoon, dat pas uitklapt naar een volledig invoerveld (met live suggesties, zie eerdere documenten) zodra erop geklikt wordt. Dit maakt meteen veel ruimte vrij in de header.
- **Winkelwagen-balk**: de huidige volle, sterk verzadigde oranje achtergrond concurreert visueel met "Sale" en primaire knoppen. Balk rustiger/lichter maken (bv. subtiele outline of lichtere achtergrondkleur) zodat volle oranje verzadiging gereserveerd blijft voor de belangrijkste acties (Shop nu, Bestel nu). De balk zelf blijft wel permanent zichtbaar zodra er items in de winkelwagen zitten (zoals vastgelegd in `bestelknop-bundels-cadeaubon-task.md`, sectie 2) — alleen de visuele zwaarte wordt rustiger.
- **Algemeen**: meer ademruimte tussen logo, navigatie-items en iconen-groep rechts, zodat niet alles even zwaar oogt op één rij.

## 2. Mega-menu (categorie-dropdown) vereenvoudigen

Huidige situatie combineert te veel elementen tegelijk (categorielijst + "nieuw binnen"-grid + losse tekstlinks + los uitgelicht beeld). Nieuwe opzet:

- **Links:** simpele categorielijst + **één** duidelijke knop ("Bekijk alle [categorie] →") die de twee huidige losse tekstlinks ("Alles in...", "Bekijk de sale") vervangt.
- **Rechts:** kies **één** hoofdfocus — óf het "nieuw binnen"-productrijtje, óf het uitgelichte beeld — niet beide tegelijk naast elkaar.
- Meer witruimte tussen de onderdelen, minder verschillende "soorten" content tegelijk zichtbaar.

## 3. Footer — openingstijden toevoegen

- Openingstijden van de klantenservice toevoegen aan de footer (bij de "Klantenservice"-kolom uit `footer-task.md`), zodat klanten direct zien wanneer er contact opgenomen kan worden.

---

## 4. Visuele stijl & motion-taal (overkoepelend)

### Micro-animaties bij interactie

- Hartje (favorieten): zachte pulse/vul-animatie bij klikken, niet instant van outline naar gevuld.
- Knoppen: zachte "ripple" of lichte schaalvergroting bij klikken (niet alleen bij hover).
- Sale-producten: prijs die bij laden van de pagina kort een subtiel badge-/aandacht-effect krijgt.

### Pagina-overgangen

- Zachte fade/cross-fade tussen paginawissels (bv. categorie → productpagina) in plaats van harde witte flits.
- Skeleton-loaders met subtiele shimmer-animatie tijdens laden (zie ook `conversie-ui-extra-task.md`).

### Scroll-gebonden effecten

- Licht parallax-effect in de hero (productfoto beweegt iets langzamer dan tekst tijdens scrollen).
- Dunne scroll-voortgangsbalk bovenin de pagina, in de accentkleur.
- Scroll-triggered reveals voor secties (al vastgelegd in `homepage-modernisering-header-voorraad-task.md`, hier bevestigd als onderdeel van de bredere motion-taal).

### Cursor-gebonden interactie (desktop)

- Lichte "magnetische" cursor-volg-animatie op knoppen in productkaarten (knop beweegt mee met de muis).
- Optioneel: custom cursor die verandert boven interactieve elementen (bv. klein "bekijk"-label naast de cursor op een productfoto).

### Notificatie/feedback-animaties

- Bij "toegevoegd aan winkelwagen": klein vliegend mini-icoon van het product dat naar het winkelwagen-icoon beweegt.
- Bij succesvolle nieuwsbrief-inschrijving of geplaatste review: subtiele bevestigingsanimatie (bv. checkmark).

### Kleur-gebonden effecten

- Knoppen die bij hover niet alleen donkerder worden, maar ook een subtiel gloed-/schaduweffect in de accentkleur krijgen.

### Typografie-animatie

- Hero-prijs ("€8,99") die bij laden van de pagina licht intelt of met een scale-in verschijnt, i.p.v. statisch direct zichtbaar te zijn.

### Reviews (herbevestiging uit eerder document)

- Reviews faden/schuiven één voor één in bij scrollen (staggered reveal), sterren die vloeiend vullen, lichte hover-vergroting op reviewfoto's (zie `bestelknop-bundels-cadeaubon-task.md`, sectie 7).

---

## Relatie met andere documenten

Dit document is een overkoepelende motion-taal/visuele-stijl-laag die over de hele site heen toegepast wordt, bovenop de structuur/features die in de eerdere documenten zijn vastgelegd:

- `footer-task.md`
- `accounts-task.md`
- `homepage-herontwerp-task.md`
- `homepage-modernisering-header-voorraad-task.md`
- `conversie-ui-extra-task.md`
- `bestelknop-bundels-cadeaubon-task.md`
- `maatadvies-optimalisatie-task.md`

Niets uit dit document is al gebouwd — dit zijn vastgelegde requirements, te bouwen zodra akkoord.
