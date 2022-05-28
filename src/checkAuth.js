var { expressjwt: jwt } = require("express-jwt");
var jwks = require('jwks-rsa');
const config = require('./config');

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

module.exports = checkAuth