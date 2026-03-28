const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/orderController');

router.post('/',           ctrl.createOrder);
router.get('/all',         ctrl.getAllOrders);
router.get('/',            ctrl.getOrders);
router.get('/:id',         ctrl.getOrder);
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
