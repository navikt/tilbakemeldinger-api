/*
  Set headers for proxy requests
 */

const setMottakProxyHeaders = (proxyReq, req, res) => {
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

    console.log(proxyReq)
};

module.exports = {
    setMottakProxyHeaders
};
