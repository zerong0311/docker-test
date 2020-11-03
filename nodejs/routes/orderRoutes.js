const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/orders',orderController.createOrder);
router.get('/orders',orderController.getList);
router.patch('/orders/:id',orderController.takeOrder);



module.exports = router;