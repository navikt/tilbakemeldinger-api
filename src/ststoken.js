const fetch = require("node-fetch");
/*
  Set headers for proxy requests
 */

const getStsToken = context => async (req, res, next) => {
  console.log("Sts-metode truffet")
  if (req.headers.authorization) {
    console.log("Token i request: " + req.headers.authorization.substring(0, 30))
  } else {
    console.log("Token i request ikke funnet")
  }

  console.log("Username: " + process.env.SRVTILBAKEMELDINGER_API_USERNAME)
  console.log("Password: " + process.env.SRVTILBAKEMELDINGER_API_PASSWORD.substring(0, 4))

  if (req.originalUrl.includes(context)) {
    const STS_BASIC_AUTH = Buffer.from(
      `${process.env.SRVTILBAKEMELDINGER_API_USERNAME}:${process.env.SRVTILBAKEMELDINGER_API_PASSWORD}`
    ).toString("base64");

    const STS_HEADERS = {
      Authorization: `Basic ${STS_BASIC_AUTH}`,
      "Nav-Consumer-Id": "tilbakemeldinger-api",
    };

    const STS_OPTIONS = {
      headers: STS_HEADERS
    };

    const STS_URL = `${process.env.SECURITY_TOKEN_SERVICE_TOKEN_URL}?grant_type=client_credentials&scope=openid`;
    await fetch(STS_URL, STS_OPTIONS)
      .then(stsRes => stsRes.json())
      .then(stsRes => {
        req.access_token = stsRes.access_token;
        if (stsRes.access_token) {
          console.log("Sts token: " + stsRes.access_token.substring(0, 30))
        } else {
          console.log("Sts token ikke funnet")
        }
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
