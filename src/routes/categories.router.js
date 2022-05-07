const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  categoriesController = require('../controllers/categories.controller')

router.get('/categories/', categoriesController.getCategories);
router.post('/categories/', categoriesController.createCategory);

module.exports = router;