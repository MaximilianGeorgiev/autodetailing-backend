const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.js');
const AuthUtils = require("../utils/auth.js");

router.get('/', ProductController.getAllProducts);
router.post('/', AuthUtils.validateToken, ProductController.createProduct);

router.get('/id/:id', ProductController.getProductById);
router.get('/title/:title', ProductController.getProductByTitle);
router.get('/delete/:id', AuthUtils.validateToken, ProductController.deleteProduct); 

router.put('/:id', AuthUtils.validateToken, ProductController.updateProduct);

module.exports = router;