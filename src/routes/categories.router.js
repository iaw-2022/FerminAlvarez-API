const { Router } = require('express');
const router = Router();

const  categoriesController = require('../controllers/categories.controller')

/**
 * @swagger
 * /categories:
 *   get:
 *     description: Use to request all categories of books available.
 *     tags: 
 *       - Categories
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/categories/', categoriesController.getCategories);

/**
 * @swagger
 * /categories/books/{id}:
 *   get:
 *     description: Use to request a books of category.
 *     tags: 
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the category
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter
 *       '404':
 *         description: Not found
 */
router.get('/categories/books/:Id', categoriesController.getBookByCategoryId);

module.exports = router;