const { Router } = require('express');
const checkAuth = require('../checkAuth');
const router = Router();

const  suscribersController = require('../controllers/suscribers.controller')

/**
 * @swagger
 * /suscribers/{id}:
 *   get:
 *     description: Use to request subscribed books
 *     security: 
 *          - bearerAuth: []
 *     tags: 
 *       - Suscribers
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the susciber
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter/token
 *       '404':
 *         description: Not found
 */
router.get('/suscribers/:Id', checkAuth, suscribersController.getSuscriberById);

/**
 * @swagger
 * /suscribers/:
 *   post:
 *     description: Use to request subscribed books
 *     security: 
 *          - bearerAuth: []
 *     tags: 
 *       - Suscribers
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Filters.
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             ISBN:
 *               type: integer
 *               example: 9788418037238
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter/token
 *       '404':
 *         description: Not found
 */
router.post('/suscribers/', checkAuth, suscribersController.applySuscription);

/**
 * @swagger
 * /suscribers/:
 *   delete:
 *     description: Use to request subscribed books
 *     security: 
 *          - bearerAuth: []
 *     tags: 
 *       - Suscribers
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Filters.
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             ISBN:
 *               type: integer
 *               example: 9788418037238
 *     responses:
 *       '200':
 *         description: Sucessful response
 *       '400':
 *         description: Invalid parameter/token
 *       '404':
 *         description: Not found
 */
router.delete('/suscribers/', checkAuth, suscribersController.removeSuscription);

module.exports = router;