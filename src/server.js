// Load environment
const VAULT_PATH = "/var/run/secrets/nais.io/vault/environment.env";
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? VAULT_PATH : ".env"
});

// Imports
const proxy = require("http-proxy-middleware");
const cookies = require("cookie-parser");
const express = require("express");
const decodeJWT = require("jwt-decode");
const BASE_URL = "/person/pb-kontakt-oss-api";
const { setEnheterProxyHeaders, setMottakProxyHeaders } = require("./headers");
const { getStsToken } = require("./ststoken");
const sanityClient = require("@sanity/client");

// Settings
const port = 8080;
const app = express();
const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false
});

// Nais
app.use(cookies());
app.get(`${BASE_URL}/internal/isAlive`, (req, res) => res.sendStatus(200));
app.get(`${BASE_URL}/internal/isReady`, (req, res) => res.sendStatus(200));
app.get(`${BASE_URL}/fodselsnr`, (req, res) =>
  res.send({ fodselsnr: decodeJWT(req.cookies["selvbetjening-idtoken"]).sub })
);

// API
app.get(`${BASE_URL}/alerts`, (req, res) => {
  const query = '*[_type == "alert"] {...}';
  const params = { minSeats: 2 };

  client
    .fetch(query, params)
    .then(bikes => {
      console.log("Bikes with more than one seat:");
      res.send(bikes);
    })
    .catch(err => res.send(err));
});

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
