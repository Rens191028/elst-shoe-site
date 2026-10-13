# Elst Shoe Site — Requirements & Bouwdocumentatie
Project: goedkopeschoenen.com (Lovable project-id: `86ee57a7-1bbb-42ca-8d89-9042e8df4786`)
Workspace: Rens's Lovable (`bbb9fb9733023df84337`)
Database: Supabase, reeds geactiveerd (`enable_database` uitgevoerd op 2026-10-13)

Dit document is bedoeld als werkdocumentatie voor Claude Code om de wijzigingen stap voor stap te implementeren. Niet alles hoeft in één keer gebouwd te worden — zie de voorgestelde volgorde onderaan.

---

## 1. Bugfixes (hoogste prioriteit)
- **Kapotte afbeelding** in de "Sale" categorie-tegel op de homepage (toont nu een broken-image icoon) — vervangen door een echte sale-afbeelding.
- **Inconsistente verzendbelofte**: hero toont "Vandaag nog verzonden" naast "Gratis verzending vanaf €65" en "vandaag besteld, vandaag verzonden" — teksten op elkaar afstemmen zodat de claim overal hetzelfde is.
- **Kiyoh-widget**: 9,3 / 6.531 reviews bovenaan moet een echte, actuele, klikbare Kiyoh-integratie zijn (linkt naar het echte profiel) — geen statische/nep tekst.

## 2. Footer — volledige herstructurering
Footer is nu rommelig/ongestructureerd. Nieuwe opzet, van boven naar beneden:

1. **Nieuwsbrief-sectie** (los, visueel uitgelicht, boven de kolommen)
   - E-mailveld + submit-knop, modern design (bv. gradient- of kaart-achtergrond, subtiele hover/submit-animatie)
   - Incentive: na succesvolle inschrijving een kortingscode tonen (bv. "Bedankt! Jouw code: WELKOM10"), netjes verwerkt (duidelijke bevestigingsstate, niet alleen een alert)
2. **Kolommenrij** (4 kolommen):
   - **Kolom 1:** Logo + korte pay-off + social media iconen
   - **Kolom 2 "Shop":** Schoenen, Tassen, Accessoires, Sale
   - **Kolom 3 "Klantenservice":** Retourbeleid (30 dagen), Verzending, FAQ, Contact
   - **Kolom 4 "Over ons":** Over goedkopeschoenen.com, Kiyoh-reviewbadge
3. **Onderbalk:** betaalicoons (iDEAL, Klarna, creditcard) + copyright-tekst

## 3. Homepage — aanvullingen
- **Instagram/UGC-strook** toevoegen, modern vormgegeven — plaatsen **bij de Sale-sectie** (niet los ergens anders).
- **USP-balk herhalen** vlak **boven de footer** (gratis verzending / Klarna / 30 dagen retour) — nu staat dit alleen klein onder de hero.
- (Eerder genoemd, nog open om te bevestigen: bestsellers/nieuw-binnen sectie, urgency-element bij Sale — nog niet expliciet bevestigd door klant, dus pas oppakken na akkoord.)

## 4. Productpagina — aanvullingen
- **Voorraadstatus per maat** tonen (bv. "nog 2 op voorraad" / "op=op" per maat-optie).
- **Reviews per product** (niet alleen de algemene Kiyoh-score bovenaan de site).
- **Zoomfunctie** op productfoto's.
- ~~3D-weergave / draai-effect per product~~ — **is al aanwezig, niet aankomen.**
- (Eerder genoemd, nog niet bevestigd: maattabel/maatadvies, "vaak samen gekocht"-sectie — later bespreken.)

## 5. Accounts & authenticatie
- **E-mail + wachtwoord** login/registratie via Supabase auth (geen social login).
- **Account-icoon** in de header, naast zoek/wishlist/cart.
- Binnen het account:
  - Bestelgeschiedenis
  - Opgeslagen gegevens
  - Favorieten

## 6. Favorieten-flow (gewijzigd gedrag)
- **Geen guest-wishlist.** Favorieten werken alleen gekoppeld aan een account.
- Klikt een bezoeker zonder account op het hartje → direct doorverwijzen naar het login/registratie-scherm.
- Na inloggen/registreren wordt het item opgeslagen als favoriet.

## 7. Niet (meer) in scope
- Volledige 360°-productweergave — **vervallen**, al vervangen door bestaand 3D-effect per product (zie sectie 4).
- Guest-favorieten samenvoegen bij account-aanmaak — **vervallen**, favorieten bestaan alleen nog met account.

---

## Voorgestelde bouwvolgorde
1. Bugfixes (sectie 1)
2. Footer-herstructurering + nieuwsbrief (sectie 2)
3. Homepage-aanvullingen: Instagram-strook bij Sale, USP-balk boven footer (sectie 3)
4. Productpagina-aanvullingen: voorraadstatus per maat, reviews per product, zoomfunctie (sectie 4)
5. Supabase-auth opzetten + account-icoon + accountpagina's (sectie 5)
6. Favorieten-flow ombouwen naar account-only (sectie 6)

## Technische notities
- Database (Supabase) staat al aan voor dit project — klaar voor auth-tabellen, favorieten, bestellingen.
- Geen social login nodig, alleen e-mail/wachtwoord via Supabase Auth.
- 3D/draai-effect op producten is reeds geïmplementeerd — niet opnieuw bouwen, alleen behouden/niet breken bij andere wijzigingen.
