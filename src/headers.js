const fetch = require("node-fetch");
/*
  Set headers for proxy requests
 */

const setEnheterProxyHeaders = (proxyReq, req, res) => {
  proxyReq.setHeader(
    process.env.TILBAKEMELDINGER_API_ENHETERRS_APIKEY_USERNAME,
    process.env.TILBAKEMELDINGER_API_ENHETERRS_APIKEY_PASSWORD
  );
};

const setMottakProxyHeaders = (proxyReq, req, res) => {
  const authToken = req.cookies["selvbetjening-idtoken"];
  const stsToken = req.access_token;

  if (stsToken) {
    proxyReq.setHeader("Authorization", `Bearer ${stsToken}`);
  }

  if (authToken) {
    proxyReq.setHeader("Nav-Selvbetjening-Token", `Bearer ${authToken}`);
  }

  proxyReq.setHeader(
    process.env.TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_USERNAME,
    process.env.TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_PASSWORD
  );

  Object.keys(req.headers).forEach(key => {
    proxyReq.setHeader(key, req.headers[key]);
  });
};

module.exports = {
  setEnheterProxyHeaders,
  setMottakProxyHeaders
};
