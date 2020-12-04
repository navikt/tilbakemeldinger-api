# Kontakt oss API

![Deploy-to-prod](https://github.com/navikt/pb-kontakt-oss-api/workflows/Deploy-to-prod/badge.svg) <br>
![Deploy-to-q0](https://github.com/navikt/pb-kontakt-oss-api/workflows/Deploy-to-q0/badge.svg)
![Deploy-to-q1](https://github.com/navikt/pb-kontakt-oss-api/workflows/Deploy-to-q1/badge.svg)
![Deploy-to-q2](https://github.com/navikt/pb-kontakt-oss-api/workflows/Deploy-to-q2/badge.svg)
![Deploy-to-q6](https://github.com/navikt/pb-kontakt-oss-api/workflows/Deploy-to-q6/badge.svg)

- Backend for Sanity.io spørringer for pb-kontakt-oss.
- FSS Proxy for tilbakemeldingsmottak og enhetsinformasjon.

# Komme i gang

Hent repoet fra github

```
git clone https://github.com/navikt/pb-kontakt-oss-api.git
```

Kopier .env.sample til .env og skriv inn reelle miljøvariabler:

```
SANITY_TOKEN // Skaffes fra sanity.io, spør om tilgang
TILBAKEMELDINGSMOTTAK_URL // URL til API-endepunktet for tilbakemeldingsmottak
ENHETERRS_URL // URL til API-endepunktet for enhetsinformasjon
```

Installer nødvendige avhengigheter:

```
npm install
```

Start applikasjonen lokalt:

```
npm run start
```

---

# Henvendelser

Enten:
Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

Eller:
Spørsmål knyttet til koden eller prosjektet kan stilles til teamalias@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #teamkanal.
