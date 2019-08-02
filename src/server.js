const proxy = require("http-proxy-middleware");
const cookies = require("cookie-parser");
const express = require("express");
const decodeJWT = require("jwt-decode");
const app = express();
const port = 8080;
const BASE_URL = "/person/tilbakemeldinger-api";

require("dotenv").config({
  path: "/var/run/secrets/nais.io/vault/environment.env"
});

const {
  TILBAKEMELDINGSMOTTAK_URL,
  TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_USERNAME,
  TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_PASSWORD
} = process.env;

app.use(cookies());
app.get(`${BASE_URL}/internal/isAlive`, (req, res) => res.sendStatus(200));
app.get(`${BASE_URL}/internal/isReady`, (req, res) => res.sendStatus(200));

app.get(`${BASE_URL}/fodselsnr`, (req, res) =>
  res.send({ fodselsnr: decodeJWT(req.cookies["selvbetjening-idtoken"]).sub })
);

const onProxyReq = (proxyReq, req, res) => {
  proxyReq.setHeader(
    TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_PASSWORD
  );

  const authToken = req.cookies["selvbetjening-idtoken"];

  if (authCookie) {
    setHeader("Authorization", `Bearer ${authToken}`);
  }

  Object.keys(req.headers).forEach(key => {
    console.log(`Setting header ${key}=${req.headers[key]}`);
    proxyReq.setHeader(key, req.headers[key]);
  });
};

app.use(
  proxy(BASE_URL, {
    target: TILBAKEMELDINGSMOTTAK_URL,
    pathRewrite: { "^/person/tilbakemeldinger-api": "" },
    onProxyReq: onProxyReq,
    changeOrigin: true
  })
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
