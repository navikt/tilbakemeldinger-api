/*
  Set headers for proxy requests
 */

const setEnheterProxyHeaders = (proxyReq, req, res) => {
    proxyReq.setHeader(
        process.env.TILBAKEMELDINGER_API_ENHETERRS_APIKEY_USERNAME,
        process.env.TILBAKEMELDINGER_API_ENHETERRS_APIKEY_PASSWORD
    );
};

const {
    ENHETERRS_URL,
    TILBAKEMELDINGER_API_ENHETERRS_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_ENHETERRS_APIKEY_PASSWORD,

    TILBAKEMELDINGSMOTTAK_URL,
    TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_PASSWORD,

    SECURITY_TOKEN_SERVICE_TOKEN_URL,
    TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_PASSWORD,

    SRVTILBAKEMELDINGER_API_USERNAME,
    SRVTILBAKEMELDINGER_API_PASSWORD
} = process.env;

console.log([ENHETERRS_URL,
    TILBAKEMELDINGER_API_ENHETERRS_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_ENHETERRS_APIKEY_PASSWORD,

    TILBAKEMELDINGSMOTTAK_URL,
    TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_TILBAKEMELDINGSMOTTAK_APIKEY_PASSWORD,

    SECURITY_TOKEN_SERVICE_TOKEN_URL,
    TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_USERNAME,
    TILBAKEMELDINGER_API_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_PASSWORD,

    SRVTILBAKEMELDINGER_API_USERNAME,
    SRVTILBAKEMELDINGER_API_PASSWORD].map(item => console.log(`env var: ${item.substr(0, 5)}`)));

const setMottakProxyHeaders = (proxyReq, req, res) => {
    const userToken = req.cookies["selvbetjening-idtoken"];
    const stsToken = req.access_token;
    const authTokens = [];

    if (stsToken) {
        authTokens.push(`Bearer ${stsToken}`);
    }

    if (userToken) {
        authTokens.push(`Bearer ${userToken}`);
    }

    if (authTokens.length > 0) {
        proxyReq.setHeader("Authorization", authTokens.join());
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
