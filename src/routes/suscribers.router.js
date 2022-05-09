const { Router } = require('express');
const res = require('express/lib/response');
const router = Router();

const  suscribersController = require('../controllers/suscribers.controller')

router.get('/suscribers/:Id', suscribersController.getSuscriberById);
router.post('/suscribers/', suscribersController.applySuscription);

module.exports = router;