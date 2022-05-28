require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    AUTH0_JWKSURI: process.env.AUTH0_JWKSURI,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH0_ISSUER: process.env.AUTH0_ISSUER,
    AUTH0_ALGORITHM: process.env.AUTH0_ALGORITHM,
    ssl: { rejectUnauthorized: false }
}