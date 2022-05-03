const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  booksController = require('../controllers/books.controller')

router.get('/books', booksController.getBooks);
//router.get('/books/:ISBN', booksController.getBookByISBN);

module.exports = router;