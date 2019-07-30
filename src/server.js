const proxy = require("http-proxy-middleware");
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

app.get("/person/tilbakemeldinger-api/internal/isAlive", (req, res) =>
  res.sendStatus(200)
);
app.get("/person/tilbakemeldinger-api/internal/isReady", (req, res) =>
  res.sendStatus(200)
);

const onProxyReq = (proxyReq, req, res) => {
  proxyReq.setHeader(
    TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_PASSWORD
  );
};

app.use(
  proxy("/person/tilbakemeldinger-api", {
    target: TILBAKEMELDINGSMOTTAK_URL,
    pathRewrite: { "^/person/tilbakemeldinger-api": "" },
    onProxyReq: onProxyReq,
    changeOrigin: true
  })
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
