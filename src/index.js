const express = require('express');

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use(require('./routes/authors.router'));
app.use(require('./routes/books.router'));
app.use(require('./routes/bookshops.router'));
app.use(require('./routes/categories.router'));
app.use(require('./routes/suscribers.router'));

app.listen(3000);
console.log('Server on port', 3000);