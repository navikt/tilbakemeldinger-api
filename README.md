# Tilbakemeldinger API

![Deploy-to-prod](https://github.com/navikt/tilbakemeldinger-api/workflows/Deploy-to-prod/badge.svg) | ![Deploy-to-dev](https://github.com/navikt/tilbakemeldinger-api/workflows/Deploy-to-dev/badge.svg)

FSS Proxy for tilbakemeldingsmottak og enhetsinformasjon.

# Komme i gang

Hent repoet fra github

```
git clone https://github.com/navikt/tilbakemeldinger-api.git
```

Kopier .env.sample til .env og skriv inn reelle miljøvariabler:

```
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

## Deployering

- Dev: Tag på formatet `vX.X.X-dev`.
- Prod: Tag på formatet `vX.X.X-prod`.

Eksempel:

```
git tag v1.0.0-test
git push && git push --tags
```

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/personbruker

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-personbruker.
