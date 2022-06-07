const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/order.js');

router.route('/')
.get(OrderController.getAllOrders)
.post(OrderController.createOrder);

router.get('/id/:id', OrderController.getOrderById);
router.get('/customer/:id', OrderController.getOrdersForCustomer);
router.get('/delete/:id', OrderController.deleteOrder); 

router.get('/products/:id', OrderController.getOrderProducts);
router.get('/product/:id', OrderController.getOrdersForProduct);

router.put('/:id', OrderController.updateOrder);

router.post('/product/add', OrderController.addProduct);

module.exports = router;