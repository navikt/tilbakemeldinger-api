const proxy = require("express-http-proxy");
const express = require("express");
const app = express();
const port = 8080;

require("dotenv").config({
  path: "/var/run/secrets/nais.io/vault/environment.env"
});

const {
  TILBAKEMELDINGSMOTTAK_URL,
  TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_USERNAME,
  TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_PASSWORD
} = process.env;

console.log(process.env);

app.get("/person/tilbakemeldinger-api/internal/isAlive", (req, res) =>
  res.sendStatus(200)
);
app.get("/person/tilbakemeldinger-api/internal/isReady", (req, res) =>
  res.sendStatus(200)
);

app.use(
  "/person/tilbakemeldinger-api/",
  proxy(TILBAKEMELDINGSMOTTAK_URL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers[
        TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_USERNAME
      ] = TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_PASSWORD;
      return proxyReqOpts;
    }
  })
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
