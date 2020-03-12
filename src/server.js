const proxy = require("http-proxy-middleware");
const cookies = require("cookie-parser");
const express = require("express");
const decodeJWT = require("jwt-decode");
const BASE_URL = "/person/pb-kontakt-oss-api";
const VAULT_PATH = "/var/run/secrets/nais.io/vault/environment.env";
const dotenv = require("dotenv").config({ path: VAULT_PATH });
const { setEnheterProxyHeaders, setMottakProxyHeaders } = require("./headers");
const { getStsToken } = require("./ststoken");

const app = express();
const port = 8080;

app.use(cookies());
app.get(`${BASE_URL}/internal/isAlive`, (req, res) => res.sendStatus(200));
app.get(`${BASE_URL}/internal/isReady`, (req, res) => res.sendStatus(200));
app.get(`${BASE_URL}/fodselsnr`, (req, res) =>
  res.send({ fodselsnr: decodeJWT(req.cookies["selvbetjening-idtoken"]).sub })
);

app.use(
  proxy(`${BASE_URL}/enheter`, {
    target: process.env.ENHETERRS_URL,
    pathRewrite: { [`^${BASE_URL}/enheter`]: "" },
    onProxyReq: setEnheterProxyHeaders,
    changeOrigin: true
  })
);

app.use(
  getStsToken(`${BASE_URL}/mottak`),
  proxy(`${BASE_URL}/mottak`, {
    target: process.env.TILBAKEMELDINGSMOTTAK_URL,
    pathRewrite: { [`^${BASE_URL}/mottak`]: "" },
    onProxyReq: setMottakProxyHeaders,
    changeOrigin: true
  })
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
