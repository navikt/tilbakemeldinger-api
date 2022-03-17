// Load environment
require("console-stamp")(console, "[HH:MM:ss.l]");
require("dotenv").config();

// Imports
const { createProxyMiddleware } = require("http-proxy-middleware");
const cookies = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const decodeJWT = require("jwt-decode");
const { setMottakProxyHeaders } = require("./headers");
const { getStsToken } = require("./ststoken");

// Settings
const port = 8080;
const app = express();

if (process.env.ENV === "dev") {
  app.use(
    cors({
      origin: ["https://person.dev.nav.no", "https://www.dev.nav.no"],
      credentials: true,
    })
  );
}

// Nais
app.use(cookies());
app.get(`/internal/isAlive`, (req, res) => res.sendStatus(200));
app.get(`/internal/isReady`, (req, res) => res.sendStatus(200));

// Proxied requests
app.use(
  createProxyMiddleware(`/enheter`, {
    target: process.env.ENHETERRS_URL,
    pathRewrite: { [`^/enheter`]: "" },
    changeOrigin: true,
  })
);

app.use(
  getStsToken(`/mottak`),
  createProxyMiddleware(`/mottak`, {
    target: process.env.TILBAKEMELDINGSMOTTAK_URL,
    pathRewrite: { [`^/mottak`]: "" },
    onProxyReq: setMottakProxyHeaders,
    changeOrigin: true,
  })
);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
