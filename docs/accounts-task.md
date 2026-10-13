# Taak: Account-omgeving — Elst Shoe Site

Project: goedkopeschoenen.com
Lovable project-id: `86ee57a7-1bbb-42ca-8d89-9042e8df4786`
Database: Supabase, reeds geactiveerd

## Doel

Gebruikers kunnen een account aanmaken, inloggen, hun favorieten opslaan, bestelgeschiedenis inzien en hun gegevens beheren.

## 1. Authenticatie

- E-mail + wachtwoord via Supabase Auth (geen social login)
- **Aparte pagina's** (geen modal): `/inloggen` en `/registreren`
- Registreren: e-mail + wachtwoord (+ naam)
- "Wachtwoord vergeten"-flow (reset via e-mail)
- **Geen verplichte e-mailverificatie** — gebruiker kan direct inloggen na registreren

## 2. Header

- Account-icoon naast zoek/wishlist/cart
- Niet ingelogd: outline-icoon → klik gaat naar `/inloggen`
- Ingelogd: gevuld icoon/avatar → klik gaat naar accountoverzicht (of dropdown met snelkoppelingen)

## 3. Favorieten-flow

- Klik op hartje (productkaart of productpagina) zonder ingelogd te zijn → doorsturen naar `/inloggen`, met duidelijke boodschap ("Log in om favorieten op te slaan")
- Na inloggen: item wordt opgeslagen als favoriet
- Favorieten-tabel in Supabase: gekoppeld aan `user_id` + `product_id`
- Hartje-status (gevuld/leeg) wordt bij laden gecontroleerd tegen de favorieten van de ingelogde gebruiker

## 4. Accountomgeving (na inloggen)

Pagina met minimaal:

- **Mijn bestellingen** — overzicht van geplaatste bestellingen (status, datum, totaalbedrag, items)
- **Mijn gegevens** — naam, e-mail, adresgegevens, wachtwoord wijzigen
- **Mijn favorieten** — grid van opgeslagen producten, met optie om te verwijderen
- Uitloggen

## Technische notities

- Supabase Auth voor login/registratie/sessiebeheer
- Supabase-tabellen nodig voor: favorieten, bestellingen (indien nog niet aanwezig), gebruikersgegevens/profiel
- Geen guest-favorieten (zie eerdere afspraak) — favorieten bestaan alleen gekoppeld aan een account
