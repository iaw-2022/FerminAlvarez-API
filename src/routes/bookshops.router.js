const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  bookshopsController = require('../controllers/bookshops.controller')

/**
 * @swagger
 * /bookshops:
 *   get:
 *     description: Use to request all bookshops.
 *     tags: 
 *       - Bookshops
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/bookshops/', bookshopsController.getBookshops);

/**
 * @swagger
 * /bookshops/{id}:
 *   get:
 *     description: Use to request a bookshop.
 *     tags: 
 *       - Bookshops
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bookshop
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/bookshops/:Id', bookshopsController.getBookshopsById);

/**
 * @swagger
 * /bookshops/{id}/books:
 *   get:
 *     description: Use to request all books that the bookshop has.
 *     tags: 
 *       - Bookshops
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bookshop
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/bookshops/:Id/books', bookshopsController.getBooksByBookshopId);

/**
 * @swagger
 * /bookshops/{id}/book/{ISBN}:
 *   get:
 *     description: Use to request a book that the bookshop has.
 *     tags: 
 *       - Bookshops
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bookshop
 *       - in: path
 *         name: ISBN
 *         schema:
 *           type: string
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
router.get('/bookshops/:Id/book/:ISBN', bookshopsController.getBookFromBookshop);
router.get('/bookshops/:BookshopName', bookshopsController.getBookshopsByName);

module.exports = router;