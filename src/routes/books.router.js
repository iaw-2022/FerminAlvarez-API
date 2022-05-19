const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  booksController = require('../controllers/books.controller')

/**
 * @swagger
 * /books:
 *   get:
 *     description: Use to request all books.
 *     tags: 
 *       - Books
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/books', booksController.getBooks);

/**
 * @swagger
 * /books/{ISBN}:
 *   get:
 *     description: Use to request a book.
 *     tags: 
 *       - Books
 *     parameters:
 *       - in: path
 *         name: ISBN
 *         schema:
 *           type: integer
 *         required: true
 *         description: ISBN of the book
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/books/:ISBN', booksController.getBookByISBN);
router.get('/books/author/:AuthorName', booksController.getBookByAuthorName);
router.get('/books/category/:Category', booksController.getBookByCategory);
/**
 * @swagger
 * /books/{ISBN}/prices:
 *   get:
 *     description: Use to request a book price in bookshops.
 *     tags: 
 *       - Books
 *     parameters:
 *       - in: path
 *         name: ISBN
 *         schema:
 *           type: integer
 *         required: true
 *         description: ISBN of the book
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/books/:ISBN/prices', booksController.getBookPrice);

module.exports = router;