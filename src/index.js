const express = require('express');

const app = express();
const cors = require('cors');
const config = require('./config');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swagger_doc');
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors())
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