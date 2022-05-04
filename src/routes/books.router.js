const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  booksController = require('../controllers/books.controller')
const  authorsController = require('../controllers/authors.controller')
const  bookshopsController = require('../controllers/bookshops.controller')

router.get('/books', booksController.getBooks);
router.get('/books/:ISBN', booksController.getBookByISBN);
router.get('/books/author/:AuthorName', booksController.getBookByAuthorName);
router.get('/books/category/:Category', booksController.getBookByCategory);


router.get('/authors', authorsController.getAuthors);
router.get('/author/:Id', authorsController.getAuthorsById);


router.get('/bookshops/', bookshopsController.getBookshops);
router.get('/bookshop/:Id', bookshopsController.getBookshopsById);
router.get('/bookshop/:Id/books', bookshopsController.getBooksByBookshopId);
router.get('/bookshops/:BookshopName', bookshopsController.getBookshopsByName);

module.exports = router;