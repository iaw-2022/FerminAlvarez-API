const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  authorsController = require('../controllers/authors.controller')

router.get('/authors', authorsController.getAuthors);
router.get('/author/:Id', authorsController.getAuthorsById);

module.exports = router;