/*
  Set headers for proxy requests
 */

const setMottakProxyHeaders = (proxyReq, req, res) => {
    console.log("Request: " + req.host)
    console.log("Host: " + req.url)
    let userToken = req.headers.authorization;

    if (userToken && userToken.startsWith("Bearer ")) {
        userToken = userToken.substring(7, userToken.length)
    }

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

    Object.keys(req.headers).forEach(key => {
        proxyReq.setHeader(key, req.headers[key]);
    });

    console.log("Headers satt ok")
};

module.exports = {
    setMottakProxyHeaders
};
