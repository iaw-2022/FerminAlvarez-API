const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  bookshopsController = require('../controllers/bookshops.controller')

router.get('/bookshops/', bookshopsController.getBookshops);
router.get('/bookshop/:Id', bookshopsController.getBookshopsById);
router.get('/bookshop/:Id/books', bookshopsController.getBooksByBookshopId);
router.get('/bookshop/:Id/book/:ISBN', bookshopsController.getBookFromBookshop);
router.get('/bookshops/:BookshopName', bookshopsController.getBookshopsByName);

module.exports = router;