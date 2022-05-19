const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  authorsController = require('../controllers/authors.controller')

/**
 * @swagger
 * /authors:
 *   get:
 *     description: Use to request all authors of books available.
 *     tags: 
 *       - Authors
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/authors', authorsController.getAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     description: Use to request a author.
 *     tags: 
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the author
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/authors/:Id', authorsController.getAuthorsById);

/**
 * @swagger
 * /authors/{id}/books:
 *   get:
 *     description: Use to request a books written by an author.
 *     tags: 
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the author
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/authors/:Id/books', authorsController.getBookByAuthorId);

module.exports = router;