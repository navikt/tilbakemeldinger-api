// Load environment
const VAULT_PATH = "/var/run/secrets/nais.io/vault/environment.env";
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? VAULT_PATH : ".env"
});

// Imports
const NodeCache = require("node-cache");
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

// Cache setup
const cache = new NodeCache();

// API
app.get(`${BASE_URL}/alerts`, (req, res) => {
  const query = "*[_type == 'alert' && !(_id in path('drafts.**'))] {...}";
  const alerts = cache.get("alerts");
  if (alerts) {
    res.send(alerts);
  } else {
    client
      .fetch(query)
      .then(result => {
        console.log("Setting alerts cache");
        cache.set("alerts", result);
        res.send(result);
      })
      .catch(error => res.send(error));
  }
});

app.get(`${BASE_URL}/faq`, (req, res) => {
  const query = "*[_type == 'faq' && !(_id in path('drafts.**'))] {...}";
  const faq = cache.get("faq");
  if (faq) {
    res.send(faq);
  } else {
    client
      .fetch(query)
      .then(result => {
        console.log("Setting faq cache");
        cache.set("faq", result);
        res.send(result);
      })
      .catch(error => res.send(error));
  }
});

app.get(`${BASE_URL}/channels`, (req, res) => {
  const query = "*[_type == 'channel' && !(_id in path('drafts.**'))] {...}";
  const channels = cache.get("channel");
  if (channels) {
    res.send(channels);
  } else {
    client
      .fetch(query)
      .then(result => {
        console.log("Setting channel cache");
        cache.set("channel", result);
        res.send(result);
      })
      .catch(error => res.send(error));
  }
});

app.get(`${BASE_URL}/clear-cache`, (req, res) => {
  console.log("Clearing cache");
  cache.flushAll();
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
