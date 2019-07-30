const proxy = require("express-http-proxy");
const express = require("express");
const app = express();
const port = 8080;

require("dotenv").config({
  path: "/var/run/secrets/nais.io/vault/environment.env"
});

app.use(
  "/person/tilbakemeldinger-api/proxy",
  proxy("https://api-gw-q0.oera.no/tilbakemeldingsmottak")
);

app.get("/person/tilbakemeldinger-api/internal/isAlive", (req, res) =>
  res.sendStatus(200)
);
app.get("/person/tilbakemeldinger-api/internal/isReady", (req, res) =>
  res.sendStatus(200)
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
