const express = require('express');

const app = express();
const config = require('./config');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swagger_doc');
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const { auth, requiresAuth } = require('express-openid-connect');

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);


// Middlewares
app.use(express.json());

// Routes
app.use(require('./routes/authors.router'));
app.use(require('./routes/books.router'));
app.use(require('./routes/bookshops.router'));
app.use(require('./routes/categories.router'));
app.use(require('./routes/suscribers.router'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(config.PORT);
console.log('Server on port', config.PORT);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

app.get('/profile', requiresAuth() ,(req, res) => {
    res.send(JSON.stringify(req.oidc.user))
});