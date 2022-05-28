const config = require('./config');
const path = require("path")

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Precios Libros API',
            description: 'API to get book prices in bookshops',
        },
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
            },
        },
    },
    apis: [`${path.join(__dirname, "./routes/*.router.js")}`],
}

module.exports = swaggerOptions