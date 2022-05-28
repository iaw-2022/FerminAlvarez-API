const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  booksController = require('../controllers/books.controller')

/**
 * @swagger
 * /books:
 *   post:
 *     description: Use to request all books.
 *     tags: 
 *       - Books
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Filters.
 *         schema:
 *           type: object
 *           properties:
 *             authors:
 *               type: array
 *               items:
 *                  type: array
 *                  items:
 *                      type: integer
 *               example: [1,2]
 *             bookshops:
 *               type: array
 *               items:
 *                  type: array
 *                  items:
 *                      type: integer
 *               example: [1,2]
 *             min_price:
 *               type: integer
 *               example: 100
 *             max_price:
 *               type: integer
 *               example: 4800
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter/body
 *       '404':
 *         description: Not found
 */
router.post('/books', booksController.getBooks);

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