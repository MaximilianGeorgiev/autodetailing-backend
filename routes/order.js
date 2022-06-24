const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/order.js');
const AuthUtils = require("../utils/auth.js");

router.get("/", AuthUtils.validateToken, OrderController.getAllOrders)
router.post("/", OrderController.createOrder);

router.get('/id/:id', OrderController.getOrderById);
router.get('/customer/:id', OrderController.getOrdersForCustomer);
router.get('/delete/:id', AuthUtils.validateToken, OrderController.deleteOrder); 
router.get('/delete/product/:id', AuthUtils.validateToken, OrderController.deleteOrdersWithProduct);
router.get('/delete/user/:id', AuthUtils.validateToken, OrderController.deleteOrdersForUser);

router.get('/products/:id', OrderController.getOrderProducts);
router.get('/product/:id', OrderController.getOrdersForProduct);

router.put('/:id', AuthUtils.validateToken, OrderController.updateOrder);

router.post('/product/add', OrderController.addProduct);

module.exports = router;