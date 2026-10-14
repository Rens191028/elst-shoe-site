# Taak: Hero-carrousel met Sale-producten & aanvullende visuele details — Elst Shoe Site

Project: goedkopeschoenen.com
Lovable project-id: `86ee57a7-1bbb-42ca-8d89-9042e8df4786`

Vervolg op eerdere documenten (o.a. `homepage-modernisering-header-voorraad-task.md` sectie 1 "Hero — 3D-product beter benutten", `visuele-stijl-animaties-header-task.md`, `sale-cadeaubon-checkout-content-task.md`). Dit document werkt de hero verder uit tot een klikbare carrousel van echte Sale-producten, en voegt een reeks losse visuele detailverbeteringen toe.

---

## 1. Hero — optimaliseren en uitbreiden naar meerdere Sale-producten

**Belangrijk:** het huidige "3D"-draai-effect is een fotoreeks (meerdere hoeken van hetzelfde product, doorbladerd door te slepen), geen echt 3D-model. Dit document optimaliseert die bestaande aanpak — geen zwaar 3D-model-systeem.

**Optimaliseren van de bestaande draai-interactie:**
- Vloeiendere overgang tussen hoeken (meer tussenstappen, minder schokkerig).
- Preloading: alle hoeken van het actieve product alvast op de achtergrond laden zodra de hero in beeld komt, zodat draaien direct soepel aanvoelt.
- Inertia/momentum: bij snel slepen en loslaten draait het product nog even door en remt natuurlijk af, in plaats van hard te stoppen.
- Optioneel: lichte zoom-mogelijkheid tijdens het draaien.

**Uitbreiden naar een hero-carrousel met meerdere Sale-producten:**
- In plaats van één vast hero-product: een carrousel/wissel tussen **3-5 echte, actuele Sale-producten** (met hun daadwerkelijke kortingsprijs/percentage).
- Elk product in de carrousel heeft zijn eigen draai-fotoreeks (zoals hierboven geoptimaliseerd) en behoudt de bestaande subtiele animaties/interactie.
- **Klikbaarheid**: elk hero-product is volledig doorklikbaar naar de bijbehorende productpagina — niet alleen decoratief.
- Prijs + kortingspercentage per product duidelijk zichtbaar, net als nu bij het huidige ene hero-product.
- Navigatie tussen de producten via dots/pijltjes, en/of automatisch wisselen na enkele seconden (handmatig slepen om te draaien neemt de automatische wissel tijdelijk over/pauzeert deze).

---

## 2. Aanvullende visuele details (over de hele site)

**Vormtaal tussen secties**
- Zachte, golvende of schuine SVG-overgangen tussen secties (bv. hero → categorieën → FAQ) i.p.v. harde rechte randen.

**Glasmorfisme op zwevende elementen**
- Winkelwagen-balk, chat-widget en eventuele pop-ups een lichte "frosted glass"-stijl geven (subtiele transparantie + blur) i.p.v. een vlakke ondoorzichtige achtergrond.

**Zachte bewegende achtergrond in de hero**
- Subtiele, langzaam bewegende gradient-"mesh" (vage kleurvlekken die traag bewegen) achter de hero-producten, i.p.v. een vlakke grijze achtergrond.

**Eigen iconenset**
- USP-iconen (verzending/retour/betalen) en categorie-iconen laten tekenen in een eigen, consistente lijnstijl passend bij het logo, i.p.v. generieke library-iconen.

**Label/badge-systeem uniformeren**
- "Nieuw", kortingspercentages, "Bijna uitverkocht" — één consistent badge-ontwerp (zelfde hoekvorm, zelfde lettergrootte-verhouding) voor alle labels op productfoto's.

**Merk-eigen laad-animatie**
- Gemerkte laad-animatie (bv. subtiel lopend/stuiterend schoen-icoon) i.p.v. een generieke spinner tijdens het laden van pagina's.

**Bevestigingspagina na bestelling**
- Checkmark-animatie met lichte confetti/sprankel-effect op de orderbevestigingspagina (aanvulling op de eerder vastgelegde verbetering van die pagina in `sale-cadeaubon-checkout-content-task.md`, sectie 3).

**Custom scrollbar**
- Dunne, subtiele scrollbar in de huisstijlkleur i.p.v. de standaard browser-scrollbar.

**404-pagina**
- Op-merk vormgegeven foutpagina (met luchtige tekst en knop terug naar de homepage) i.p.v. een kale standaardpagina.

---

## Relatie met andere documenten
- `homepage-modernisering-header-voorraad-task.md` — oorspronkelijke hero-3D-vermelding (sectie 1), hier verder uitgewerkt tot carrousel
- `visuele-stijl-animaties-header-task.md` — algemene motion-taal, hier aangevuld met nieuwe visuele details
- `sale-cadeaubon-checkout-content-task.md` — orderbevestigingspagina, hier aangevuld met checkmark/confetti-animatie
- `homepage-herontwerp-task.md` — sale-urgentie en algemene stijl-richting

Niets uit dit document is al gebouwd — dit zijn vastgelegde requirements, te bouwen zodra akkoord.
