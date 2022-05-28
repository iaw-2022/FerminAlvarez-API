const { Router } = require('express');
const checkAuth = require('../checkAuth');
const router = Router();

const  suscribersController = require('../controllers/suscribers.controller')

router.get('/suscribers/:Id', checkAuth, suscribersController.getSuscriberById);
router.post('/suscribers/', checkAuth, suscribersController.applySuscription);
router.delete('/suscribers/', checkAuth, suscribersController.removeSuscription);

module.exports = router;