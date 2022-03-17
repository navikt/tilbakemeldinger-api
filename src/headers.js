/*
  Set headers for proxy requests
 */

const setMottakProxyHeaders = (proxyReq, req, res) => {
    let userToken = req.headers["Authorization"];
    if (userToken && userToken.startsWith("Bearer ")) {
        userToken = userToken.substring(7, userToken.length)
    }

    console.log("Mottak proxy truffet")

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
};

module.exports = {
    setMottakProxyHeaders
};
