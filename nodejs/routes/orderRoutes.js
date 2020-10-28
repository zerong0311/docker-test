const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const middleware = require('../middleware/middleware.js');


//router.use(authController.protect);   //no auth in this demo.

router.use(middleware.log);


router.post('/orders',orderController.createOrder)
//router.get('/orders',orderController.findOne);

router.get('/orders',orderController.getList);
router.get('/ping',  (req, res) =>{
    console.log("someone pinging");
    res.status(200).send({"success":"successsss"})
});



module.exports = router;