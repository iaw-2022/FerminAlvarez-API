const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  booksController = require('../controllers/books.controller')

router.get('/books', booksController.getBooks);
router.get('/book/:ISBN', booksController.getBookByISBN);
router.get('/books/author/:AuthorName', booksController.getBookByAuthorName);
router.get('/books/category/:Category', booksController.getBookByCategory);
router.get('/book/:ISBN/prices', booksController.getBookPrice);

module.exports = router;