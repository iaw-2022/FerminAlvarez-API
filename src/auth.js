var { expressjwt: jwt } = require("express-jwt");
var jwks = require('jwks-rsa');
const config = require('./config');
const axios = require('axios');

var checkAuth = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: config.AUTH0_JWKSURI
    }),
    audience: config.AUTH0_AUDIENCE,
    issuer: config.AUTH0_ISSUER,
    algorithms: [config.AUTH0_ALGORITHM]
});

getUserInfoFromToken = async (req) => {
    const token = req.headers.authorization.split(' ')[1];

    const header = {
        headers: {
            authorization: `Bearer ${token}`,
        },
    };
    const userinfo = await axios.get(config.AUTH0_ISSUER+"userinfo", header);

    return userinfo.data;
}

module.exports = {
    checkAuth,
    getUserInfoFromToken
}