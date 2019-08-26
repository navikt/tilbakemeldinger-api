const fetch = require("node-fetch");
const base64 = require("base-64");
/*
  Set headers for proxy requests
 */

const setEnheterProxyHeaders = (proxyReq, req, res) => {
  proxyReq.setHeader(
    process.env.TILBAKEMELDINGER_API_ENHETERRS_APIKEY_USERNAME,
    process.env.TILBAKEMELDINGER_API_ENHETERRS_APIKEY_PASSWORD
  );
};

const setMottakProxyHeaders = async (proxyReq, req, res) => {
  const {
    TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_PASSWORD
  } = process.env;

  // Fetch service user token
  const STS_BASIC_AUTH = base64.encode(
    `${process.env.SRVTILBAKEMELDINGER_API_USERNAME}:${process.env.SRVTILBAKEMELDINGER_API_PASSWORD}`
  );

  const STS_HEADERS = {
    Authentication: `Basic ${STS_BASIC_AUTH}`,
    [TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_USERNAME]: TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_PASSWORD
  };

  const STS_OPTIONS = {
    headers: STS_HEADERS
  };

  await fetch(process.env.SECURITY_TOKEN_SERVICE_TOKEN_URL, STS_OPTIONS)
    .then(stsRes => stsRes.json())
    .then(stsRes => {
      // Success, add service user token
      console.log(stsRes);
      proxyReq.setHeader("Authorization", `Bearer ${stsRes.token}`);

      // Add user token from cookie
      const authToken = req.cookies["selvbetjening-idtoken"];

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
    })
    .catch(error => {
      console.error(error);
      throw new Error(error);
    });
};

module.exports = {
  setEnheterProxyHeaders,
  setMottakProxyHeaders
};
