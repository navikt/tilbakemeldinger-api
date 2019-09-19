const fetch = require("node-fetch");
/*
  Set headers for proxy requests
 */

const getStsToken = context => async (req, res, next) => {
  if (req.originalUrl.includes(context)) {
    const {
      TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_USERNAME,
      TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_PASSWORD
    } = process.env;

    const STS_BASIC_AUTH = Buffer.from(
      `${process.env.SRVTILBAKEMELDINGER_API_USERNAME}:${process.env.SRVTILBAKEMELDINGER_API_PASSWORD}`
    ).toString("base64");

    const STS_HEADERS = {
      Authorization: `Basic ${STS_BASIC_AUTH}`,
      "Nav-Consumer-Id": "tilbakemeldinger-api",
      [TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_USERNAME]: TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_PASSWORD
    };

    const STS_OPTIONS = {
      headers: STS_HEADERS
    };

    const STS_URL = `${process.env.SECURITY_TOKEN_SERVICE_TOKEN_URL}?grant_type=client_credentials&scope=openid`;
    await fetch(STS_URL, STS_OPTIONS)
      .then(stsRes => stsRes.json())
      .then(stsRes => {
        req.access_token = stsRes.access_token;
        next();
      })
      .catch(error => {
        console.error(error);
        res.sendStatus(500);
      });
  } else {
    next();
  }
};

module.exports = { getStsToken };
