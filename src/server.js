// Load environment
require("console-stamp")(console, "[HH:MM:ss.l]");
require("dotenv").config();

// Imports
const { createProxyMiddleware } = require("http-proxy-middleware");
const cookies = require("cookie-parser");
const express = require("express");
const decodeJWT = require("jwt-decode");
const BASE_URL = "/person/tilbakemeldinger-api";
const { setEnheterProxyHeaders, setMottakProxyHeaders } = require("./headers");
const { getStsToken } = require("./ststoken");

// Settings
const port = 8080;
const app = express();

// Nais
app.use(cookies());
app.get(`${BASE_URL}/internal/isAlive`, (req, res) => res.sendStatus(200));
app.get(`${BASE_URL}/internal/isReady`, (req, res) => res.sendStatus(200));
app.get(`${BASE_URL}/fodselsnr`, (req, res) =>
  res.send({ fodselsnr: decodeJWT(req.cookies["selvbetjening-idtoken"]).sub })
);

if (process.env.ENV === 'dev') {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://person.dev.nav.no');
        next();
    })
}

// Proxied requests
app.use(
  createProxyMiddleware(`${BASE_URL}/enheter`, {
    target: process.env.ENHETERRS_URL,
    pathRewrite: { [`^${BASE_URL}/enheter`]: "" },
    onProxyReq: setEnheterProxyHeaders,
    changeOrigin: true,
  })
);

app.use(
  getStsToken(`${BASE_URL}/mottak`),
  createProxyMiddleware(`${BASE_URL}/mottak`, {
    target: process.env.TILBAKEMELDINGSMOTTAK_URL,
    pathRewrite: { [`^${BASE_URL}/mottak`]: "" },
    onProxyReq: setMottakProxyHeaders,
    changeOrigin: true,
  })
);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
