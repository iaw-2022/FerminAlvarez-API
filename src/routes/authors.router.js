const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  authorsController = require('../controllers/authors.controller')

router.get('/authors', authorsController.getAuthors);
router.get('/author/:Id', authorsController.getAuthorsById);
router.get('/author/books/:Id', authorsController.getBookByAuthorId);

module.exports = router;