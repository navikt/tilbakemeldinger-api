/*
  Set headers for proxy requests
 */

const setMottakProxyHeaders = (proxyReq, req, res) => {
    console.log("Host: " + req.host)
    console.log("Url: " + req.url)
    let userToken = req.headers.authorization;

    if (userToken) {
        console.log("Token i setMottakProxyHeaders: " + userToken.substring(0, 30))
    } else {
        console.log("Token i setMottakProxyHeaders ikke funnet")
    }

    if (userToken && userToken.startsWith("Bearer ")) {
        userToken = userToken.substring(7, userToken.length)
    }

    const stsToken = req.access_token;
    const authTokens = [];

    if (stsToken) {
        authTokens.push(`Bearer ${stsToken}`);
        console.log("Pushed sts token: " + stsToken.substring(0, 10))
    }

    if (userToken) {
        authTokens.push(`Bearer ${userToken}`);
        console.log("Pushed user token: " + userToken.substring(0, 10))
    }

    if (authTokens.length > 0) {
        proxyReq.setHeader("Authorization", authTokens.join());
    }

    Object.keys(req.headers).forEach(key => {
        proxyReq.setHeader(key, req.headers[key]);
    });

    console.log("Headers satt ok")
    console.log(authTokens.length)
};

module.exports = {
    setMottakProxyHeaders
};
