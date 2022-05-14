const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  categoriesController = require('../controllers/categories.controller')

router.get('/categories/', categoriesController.getCategories);
router.get('/categories/books/:Id', categoriesController.getBookByCategoryId);

module.exports = router;