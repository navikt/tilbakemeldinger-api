# Tilbakemeldinger API

![Deploy til prod](https://github.com/navikt/tilbakemeldinger-api/workflows/Deploy-to-prod/badge.svg) <br>
![Deploy til dev](https://github.com/navikt/tilbakemeldinger-api/workflows/Deploy-to-dev/badge.svg) <br>

FSS Proxy for tilbakemeldingsmottak og enhetsinformasjon.

# Komme i gang

Hent repoet fra github

```
git clone https://github.com/navikt/tilbakemeldinger-api.git
```

Kopier .env.sample til .env og skriv inn reelle miljøvariabler:

```
TILBAKEMELDINGSMOTTAK_URL // URL til API-endepunktet for tilbakemeldingsmottak
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

## Deploy til dev-miljø

[Deploy-to-dev](https://github.com/navikt/nav-enonicxp-frontend/actions/workflows/deploy.dev.yml) -> Run workflow -> Velg branch -> Run workflow

## Prodsetting

Publiser en ny release på master for å starte deploy til prod

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/personbruker

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-personbruker.
